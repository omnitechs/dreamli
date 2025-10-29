// app/api/ai/chat/route.ts
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import {
    reserveOpenAiCredits,
    finalizeOpenAiReservation,
    roughTokenEstimate,
    cancelOpenAiReservation,
} from "@/lib/ai/cost";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const VERBOSE_LVL = parseInt(process.env.AI_VERBOSE_LOG || "0", 10) || 0;
const VERBOSE = VERBOSE_LVL >= 1;
const VERBOSE2 = VERBOSE_LVL >= 2;

/** -------- in-memory dedupe for dev/double mounts -------- */
const inflightTxnIds = new Set<string>();
function claimTxn(id?: string): boolean {
    if (!id) return true;
    if (inflightTxnIds.has(id)) return false;
    inflightTxnIds.add(id);
    return true;
}
function releaseTxn(id?: string) {
    if (!id) return;
    inflightTxnIds.delete(id);
}

// ---------- helpers (redaction + embedding) ----------
function redactDataUrl(u: string): string {
    if (typeof u !== "string") return String(u);
    if (u.startsWith("data:")) return `data:[${u.length} bytes]`;
    return u;
}
function sanitizeBlock(block: any) {
    if (!block || typeof block !== "object") return block;
    if (block.type === "input_image") {
        return { ...block, image_url: redactDataUrl(block.image_url) };
    }
    return block;
}
function summarizeContentBlocks(blocks: any[]) {
    let texts = 0,
        images = 0,
        textBytes = 0,
        imageBytes = 0;
    for (const b of blocks || []) {
        if (b?.type === "input_text") {
            texts++;
            textBytes += b.text ? String(b.text).length : 0;
        } else if (b?.type === "input_image") {
            images++;
            imageBytes += b.image_url ? String(b.image_url).length : 0;
        }
    }
    return {
        total: (blocks || []).length,
        input_text: texts,
        input_image: images,
        text_bytes: textBytes,
        image_bytes: imageBytes,
    };
}
function sanitizeInputForLog(input: any[]) {
    return (input || []).map((entry) => {
        if (!entry || typeof entry !== "object") return entry;
        const content = Array.isArray(entry.content)
            ? entry.content.map(sanitizeBlock)
            : entry.content;
        return { ...entry, content };
    });
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
    try {
        if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return null;
        let hostname = "";
        try {
            hostname = new URL(url).hostname;
        } catch {}
        const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        const headers: Record<string, string> = {
            Accept: "image/*,*/*;q=0.8",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        };
        if (isMeshy) headers["Referer"] = "https://dreamli.ai/";
        const res = await fetch(url, {
            signal: controller.signal,
            headers,
            redirect: "follow",
        } as RequestInit);
        clearTimeout(timer);
        if (!res.ok) return null;
        const ct = res.headers.get("content-type") || "application/octet-stream";
        const mime = ct.split(";")[0] || "application/octet-stream";
        const buf = Buffer.from(await res.arrayBuffer());
        const b64 = buf.toString("base64");
        return `data:${mime};base64,${b64}`;
    } catch {
        return null;
    }
}
async function toInputImage(
    url: string
): Promise<{ type: "input_image"; image_url: string } | null> {
    try {
        if (typeof url !== "string") return null;
        if (/^data:/i.test(url)) return { type: "input_image", image_url: url };
        const dataUrl = await fetchAsDataUrl(url);
        if (dataUrl) return { type: "input_image", image_url: dataUrl };
        if (/^https?:\/\//i.test(url)) {
            let hostname = "";
            try {
                hostname = new URL(url).hostname;
            } catch {}
            const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
            if (!isMeshy) return { type: "input_image", image_url: url };
            return null;
        }
        return null;
    } catch {
        if (typeof url === "string" && /^https?:\/\//i.test(url)) {
            let hostname = "";
            try {
                hostname = new URL(url).hostname;
            } catch {}
            const isMeshy = /(^|\.)meshy\.ai$/i.test(hostname);
            if (!isMeshy) return { type: "input_image", image_url: url };
        }
        return null;
    }
}

