// app/api/chat/route.ts
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { reserveOpenAiCredits, finalizeOpenAiReservation, roughTokenEstimate, cancelOpenAiReservation } from "@/lib/ai/cost";

export const runtime = "edge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Health check
export async function GET() {
    return new Response("ok", { status: 200 });
}

type ClientMsg = { from: "ai" | "user"; text: string };

export async function POST(req: Request) {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { message, history = [] } = (await req.json()) as {
        message: string;
        history?: ClientMsg[];
    };

    // Prepare last 10 messages as plain input for context
    const historyAsItems = (history || []).slice(-10).map((m) => ({
        role: m.from === "ai" ? "assistant" : "user",
        content: m.text,
    }));

    // Add the current user message
    const input = [
        ...historyAsItems,
        { role: "user", content: message },
    ];

    // Pricing + reservation
    const messagesJson = JSON.stringify(input);
    const MAX_OUT = 400; // assumed upper bound for output tokens
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    // idempotency base: hash of user + messages
    const baseData = new TextEncoder().encode(userId + ":" + messagesJson);
    const hashBuf = await crypto.subtle.digest("SHA-256", baseData);
    const hashArr = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const idempotencyBase = `chat:${hashArr}`;

    let reservedAmount = 0;
    try {
        const resv = await reserveOpenAiCredits({
            userId,
            model,
            messagesJson,
            maxOutputTokens: MAX_OUT,
            idempotencyBase,
        });
        reservedAmount = resv.estimatedCost;
    } catch (e) {
        return new Response(JSON.stringify({ error: 'INSUFFICIENT_CREDITS' }), { status: 402 });
    }

    // Stream with stored prompt
    const stream = openai.responses.stream({
        prompt: {
            id: "pmpt_68cec8de7af48190bb9b30a965b696bc0ae4cd64a9a94eae",
            version: "9",
        },
        // @ts-ignore
        input,
        reasoning: { summary: "auto" },
        tools: [
            {
                type: "file_search",
                vector_store_ids: ["vs_68c32ad0666c819198424b323e0ba979"],
            },
        ],
        store: true,
        include: [
            "reasoning.encrypted_content",
            "web_search_call.action.sources",
        ] as any,
    });

    // Wrap async iterator → SSE
    const encoder = new TextEncoder();
    const sse = new ReadableStream({
        start(controller) {
            (async () => {
                try {
                    for await (const evt of stream) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
                        if ((evt as any).type === "response.completed") break;
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));

                    // finalize credits (use same estimates to net to zero delta)
                    const inputTokens = roughTokenEstimate(messagesJson);
                    const outputTokens = MAX_OUT;
                    await finalizeOpenAiReservation({
                        userId,
                        model,
                        inputTokens,
                        outputTokens,
                        idempotencyBase,
                        reservedAmount,
                    });
                } catch (err) {
                    // refund on error
                    await cancelOpenAiReservation({ userId, reservedAmount, idempotencyBase, model });
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: "error",
                                error: { message: String(err) },
                            })}\n\n`
                        )
                    );
                } finally {
                    controller.close();
                }
            })();
        },
        cancel() {
            // client aborted → refund
            cancelOpenAiReservation({ userId, reservedAmount, idempotencyBase, model }).catch(() => {})
        }
    });

    return new Response(sse, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
