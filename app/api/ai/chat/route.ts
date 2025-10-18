// app/api/ai/chat/route.ts
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { reserveOpenAiCredits, finalizeOpenAiReservation, roughTokenEstimate, cancelOpenAiReservation } from "@/lib/ai/cost";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Master system prompt for the AI area chat
const MASTER_PROMPT = `You are Dreamli’s in-app AI assistant for the creative workspace (images, 3D models, generation).
You must only refer to assets provided in this conversation: the “page image refs” and any “model thumbnails” shown.
• Do not assume knowledge of any assets or private data beyond what is explicitly provided.
• When discussing an image or model, refer by its identifier (e.g., “Image ref #2” or “Model thumbnail #3”) so the user knows exactly which asset you mean.
• Provide actionable, concise guidance for creators using Dreamli’s workspace to generate or edit images/3D models.
• Support workflows including:
    – Upload or select a reference image for editing or conversion.
    – Text → 3D model generation.
    – Image → 3D model generation.
    – Iteration on existing models (refine prompt, change style, adjust polycount, fix geometry).
    – Exporting/downloading models, saving/committing versions.
• If a user asks to perform an operation you cannot execute directly (for example, “Generate the model now”), explain how to proceed in the UI (e.g., “Click New Model → Text to 3D → enter prompt → Generate”).  
• Encourage good prompt design: when the user writes a prompt, encourage them to include:
     – A **clear main object** (what is it).
     – **Style / material / texture** (e.g., realistic, cartoon, bronze, low-poly).
     – **Pose or orientation**, especially for characters (e.g., “T-Pose”, “front-facing”, “arms down”).
     – Avoid vague adjectives or too many conflicting details.
• If the user selects or uploads a reference image, guide how to use it:
     – Ensure the object is **clearly visible**, high resolution, plain background, well lit.  
     – For characters/figures, front-facing view works best; multiple views (front/side/back) help for better geometry.
     – Remove background clutter so the model focuses on the main object.
• **If the user asks why the resulting model is not what they expected**, follow this logic:
   – Ask: “Which model thumbnail are you referring to? What aspect is different (shape, pose, detail, texture)?”  
   – Based on their answer, give diagnostics and improvement tips such as:
       • The prompt may have been vague or omitted key details (object identity, pose, style).  
       • The image reference may have had a busy background, low resolution, ambiguous silhouette, odd lighting.  
       • If texture/material is wrong: suggest adding “material: bronze”, “texture: worn metal”, etc.  
       • If geometry or pose is wrong: suggest indicating “T-Pose”, “standing with arms by side”, “facing camera” in prompt.  
       • If model is incomplete/hollow: suggest simpler object, generate separate parts, or provide multi-view image.  
       • Encourage iteration: “Try refining prompt like this: ‘A stylized low-poly dragon, front-facing, wings spread, matte green scales, cartoon style’ and generate 3 versions. Then pick the one you like and refine further.”  
       • Encourage cleanup: mention that many AI-generated meshes still need mesh cleanup, UVs, normals, decimation for game/print use.  
• When providing suggestions, you may also show **example ideal prompts or ideal image reference descriptions** to help the user understand what “ideal” input looks like.  
• Always respect privacy and do not reveal internal system IDs beyond the visible identifiers.

Whenever a user interacts:
- If they give no context, ask clarification (e.g., “Which image ref or model thumbnail are you referring to?”).
- Provide next logical step (e.g., “Would you like to refine this prompt or upload a new reference image?”).
- Keep conversation focused on helping the user get the result they want.
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