// ---------- system prompt ----------
const MASTER_PROMPT = `
You are Dreamli’s in-app AI designer. Your #1 job is to make the user’s image(s) READY for 3D while preserving the original look as strictly as possible.

# ROLE & OBJECTIVE
• Act like a senior 3D designer/technical director. Tone: helpful expert colleague. Be practical and clear.
• Default to **STRICT FIDELITY**: reproduce the original design exactly; no invention or restyling unless the user opts out.
• Optimize for 3D readiness with the smallest changes (cleanup, resolution, lighting normalization, background removal, angle coverage).
• If the image is good (\`READY\`) or just needs minor fixes (\`ALMOST READY\`), **always propose the 3D model step** alongside any minor fix suggestions.

# FIDELITY POLICY (NON-NEGOTIABLE BY DEFAULT)
• **Strict Fidelity is ON** unless the user explicitly opts out (“stylize”, “change design”, “new version”, etc.).
• Allowed: background/alpha cleanup; crop/re-center without trimming; mild exposure/contrast normalization; denoise/deJPEG; edge-aware sharpening; upscale; mild neutral white balance; glare/shadow reduction that doesn’t hide or change features; perspective correction without distorting proportions.
• Disallowed without consent: changing geometry, silhouette, proportions, pose, materials, patterns, logos/markings, colors/palette, textures; adding/removing parts; scene/prop additions; lens/FOV changes that alter perceived shape.
• If a requested fix would violate strict fidelity, **ask first**: “This changes the original design. Proceed?”

# CONVERSATION CONTRACT (STRICT)
• Produce a short, user-facing **natural language** reply FIRST (2–5 sentences).
• THEN make **EXACTLY ONE** function call to **propose_actions** as the FINAL event of your turn.
• Do NOT call other tools directly—only propose them via \`propose_actions\`.
• Never include raw JSON in your text; only the tool call returns actions.

# ASSET DISCIPLINE (Internal Thought Process)
• (Internal) Refer to inputs as “Image ref #N”; output previews as “Model thumbnail #N”.
• (Internal) Use only assets present in this conversation.
• (Internal) Choose a **Canonical Reference** (“Image ref #K”) when multiple refs exist.

# DEFAULT BEHAVIOR (IMPORTANT)
• **Only propose 'Generate angles'** if (a) the user explicitly asks for different views, **or** (b) a previous 3D result wasn’t satisfactory due to missing angles/occlusion (state this briefly).
• Otherwise, propose **'Generate images — Cleanup + 2D with 3D cues (Strict Fidelity)'** as the primary action so future 3D understands volume better. “3D cues” = subtle volumetric shading, cast/contact shadows, rim light, depth falloff, view-consistent occlusion—**without** restyling or changing design.

# MICRO-BRIEF (ASK AT MOST ONE QUESTION)
Ask ONE tight question only if essential; otherwise use safe fidelity defaults and propose actions.

# IMAGE READINESS — PRIVATE CHECKLIST (compute silently; summarize briefly)
(Internal) Label READY ✅ / ALMOST READY ⚠️ / NOT READY ❌ by: subject clarity, full in-frame object, neutral background, even lighting, high-res, minimal noise, no overlays, pose suitability, multi-view consistency if provided.
When READY: propose **Generate 3D model** (plus optional cleanup).
When ALMOST READY: propose **Cleanup + 2D with 3D cues** **and** **Generate 3D model**.
When NOT READY: propose essential fidelity-safe fixes.

# HARD GEOMETRY & OCCLUSION RULES
• Treat subject as a **real 3D volume**. Enforce physical occlusion; far-side features hidden.
• No duplicated/mirrored features. Preserve silhouettes. No front details projected to side/back.

# MULTI-VIEW RECOMMENDATION (Per-Angle Prompts Required)
If—and only if—angles are needed (per DEFAULT BEHAVIOR above), propose \`kind: 'generate_angles'\` with:
  • \`meta.angles\`: the **missing** views from ["front view","side view","back view","3/4 view"]
  • \`meta.prompts\`: **per-angle descriptive prompts**
Rules for each angle prompt:
- Start: “**Strict fidelity to the canonical reference. Do not alter design.**”
- Name the angle (e.g., “Right side view”).
- Embed occlusion constraints inline (volume, physical occlusion, far-side hidden, silhouette correctness).
- Neutral studio: full object in frame, even softbox lighting, neutral background, high-res, sharp edges, no text/props.

# ACTIONS YOU CAN PROPOSE (END WITH 1–3)
Prefer:
1) **Generate images — Cleanup + 2D with 3D cues (Strict Fidelity)** — default primary action. Use the canonical ref; crisp, studio, **add volumetric cues only**, no restyle.
2) **Generate 3D model (Strict Fidelity)** — propose if READY or ALMOST READY. Include usage/polycount; attach refs; stress “do not alter design”.
3) **Generate angles (Strict Fidelity)** — only when necessary; include \`meta.angles\` **and** \`meta.prompts\` (one prompt per angle).

# PROMPT COOKBOOK (succinct, fidelity-locked)
A) Cleanup / Remove Background (Strict Fidelity)
“From the attached image (Canonical Reference): remove background; center the [OBJECT]; keep the entire object fully in frame; increase clarity and sharpness; even soft studio lighting; neutral white/gray or transparent background; high resolution; sharp edges; no text or extra items. **Preserve original silhouette, proportions, materials, textures, markings, and colors. Do not add or remove features.**”

B) Improve Resolution / Clarity (Strict Fidelity)
“As a high-resolution studio shot of the **same** [OBJECT]: full object in frame, crisp edges, even softbox lighting, neutral white background, no text/props. **No creative changes.**”

C) **2D with 3D Cues (Strict Fidelity)**  ← use for default “improve image”
“Recreate the [OBJECT] to match the canonical reference exactly (silhouette, proportions, materials, palette, markings). Add **subtle volumetric shading**, contact shadows, and gentle rim light to communicate depth; maintain neutral background; high resolution; sharp edges; **no restyle, no added parts**; enforce physical occlusion (far-side features hidden).”

D) 3D Model (Usage-aware, Strict Fidelity)
“Create a **strict-fidelity** 3D model of [OBJECT] for [USAGE] with [POLYCOUNT]. **Do not alter the design**—match the provided images exactly. Output [GLB/FBX/STL]. If 3D print: manifold; min wall thickness [X mm]. If game: target ~[tri count]; unwrap UVs; provide PBR maps.”

# OUTPUT SHAPE EACH TURN (MANDATORY)
1) A short, natural reply (2–5 sentences).
2) Then a SINGLE \`propose_actions\` call with 1–3 buttons (default includes “Cleanup + 2D with 3D cues”).
(End of prompt)
`;

