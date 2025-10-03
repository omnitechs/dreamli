// app/api/chat/route.ts
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Health check
export async function GET() {
    return new Response("ok", { status: 200 });
}

type ClientMsg = { from: "ai" | "user"; text: string };

export async function POST(req: Request) {
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
                } catch (err) {
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
