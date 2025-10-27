// app/api/ai/chat/route.ts
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { reserveOpenAiCredits, finalizeOpenAiReservation, roughTokenEstimate, cancelOpenAiReservation } from "@/lib/ai/cost";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const VERBOSE = process.env.AI_VERBOSE_LOG === '1';

// Embed external images as data URLs so OpenAI doesn't need to download from remote hosts (e.g., meshy)
async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return null;
    let hostname = '';
    try { hostname = new URL(url).hostname; } catch {}
    const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const headers: Record<string, string> = {
      Accept: 'image/*,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    };
    if (isMeshy) {
      // Some CDNs are picky; include a plausible Referer to avoid 403/InvalidKey when fetched by server
      headers['Referer'] = 'https://dreamli.ai/';
    }
    const res = await fetch(url, {
      signal: controller.signal,
      headers,
      redirect: 'follow',
    } as RequestInit);
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || 'application/octet-stream';
    const mime = ct.split(';')[0] || 'application/octet-stream';
    const buf = Buffer.from(await res.arrayBuffer());
    const b64 = buf.toString('base64');
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
}

async function toInputImage(url: string): Promise<{ type: 'input_image'; image_url: string } | null> {
  try {
    if (typeof url !== 'string') return null;
    // If the client already provided a data URL, pass it through directly
    if (/^data:/i.test(url)) {
      return { type: 'input_image', image_url: url } as const;
    }
    // Otherwise, try to embed HTTP(S) as data URL to avoid remote fetches within OpenAI
    const dataUrl = await fetchAsDataUrl(url);
    if (dataUrl) return { type: 'input_image', image_url: dataUrl } as const;
    // If embedding failed, only fall back to raw URL for non-problematic hosts
    if (/^https?:\/\//i.test(url)) {
      let hostname = '';
      try { hostname = new URL(url).hostname; } catch {}
      const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
      if (!isMeshy) {
        return { type: 'input_image', image_url: url } as const;
      }
      // For meshy.ai signed URLs, avoid passing raw URL to OpenAI to prevent InvalidKey/403 errors
      return null;
    }
    return null;
  } catch {
    // As a last resort, pass through the original URL if it looks like HTTP(S) and is not meshy.ai
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      let hostname = '';
      try { hostname = new URL(url).hostname; } catch {}
      const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
      if (!isMeshy) {
        return { type: 'input_image', image_url: url } as const;
      }
    }
    return null;
  }
}