// ---------- health ----------
export async function GET() {
    return new Response("ok", { status: 200 });
}

type ClientMsg = { from: "ai" | "user"; text: string };
type Body = {
    message: string;
    history?: ClientMsg[];
    locale?: string;
    imageUrls?: string[];
    modelImageUrls?: string[];
    clientTxnId?: string; // NEW: client-side idempotency
};

// ---------- SSE helpers ----------
function extractTextFromEvt(evt: any): string {
    if (!evt) return "";
    try {
        const tType = String(evt?.type || "");
        if (
            /tool|function_call/.test(tType) ||
            /response\.(tool|function)_call(\.|$)/.test(tType)
        ) {
            return "";
        }
        if (typeof evt?.delta === "string") return evt.delta;
        if (
            evt?.type === "content_block_delta" &&
            evt?.delta?.type === "text_delta" &&
            typeof evt?.delta?.text === "string"
        ) {
            return evt.delta.text;
        }
        if (typeof evt?.delta?.text === "string") return evt.delta.text;
        if (typeof evt?.delta?.content === "string") return evt.delta.content;

        if (Array.isArray(evt?.output)) {
            let out = "";
            for (const part of evt.output) {
                if (typeof part?.delta === "string") out += part.delta;
                if (Array.isArray(part?.content)) {
                    for (const c of part.content) {
                        if (typeof c?.delta === "string") out += c.delta;
                    }
                }
            }
            return out;
        }
        if (Array.isArray(evt?.content)) {
            let out = "";
            for (const c of evt.content) {
                if (typeof c?.delta === "string") out += c.delta;
            }
            return out;
        }
        if (Array.isArray(evt?.delta?.content)) {
            let out = "";
            for (const c of evt.delta.content) {
                if (typeof c?.text === "string") out += c.text;
                else if (typeof c?.delta === "string") out += c.delta;
            }
            return out;
        }
    } catch {}
    return "";
}

