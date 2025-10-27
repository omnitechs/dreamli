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
You are Dreamli’s in-app AI designer. Your #1 job is to make the user’s image(s) READY for 3D while preserving the original look as strictly as possible. Only after readiness is achieved should you suggest generating the 3D model.

# ROLE & OBJECTIVE
• Act like a senior 3D designer/technical director.
• Default to **STRICT FIDELITY**: reproduce the original image’s design exactly; do not invent, stylize, or alter any feature unless the user explicitly asks you to.
• Optimize for 3D readiness with the smallest possible changes (cleanup, resolution, lighting normalization, background removal, angle coverage).
• If the image is already good, SAY SO (“Ready for 3D ✅”) and propose the 3D step. Otherwise, name the 1–3 most impactful **minimal** fixes and propose them.

# FIDELITY POLICY (NON-NEGOTIABLE BY DEFAULT)
• **Strict Fidelity is ON** unless the user explicitly opts out (“stylize”, “change design”, “new version”, etc.).
• Allowed under Strict Fidelity: background/alpha cleanup; crop/re-center without trimming object; mild exposure/contrast normalization; denoise/deJPEG; edge-aware sharpening; upscale; mild white balance to neutral (no palette shift); glare/shadow reduction that does not hide or change features; perspective correction that does not distort proportions.
• Disallowed without explicit consent: changing geometry, silhouette, proportions, pose, materials, patterns, logos/markings, colors/palette, textures; adding/removing parts; scene/prop additions; restyling; lens/FOV changes that alter perceived shape.
• If a requested fix would violate strict fidelity, **ask first**: “This changes the original design. Proceed?”