// Master system prompt for the AI area chat
const MASTER_PROMPT = `You are Dreamli’s in-app AI assistant for the creative workspace (images, 3D models, generation).
You must only refer to assets provided in this conversation: the “page image refs” and any “model thumbnails” shown.
• Do not assume knowledge of any assets or private data beyond what is explicitly provided.
• When discussing an image or model, refer by its identifier (e.g., “Image ref #2” or “Model thumbnail #3”) so the user knows exactly which asset you mean.
• Provide actionable, concise guidance for creators using Dreamli’s workspace to generate or edit images/3D models.

TOOL USE POLICY (important)
• You have two function tools:
  1) generate_images(prompt, image_url, image_urls, refs) — Do NOT call this directly. The UI will call this when the user clicks a button you propose.
  2) propose_actions(actions[]) — Use this to present clickable next‑step buttons to the user (e.g., “Generate images”, “Generate angles”, “Generate with selected refs”). The client will render these and run them when clicked.
• When the user indicates they want images generated (e.g., “make them”, “generate images”, “turnaround”), propose 1–3 clear actions via propose_actions instead of starting generation yourself.
• At the end of most replies, after giving your short advice, you MUST call propose_actions with 1–3 buttons so the user always has something to click next. Prefer:
   – Generate images (include a concise, production‑ready prompt you authored)
   – Generate angles (meta.angles: ["front view","side view","back view","3/4 view"]) when turnarounds/orthographic views are relevant
   – Generate with selected refs (include refs/image_url/image_urls if available)
• Use a concise, production-ready prompt derived from the user’s request and context in the proposed action metadata. If relevant refs were provided in this chat (page image refs or model thumbnails), include them in the action via refs/image_url/image_urls. If none are available, omit them — the client may attach currently selected refs.
• If critical details are missing, ask at most one short clarifying question, then propose actions with a safe default.
• Only for actions you truly cannot execute (e.g., billing, account settings), explain the UI steps instead.

• Support workflows including:
    – Upload or select a reference image for editing or conversion.
    – Text → 3D model generation.
    – Image → 3D model generation.
    – Iteration on existing models (refine prompt, change style, adjust polycount, fix geometry).
    – Exporting/downloading models, saving/committing versions.
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
- When they ask you to generate or make images, call the tool as described above, then continue with brief guidance.
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
  const reqId = Math.random().toString(36).slice(2, 10);
  const startedAt = Date.now();
  const t = () => `${(Date.now() - startedAt).toString().padStart(4, ' ')}ms`;
  const log = (...args: any[]) => console.log(`[AI/CHAT ${reqId}]`, ...args);
  const warn = (...args: any[]) => console.warn(`[AI/CHAT ${reqId}]`, ...args);
  const err = (...args: any[]) => console.error(`[AI/CHAT ${reqId}]`, ...args);
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message, history = [], imageUrls = [], modelImageUrls = [] } = (await req.json()) as Body;
  log('POST', { msgLen: (message || '').length, history: history.length, imageUrls: imageUrls.length, modelImageUrls: modelImageUrls.length });

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
    warn('RESERVE_FAIL', String(e));
    return new Response(JSON.stringify({ error: "INSUFFICIENT_CREDITS" }), { status: 402 });
  }

  // Construct Responses API content
  const contentBlocks: any[] = [];
  // Track provided vs. successfully embedded vs. failed (for diagnostics)
  let pageProvided = 0, pageEmbedded = 0, pageFailed = 0;
  let modelProvided = 0, modelEmbedded = 0, modelFailed = 0;

  if (Array.isArray(imageUrls) && imageUrls.length) {
    for (const url of imageUrls) {
      if (typeof url === 'string' && ( /^https?:\/\//i.test(url) || /^data:/i.test(url) )) {
        pageProvided++;
        const embedded = await toInputImage(url);
        if (embedded) { contentBlocks.push(embedded); pageEmbedded++; }
        else { pageFailed++; }
      }
    }
  }

  if (Array.isArray(modelImageUrls) && modelImageUrls.length) {
    let idx = 0;
    for (const url of modelImageUrls) {
      if (typeof url === 'string' && ( /^https?:\/\//i.test(url) || /^data:/i.test(url) )) {
        modelProvided++;
        idx += 1; // always enumerate so the AI can reference a thumbnail by number
        contentBlocks.push({ type: 'input_text', text: `Model thumbnail #${idx}` });
        const embedded = await toInputImage(url);
        if (embedded) { contentBlocks.push(embedded); modelEmbedded++; }
        else { modelFailed++; }
      }
    }
  }

  contentBlocks.push({ type: 'input_text', text: message });

  // Determine if we should force a tool call for this turn (simple intent heuristic)
  const m = (message || '').toLowerCase();
  log('EMBED', {
    pageRefsProvided: pageProvided,
    pageRefsEmbedded: pageEmbedded,
    pageRefsFailed: pageFailed,
    modelThumbsProvided: modelProvided,
    modelThumbsEmbedded: modelEmbedded,
    modelThumbsFailed: modelFailed,
  });
  // Intent detection: broaden phrases and add a soft intent when refs are embedded
  const strongPhrases = [
    'make them',
    'make it',
    'make images',
    'make them for me',
    'generate images',
    'generating images',
    'create images',
    'produce images',
    'render images',
    'start generating',
    'start generating images',
    'start images',
    'turnaround',
    'turnarounds',
    'guide sheet',
    'model sheet',
    'orthographic',
    'orthographs',
    'angles',
    'views',
    'variants',
    'variations',
  ];
  const softPhrases = [
    'make ',
    'generate',
    'create',
    'render',
    'produce',
    'start',
    'begin',
    'do it',
    'do this',
    'do that',
  ];
  const hasStrong = strongPhrases.some((kw) => m.includes(kw));
  const hasSoft = softPhrases.some((kw) => m.includes(kw));
  const embedsCount = pageEmbedded + modelEmbedded;
  const shouldForce = hasStrong || (embedsCount > 0 && hasSoft);
  const toolChoice: any = 'auto';
  log('TOOL_CHOICE', toolChoice);

  // Stream via OpenAI Responses API
  const stream = openai.responses.stream({
    model,
    input: [
      { role: "system", content: [{ type: "input_text", text: MASTER_PROMPT }] },
      { role: "user", content: contentBlocks },
    ],
    tools: [
      {
        type: "function",
        name: "generate_images",
        description: "Generate or vary images from a prompt, optionally guided by a reference image URL.",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string", description: "The text prompt describing what to generate." },
            image_url: { type: "string", description: "Optional HTTP URL of a selected reference image to guide generation." },
            image_urls: { type: "array", items: { type: "string" }, description: "Optional list of reference image URLs to guide generation (one or more)." },
            refs: { type: "array", items: { type: "string" }, description: "Alias for image_urls; one or more reference image URLs." },
          },
          required: ["prompt"],
          additionalProperties: false,
        },
      },
      {
        type: "function",
        name: "propose_actions",
        description: "Propose a small set of actionable buttons for the UI (e.g., Generate images, Create turnaround). The client will render these and run them when clicked.",
        parameters: {
          type: "object",
          properties: {
            actions: {
              type: "array",
              description: "List of button-like actions to show the user (max 5).",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Short button label shown to the user." },
                  kind: { type: "string", description: "Action identifier. Use 'generate_images' to start image generation. Other kinds may be ignored by the client." },
                  prompt: { type: "string", description: "Optional prompt to use if this action triggers generation." },
                  refs: { type: "array", items: { type: "string" }, description: "Optional list of reference image URLs to use for this action." },
                  confirm: { type: "string", description: "Optional confirmation text the client may show before running the action." },
                  meta: { type: "object", description: "Optional extra metadata for the client.", additionalProperties: true },
                },
                required: ["title"],
                additionalProperties: false,
              },
            },
          },
          required: ["actions"],
          additionalProperties: false,
        },
      },
    ],
    tool_choice: toolChoice,
    store: true,
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream({
    start(controller) {
      (async () => {
        try {
          // Initial debug frame to help client-side diagnostics
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'debug', embed: { pageRefs: { provided: pageProvided, embedded: pageEmbedded, failed: pageFailed }, modelThumbs: { provided: modelProvided, embedded: modelEmbedded, failed: modelFailed } }, tool_choice: toolChoice, model })}\n\n`));
          } catch {}
          let evCount = 0;
          let earlyClosed = false;
          for await (const evt of stream) {
            evCount++;
            const evType = (evt as any)?.type || 'unknown';
            if (VERBOSE && evCount <= 5) log('EV', evCount, evType);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
            const typeStr = String((evt as any)?.type || '');
            if (typeStr.includes('tool_call.completed')) {
              // Synthesize a completion so the client doesn't hang waiting for the model to follow up after tool execution.
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'response.completed', reason: 'tool_call_completed' })}\n\n`));
              earlyClosed = true;
              break;
            }
            if (typeStr === 'response.completed') break;
          }
          if (VERBOSE) log('EV_SUMMARY', { evCount, earlyClosed });
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));

          // finalize credits (use estimates to net zero delta by default)
          const inputTokens = roughTokenEstimate(estText);
          const outputTokens = MAX_OUT;
          log('FINALIZE_BEGIN', { reservedAmount, inputTokens, outputTokens });
          await finalizeOpenAiReservation({
            userId,
            model,
            inputTokens,
            outputTokens,
            idempotencyBase,
            reservedAmount,
          });
          log('FINALIZE_OK');
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