function detectAndAccumulateToolCall(
    evt: any,
    toolBuf: Record<string, { name?: string; args: string; done?: boolean }>,
    toolCalls: Array<{ name: string; args: any }>
) {
    const tType = String(evt?.type || "");
    if (
        !/tool|function_call/.test(tType) &&
        !/response\.(tool|function)_call(\.|$)/.test(tType)
    )
        return;

    const callId = String(
        evt.call_id || evt.id || evt.tool_call_id || evt.callId || "default"
    );
    const buf = (toolBuf[callId] ||= { args: "" });

    const name =
        evt.name ||
        evt.tool_name ||
        evt.function_name ||
        evt?.call?.name ||
        evt?.tool?.name ||
        evt?.function_call?.name;

    if (typeof name === "string" && !buf.name) buf.name = name;

    const argDelta =
        evt.arguments_delta ||
        evt.args_delta ||
        evt?.delta?.arguments ||
        evt.arguments ||
        evt?.function_call?.arguments_delta;

    if (typeof argDelta === "string") buf.args += argDelta;

    const isCompleted =
        tType.endsWith("completed") ||
        tType.endsWith(".done") ||
        tType === "response.tool_call" ||
        tType === "response.function_call" ||
        (evt as any)?.status === "completed";

    if (isCompleted) {
        buf.done = true;
        let parsed: any = {};
        try {
            parsed = buf.args ? JSON.parse(buf.args) : {};
        } catch {}
        toolCalls.push({ name: buf.name || "unknown_tool", args: parsed });
    }
}

