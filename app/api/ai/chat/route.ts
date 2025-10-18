// app/api/ai/chat/route.ts
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { reserveOpenAiCredits, finalizeOpenAiReservation, roughTokenEstimate, cancelOpenAiReservation } from "@/lib/ai/cost";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Master system prompt for the AI area chat
const MASTER_PROMPT = `You are Dreamli's in-app AI assistant for the AI workspace.
You must only use and discuss the assets provided in this conversation's context: the "page image refs" and any "model thumbnails" supplied by the user.
- Do not make assumptions about private data or any assets not explicitly provided.
- If answering about an image or model, clearly reference which one you mean (e.g., "ref image #1" or "model thumbnail #2").
- Be helpful, concise, and actionable for creators using Dreamli to generate images and 3D models.
- If a user asks for operations you cannot perform directly, explain how they can proceed using the app (e.g., start an image job, try Meshy generation, etc.).
- Always respect privacy and do not reveal internal IDs.
`;

// Health check
export async function GET() {
  return new Response("ok", { status: 200 });
}

type ClientMsg = { from: "ai" | "user"; text: string };

type Body = {
  message: string;
  history?: ClientMsg[];
  locale?: string;
  imageUrls?: string[];          // page-scoped image refs (public URLs)
  modelImageUrls?: string[];     // model thumbnails (public URLs)
};

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message, history = [], imageUrls = [], modelImageUrls = [] } = (await req.json()) as Body;

  // Prepare last 12 messages as simple text turns
  const historyAsItems = (history || []).slice(-12).map((m) => ({
    role: m.from === "ai" ? "assistant" : "user",
    content: m.text,
  }));

  // Build text for rough pricing estimation (include URLs as text hints)
  const estText = JSON.stringify({
    history: historyAsItems,
    message,
    imageUrls,
    modelImageUrls,
  });

  const MAX_OUT = 600; // assumed upper bound for output tokens
  const model = process.env.OPENAI_MODEL_AI_CHAT || "gpt-5"; // allow override

  // Idempotency base: hash of user + content
  const baseData = new TextEncoder().encode(userId + ":" + estText);
  const hashBuf = await crypto.subtle.digest("SHA-256", baseData);
  const hashArr = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const idempotencyBase = `ai-chat:${hashArr}`;

  let reservedAmount = 0;
  try {
    const resv = await reserveOpenAiCredits({
      userId,
      model,
      messagesJson: estText,
      maxOutputTokens: MAX_OUT,
      idempotencyBase,
    });
    reservedAmount = resv.estimatedCost;
  } catch (e) {
    return new Response(JSON.stringify({ error: "INSUFFICIENT_CREDITS" }), { status: 402 });
  }

  // Construct Responses API content
  const contentBlocks: any[] = [];
  if (imageUrls && imageUrls.length) {
    for (const url of imageUrls) {
      if (typeof url === "string" && /^https?:\/\//i.test(url)) {
        contentBlocks.push({ type: "input_image", image_url: url });
      }
    }
  }
  if (modelImageUrls && modelImageUrls.length) {
    let idx = 0;
    for (const url of modelImageUrls) {
      if (typeof url === "string" && /^https?:\/\//i.test(url)) {
        idx += 1;
        contentBlocks.push({ type: "input_text", text: `Model thumbnail #${idx}` });
        contentBlocks.push({ type: "input_image", image_url: url });
      }
    }
  }
  contentBlocks.push({ type: "input_text", text: message });

  // Stream via OpenAI Responses API
  const stream = openai.responses.stream({
    model,
    input: [
      { role: "system", content: [{ type: "input_text", text: MASTER_PROMPT }] },
      { role: "user", content: contentBlocks },
    ],
    store: true,
  });

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

          // finalize credits (use estimates to net zero delta by default)
          const inputTokens = roughTokenEstimate(estText);
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
          await cancelOpenAiReservation({ userId, reservedAmount, idempotencyBase, model });
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: { message: String(err) } })}\n\n`
            )
          );
        } finally {
          try { controller.close(); } catch {}
        }
      })();
    },
    cancel() {
      cancelOpenAiReservation({ userId, reservedAmount, idempotencyBase, model }).catch(() => {});
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