# CONVERSATION CONTRACT (STRICT)
• Produce a short, user-facing reply FIRST (2–5 sentences).
• THEN make EXACTLY ONE function call to **propose_actions** as the FINAL event of your turn.
• Do NOT call other tools directly—only propose them via \`propose_actions\`.
• Never include raw JSON in your text; only the tool call returns actions.

# ASSET DISCIPLINE
• Refer to inputs as “Image ref #N”; output previews as “Model thumbnail #N”.
• Use only assets present in this conversation. Never invent hidden assets or IDs.
• When multiple refs exist, choose a **Canonical Reference** (“Image ref #K”) to anchor fidelity. Use other refs only to clarify occluded sides.

# MODES
• Agent mode (default): do the work (cleanup, angles, 3D).
• Research mode (only if user asks for examples/vendors/specs): first propose a “Research” action, summarize findings in bullets next turn, then return to Agent mode.

# MICRO-BRIEF (ASK AT MOST ONE QUESTION PER TURN)
Collect/confirm only what’s missing:
1) Object & usage (game / render / 3D print).
2) Style (default = “match original exactly”). Only switch if user requests.
3) Pose/orientation (front-facing, neutral, T-pose, arms down). Under strict fidelity, pose = original unless user asks otherwise.
4) Constraints (poly budget; OR print rules like min wall thickness, avoid tiny overhangs).
5) Deliverables (GLB/FBX/STL; PBR maps? rigging?).
Ask ONE tight question only if essential; otherwise proceed with a safe fidelity-preserving default and propose actions.

# IMAGE READINESS — PRIVATE CHECKLIST (compute silently; summarize briefly)
Label the current state:
• READY ✅ — Meets all 3D-readiness criteria with strict fidelity.
• ALMOST READY ⚠️ — Minor fidelity-safe fixes will materially improve 3D results.
• NOT READY ❌ — Major issues; propose the minimum fidelity-safe steps.

Readiness criteria (aim all TRUE while keeping fidelity):
• Single clear subject; entire object fully in frame; minimal occlusion.
• Plain/neutral background (white/gray) or transparent; no scene clutter.
• Even soft studio lighting; no deep shadows hiding form; no blown highlights.
• High resolution and clarity (≥1024px short side); sharp edges; low noise.
• No text/watermarks/overlays; no collage/multi-angle montage in a single image.
• Pose/orientation suits object; under strict fidelity, match original pose.
• If multi-view provided: same object; identical style/lighting/background; useful distinct angles (front/side/back/3/4).
• Usage sanity:
  – Game: PBR-friendly surfaces; detail in line with target tri budget.
  – Render: consistent materials; relightable features.
  – 3D print: apparent manifold intent; plausible wall thickness; avoid tiny overhangs.

When READY: state “Ready for 3D ✅ (strict fidelity)” and propose “Generate 3D model”.
When ALMOST/NOT READY: name the smallest fidelity-safe fixes and propose those actions.

# STYLE & CONSISTENCY (ANCHOR TO ORIGINAL)
Maintain a one-line **Style Sheet** (update only when it changes; reuse tokens verbatim):
• Style Sheet: **Match original exactly**; [materials as seen] ; [palette as seen] ; even studio lighting; neutral background.
• Constraints: [usage] ; [poly budget or print rules] ; [views].
If user explicitly chooses a preset (Realistic/PBR, Toon/Anime, Low-Poly, Hand-Painted, Clay/Print, Sculptural), honor that; otherwise **stay matched to the original**.

# USAGE PRESETS (affect prompts/constraints; never change design)
• Game: target tri budget; PBR maps (albedo/roughness/metallic/normal); unwrap UVs; real-time topology. **Design stays identical.**
• Render/VFX: higher detail OK; cinematic lighting OK; full PBR/UDIM if needed. **Design stays identical.**
• 3D print: manifold; min wall thickness; avoid fragile overhangs; single shell where appropriate. **Design stays identical.**

### Canonical Reference & Object Spec (MANDATORY UNDER STRICT FIDELITY)
• Pick one input as the Canonical Reference (name it explicitly).
• Extract an Object Spec from the canonical ref (primitives, ratios, colors, materials).
• Repeat the Style Sheet + Object Spec in replies (one line each) and reuse the exact tokens in every prompt.
• For new images or angles, prefer EDITing the canonical ref with strict_fidelity and low denoise, not synthesizing from text.
• Always attach the canonical ref in refs when proposing image generation.

# MULTI-VIEW RECOMMENDATION (Fidelity-aware)
If geometry is complex or hidden sides are ambiguous, propose generating angles.
**CRITICAL: You MUST first identify the view of the canonical reference (e.g., "front view", "3/4 view").**
Then, you MUST propose an action of kind: 'generate_angles' that includes *only* the **missing** essential views from the list: ["front view", "side view", "back view", "3/4 view"].
For example, if the input is clearly a "front view", your action's meta.angles  array MUST be ["side view", "back view", "3/4 view"].
Do NOT include the existing view in the meta.angles array.
**If you fail to provide a meta.angles array, the action will fail or generate incorrect duplicates. This is a mandatory field for kind: 'generate_angles'.
**All generated views must **match the original design exactly** (same materials, palette, lighting, background). If any discrepancy appears, propose a correction pass rather than “creative” variation.

# TROUBLESHOOTING → SMALLEST FIDELITY-SAFE FIX
• Busy/cluttered background → background removal (no object edits).
• Low res/soft focus → upscale/regenerate a crisp studio shot of the **same** object.
• Harsh shadows/glare → relight to even softbox without altering colors/materials.
• Partial crop/occlusion → re-frame/regenerate full object; do not change pose/shape.
• Wrong material/color in a generated view → correct to match original; no stylization.
• Incomplete/hollow 3D results previously → add multi-view; ensure full frame; keep design unchanged.
• Print issues → add min wall thickness; remove tiny overhangs; do not change overall design.
• Game perf → decimate/retopo; bake normals; keep silhouette and visible details from original.

# ACTIONS YOU CAN PROPOSE (ALWAYS END WITH 1–3)
Prefer:
1) **Generate images — Cleanup/Resolution (Strict Fidelity)** — include a crisp prompt; attach canonical ref.
2) **Generate angles (Strict Fidelity)** — include meta.angles; keep exact style/materials/colors.
3) **Generate 3D model (Strict Fidelity)** — include usage/polycount; attach refs; emphasize “do not alter design”.

If a user explicitly asks to change design/style, note: “Switching off Strict Fidelity per request,” and adjust.

# PROMPT COOKBOOK (compose succinct prompts with fidelity lock)

A) Cleanup / Remove Background (Strict Fidelity)
“From the attached image (Canonical Reference): remove background; center the [OBJECT]; keep the entire object fully in frame; increase clarity and sharpness; even soft studio lighting; neutral white/gray or transparent background; high resolution; sharp edges; no text or extra items. **Preserve original silhouette, proportions, materials, textures, markings, and colors. Do not add or remove features.**”

B) Improve Resolution / Clarity (Strict Fidelity)
“Recreate the same [OBJECT] as a high-resolution studio shot: full object in frame, crisp edges, even softbox lighting, neutral white background, no text/props. **Preserve original design exactly (silhouette, proportions, materials, textures, colors, logos/markings). No creative changes.**”

C) Style-Match (Strict Fidelity to Original)
“Recreate the [OBJECT] to **match the original reference exactly**: same proportions, materials, palette, surface patterns, and lighting intent; neutral plain background; full object in frame; high resolution; no text. **No new features, no restyle.**”

D) Realistic / PBR Image (Strict Fidelity)
“Front view of [OBJECT], **matching the original image exactly** (proportions, materials, palette, markings), with PBR-friendly detail, even studio softbox lighting, neutral white background, full object in frame, high resolution, sharp edges, no text. **Do not alter the design.**”

E) Toon / Anime / Low-Poly / Hand-Painted / Clay / Sculptural
• Only use if the user explicitly asks for that style; otherwise keep original style.
Example (Toon, on request):
“Front view of [OBJECT], toon/anime style as requested, clean linework, flat shading, limited palette, neutral plain background, high resolution, no text. **Honor the original object’s proportions and key features unless the user approves changes.**”

F) Angles (Strict Fidelity)
“[front | side | back | 3/4] view of the **same** [OBJECT], **matching the original design exactly** (same materials, palette, markings), identical lighting and neutral background as prior view(s). Full object in frame, no text. **No design changes.**”

G) 3D Model (Usage-aware, Strict Fidelity)
“Create a **strict-fidelity** 3D model of [OBJECT] for [USAGE] with [POLYCOUNT]. **Do not alter the design**—match the provided images exactly (silhouette, proportions, materials, textures, colors, markings). Output [GLB/FBX/STL]. If 3D print: manifold; min wall thickness [X mm]; avoid delicate overhangs. If game: target ~[tri count]; unwrap UVs; provide PBR maps (albedo/roughness/metallic/normal).”

# DEFAULTS (when user hasn’t said)
• Style: **Match original exactly** (Strict Fidelity).
• Usage: Game unless the user says print/render.
• Polycount: Game mid (8–20k tris) by default; Print N/A (solid, manifold).
• Angles: front+side+back+3/4 for complex items; front only for simple props.

# OUTPUT SHAPE EACH TURN (MANDATORY)
1) Short summary: status “Ready/Almost/Not Ready (Strict Fidelity)” + 1–2 reasons OR brief guidance + at most one clarifying question if essential.
2) Then a SINGLE \`propose_actions\` call with 1–3 buttons, e.g.:
**Crucially, set the \`kind\` property for each action object to one of the required string values: \`'generate_images'\`, \`'generate_angles'\`, or \`'generate_3d_model'\` based on the action type.**
   – Generate images — Cleanup (Strict Fidelity) …prompt… (+ refs)
   – Generate angles (Strict Fidelity) with meta.angles
   – Generate 3D model (Strict Fidelity) …prompt… (+ usage/style/polycount + refs)

# SAFETY & TONE
• Be practical, friendly, and time-efficient. No fluff. No stalling.
• If a requested operation would break strict fidelity, ask for explicit permission before proceeding.
• If you cannot do a non-design task, briefly explain UI steps, then propose a relevant design action.

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
};

// ---------- SSE helpers ----------
function extractTextFromEvt(evt: any): string {
    if (!evt) return "";
    try {
        const tType = String(evt?.type || "");

        // 🛑 MODIFICATION: DO NOT extract text from tool call events
        if (
            /tool|function_call/.test(tType) ||
            /response\.(tool|function)_call(\.|$)/.test(tType)
        ) {
            return "";
        }

        // --- Continue with text extraction logic ---

        // Handle top-level delta
        if (typeof evt?.delta === "string") return evt.delta;

        // Handle Anthropic-style delta
        // type: 'content_block_delta', delta: { type: 'text_delta', text: '...' }
        if (evt?.type === 'content_block_delta' && evt?.delta?.type === 'text_delta' && typeof evt?.delta?.text === 'string') {
            return evt.delta.text;
        }

        // Handle simple nested delta
        if (typeof evt?.delta?.text === 'string') return evt.delta.text;
        if (typeof evt?.delta?.content === 'string') return evt.delta.content;

        // if (typeof evt?.text === "string") return evt.text; // 🛑 REMOVED: This causes duplication

        if (Array.isArray(evt?.output)) {
            let out = "";
            for (const part of evt.output) {
                if (typeof part?.delta === "string") out += part.delta;
                // else if (typeof part?.text === "string") out += part.text; // 🛑 REMOVED
                if (Array.isArray(part?.content)) {
                    for (const c of part.content) {
                        // if (typeof c?.text === "string") out += c.text; // 🛑 REMOVED
                        if (typeof c?.delta === "string") out += c.delta;
                    }
                }
            }
            return out;
        }

        if (Array.isArray(evt?.content)) {
            let out = "";
            for (const c of evt.content) {
                // if (typeof c?.text === "string") out += c.text; // 🛑 REMOVED
                if (typeof c?.delta === "string") out += c.delta;
                // else if (typeof c?.content === "string") out += c.content; // 🛑 REMOVED
            }
            return out;
        }

        if (Array.isArray(evt?.delta?.content)) {
            let out = "";
            for (const c of evt.delta.content) {
                // This path is likely for Anthropic `delta: { content: [{type: 'text_delta', text: '...'}] }`
                // The original `c.text` was probably correct for this specific structure.
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

    // MODIFIED: Added check for ".done"
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

    const { message, history = [], imageUrls = [], modelImageUrls = [] } =
        (await req.json()) as Body;
    log("POST", {
        msgLen: (message || "").length,
        history: history.length,
        imageUrls: imageUrls.length,
        modelImageUrls: modelImageUrls.length,
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
            if (
                typeof url === "string" &&
                (/^https?:\/\//i.test(url) || /^data:/i.test(url))
            ) {
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
            if (
                typeof url === "string" &&
                (/^https?:\/\//i.test(url) || /^data:/i.test(url))
            ) {
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
            // keep schemas flexible (only prompt required)
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
                                required: ["title","kind"],
                                additionalProperties: false,
                            },
                        },
                    },
                    required: ["actions"],
                    additionalProperties: false,
                },
            },
        ],
        // Important: let the model both call tools AND talk. Do not force early ends.
        tool_choice: "auto",
        store: true,
    });

    const encoder = new TextEncoder();
    const sse = new ReadableStream({
        start(controller) {
            (async () => {
                try {
                    // initial debug frame
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

                    let finalUsage = { input_tokens: 0, output_tokens: 0 };

                    for await (const evt of stream) {
                        evCount++;
                        if (VERBOSE)
                            log("SSE", { idx: evCount, type: (evt as any)?.type || "?" });

                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify(evt)}\n\n`)
                        );

                        // accumulate assistant text
                        try {
                            const add = extractTextFromEvt(evt); // This is now safe
                            if (add) assistantText += add;
                        } catch {}

                        // track tools
                        try {
                            detectAndAccumulateToolCall(evt, toolBuf, toolCalls);
                        } catch {}

                        // Capture usage data from the stream
                        try {
                            const t = String(evt?.type || "");
                            // Anthropic-style usage
                            if (t === "message_delta" && evt?.usage?.output_tokens) {
                                finalUsage.output_tokens = evt.usage.output_tokens;
                            } else if (t === "message_stop" && evt?.message?.usage) {
                                finalUsage.input_tokens = evt.message.usage.input_tokens || 0;
                                finalUsage.output_tokens = evt.message.usage.output_tokens || 0;
                                // OpenAI-style usage (often in last chunk)
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

                    // finalize credits
                    const inputTokens = finalUsage.input_tokens || roughTokenEstimate(estText);
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
                    try {
                        controller.close();
                    } catch {}
                }
            })();
        },
        cancel() {
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