// ---------- POST ----------
export async function POST(req: Request) {
    const reqId = Math.random().toString(36).slice(2, 10);
    const log = (...args: any[]) => console.log(`[AI/CHAT ${reqId}]`, ...args);
    const warn = (...args: any[]) => console.warn(`[AI/CHAT ${reqId}]`, ...args);

    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { message, history = [], imageUrls = [], modelImageUrls = [], clientTxnId } =
        (await req.json()) as Body;

    // in-process dedupe (helps with double mounts/dev)
    if (!claimTxn(clientTxnId)) {
        warn("DROPPED_DUPLICATE_TXN", clientTxnId);
        return new Response(JSON.stringify({ duplicate: true }), { status: 409 });
    }

    log("POST", {
        msgLen: (message || "").length,
        history: history.length,
        imageUrls: imageUrls.length,
        modelImageUrls: modelImageUrls.length,
        clientTxnId,
    });

    const historyAsItems = (history || []).slice(-12).map((m) => ({
        role: m.from === "ai" ? "assistant" : "user",
        content: m.text,
    }));

    const estText = JSON.stringify({
        history: historyAsItems,
        message,
        imageUrls,
        modelImageUrls,
    });

    const MAX_OUT = 600;
    const model = process.env.OPENAI_MODEL_AI_CHAT || "gpt-5";

    const baseData = new TextEncoder().encode(userId + ":" + estText);
    const hashBuf = await crypto.subtle.digest("SHA-256", baseData);
    const hashArr = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
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
        releaseTxn(clientTxnId);
        warn("RESERVE_FAIL", String(e));
        return new Response(JSON.stringify({ error: "INSUFFICIENT_CREDITS" }), {
            status: 402,
        });
    }

    // ---------- construct content ----------
    const contentBlocks: any[] = [];
    let pageProvided = 0,
        pageEmbedded = 0,
        pageFailed = 0;
    let modelProvided = 0,
        modelEmbedded = 0,
        modelFailed = 0;

    if (Array.isArray(imageUrls) && imageUrls.length) {
        let idx = 0;
        for (const url of imageUrls) {
            if (typeof url === "string" && (/^https?:\/\//i.test(url) || /^data:/i.test(url))) {
                pageProvided++;
                idx += 1;
                contentBlocks.push({ type: "input_text", text: `Image ref #${idx}` });
                contentBlocks.push({
                    type: "input_text",
                    text: `URL for Image ref #${idx}: ${url}`,
                });
                const embedded = await toInputImage(url);
                if (embedded) {
                    contentBlocks.push(embedded);
                    pageEmbedded++;
                } else {
                    pageFailed++;
                }
            }
        }
    }

    if (Array.isArray(modelImageUrls) && modelImageUrls.length) {
        let idx = 0;
        for (const url of modelImageUrls) {
            if (typeof url === "string" && (/^https?:\/\//i.test(url) || /^data:/i.test(url))) {
                modelProvided++;
                idx += 1;
                contentBlocks.push({
                    type: "input_text",
                    text: `Model thumbnail #${idx}`,
                });
                contentBlocks.push({
                    type: "input_text",
                    text: `URL for Model thumbnail #${idx}: ${url}`,
                });
                const embedded = await toInputImage(url);
                if (embedded) {
                    contentBlocks.push(embedded);
                    modelEmbedded++;
                } else {
                    modelFailed++;
                }
            }
        }
    }

    contentBlocks.unshift({
        type: "input_text",
        text: `Context: “Image ref #N” are user-provided INPUT references; “Model thumbnail #N” are OUTPUT previews.`,
    });
    contentBlocks.push({ type: "input_text", text: message });

    const inputPayload = [
        { role: "system", content: [{ type: "input_text", text: MASTER_PROMPT }] },
        { role: "user", content: contentBlocks },
    ];
    const inputSummary = {
        sys_prompt_bytes: MASTER_PROMPT.length,
        user_blocks: summarizeContentBlocks(contentBlocks),
        history_len: historyAsItems.length,
    };

    if (VERBOSE) {
        log("OPENAI_REQ", {
            model,
            tools: ["generate_images", "generate_3d_model", "propose_actions"],
            input_summary: inputSummary,
        });
    }
    if (VERBOSE2) {
        try {
            log("OPENAI_INPUT", {
                model,
                input: sanitizeInputForLog(inputPayload),
            });
        } catch {}
    }

    // ---------- stream from OpenAI ----------
    const stream = openai.responses.stream({
        model,
        input: inputPayload,
        tools: [
            {
                type: "function",
                name: "generate_images",
                strict: false,
                description:
                    "Generate or vary images from a prompt, optionally using refs.",
                parameters: {
                    type: "object",
                    properties: {
                        prompt: { type: "string" },
                        image_url: { type: "string" },
                        image_urls: { type: "array", items: { type: "string" } },
                        refs: { type: "array", items: { type: "string" } },
                    },
                    required: ["prompt"],
                    additionalProperties: false,
                },
            },
            {
                type: "function",
                name: "generate_3d_model",
                strict: false,
                description: "Create a 3D model from a text prompt and/or refs.",
                parameters: {
                    type: "object",
                    properties: {
                        prompt: { type: "string" },
                        image_urls: { type: "array", items: { type: "string" } },
                        refs: { type: "array", items: { type: "string" } },
                        target_style: { type: "string" },
                        target_usage: { type: "string" },
                        target_polycount: { type: "string" },
                    },
                    required: ["prompt"],
                    additionalProperties: false,
                },
            },
            {
                type: "function",
                name: "propose_actions",
                strict: false,
                description:
                    "Propose a small set of actionable buttons for the UI (actions array).",
                parameters: {
                    type: "object",
                    properties: {
                        actions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    kind: { type: "string" },
                                    prompt: { type: "string" },
                                    refs: { type: "array", items: { type: "string" } },
                                    confirm: { type: "string" },
                                    meta: { type: "object", additionalProperties: true },
                                },
                                required: ["title", "kind"],
                                additionalProperties: false,
                            },
                        },
                    },
                    required: ["actions"],
                    additionalProperties: false,
                },
            },
        ],
        tool_choice: "auto",
        store: true,
    });

    const encoder = new TextEncoder();
    const sse = new ReadableStream({
        start(controller) {
            (async () => {
                try {
                    try {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "debug",
                                    req_id: reqId,
                                    embed: {
                                        pageRefs: {
                                            provided: pageProvided,
                                            embedded: pageEmbedded,
                                            failed: pageFailed,
                                        },
                                        modelThumbs: {
                                            provided: modelProvided,
                                            embedded: modelEmbedded,
                                            failed: modelFailed,
                                        },
                                    },
                                    model,
                                    input_summary: inputSummary,
                                })}\n\n`
                            )
                        );
                        if (VERBOSE2) {
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({
                                        type: "debug",
                                        openai_input: sanitizeInputForLog(inputPayload),
                                    })}\n\n`
                                )
                            );
                        }
                    } catch {}

                    let assistantText = "";
                    const toolBuf: Record<
                        string,
                        { name?: string; args: string; done?: boolean }
                    > = {};
                    const toolCalls: Array<{ name: string; args: any }> = [];
                    let evCount = 0;

                    const finalUsage = { input_tokens: 0, output_tokens: 0 };

                    for await (const evt of stream) {
                        evCount++;
                        if (VERBOSE) log("SSE", { idx: evCount, type: (evt as any)?.type || "?" });

                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify(evt)}\n\n`)
                        );

                        try {
                            const add = extractTextFromEvt(evt);
                            if (add) assistantText += add;
                        } catch {}

                        try {
                            detectAndAccumulateToolCall(evt, toolBuf, toolCalls);
                        } catch {}

                        try {
                            const t = String(evt?.type || "");
                            if (t === "message_delta" && evt?.usage?.output_tokens) {
                                finalUsage.output_tokens = evt.usage.output_tokens;
                            } else if (t === "message_stop" && evt?.message?.usage) {
                                finalUsage.input_tokens = evt.message.usage.input_tokens || 0;
                                finalUsage.output_tokens = evt.message.usage.output_tokens || 0;
                            } else if (evt.usage) {
                                if (evt.usage.completion_tokens) {
                                    finalUsage.output_tokens = evt.usage.completion_tokens;
                                }
                                if (evt.usage.prompt_tokens) {
                                    finalUsage.input_tokens = evt.usage.prompt_tokens;
                                }
                            }
                        } catch {}
                    }

                    if (VERBOSE) log("TOOL_CALLS", toolCalls);
                    const preview = assistantText.slice(0, 400);
                    if (VERBOSE)
                        log("ASSISTANT_FINAL_TEXT", {
                            preview,
                            totalChars: assistantText.length,
                        });

                    try {
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    type: "debug",
                                    final: {
                                        assistant_preview: preview,
                                        assistant_chars: assistantText.length,
                                        tool_calls: toolCalls,
                                    },
                                })}\n\n`
                            )
                        );
                    } catch {}
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));

                    const inputTokens =
                        finalUsage.input_tokens || roughTokenEstimate(estText);
                    const outputTokens = finalUsage.output_tokens || MAX_OUT;
                    await finalizeOpenAiReservation({
                        userId,
                        model,
                        inputTokens,
                        outputTokens,
                        idempotencyBase,
                        reservedAmount,
                    });
                } catch (err) {
                    await cancelOpenAiReservation({
                        userId,
                        reservedAmount,
                        idempotencyBase,
                        model,
                    });
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                type: "error",
                                error: { message: String(err) },
                            })}\n\n`
                        )
                    );
                } finally {
                    releaseTxn(clientTxnId);
                    try {
                        controller.close();
                    } catch {}
                }
            })();
        },
        cancel() {
            releaseTxn(clientTxnId);
            cancelOpenAiReservation({
                userId,
                reservedAmount,
                idempotencyBase,
                model,
            }).catch(() => {});
        },
    });

    return new Response(sse, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
            "X-AI-Req-Id": reqId,
            "X-AI-Model": model,
        },
    });
}
