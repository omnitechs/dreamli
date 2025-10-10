// generator.ts
import type {
    Image,
    Generator as GeneratorType,
    DesignatedSlot,
    Message,
    MessageRole,
    OnChangeFn,
    GeneratorActionType
} from "./interface";
import { safeText, delay, fileNameFromUrl } from "../helper/utils";
import uid from "../helper/uuid";

// ——— Meshy types & helpers ———
type MeshyTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

interface MeshyTask {
    id: string;
    status: MeshyTaskStatus;
    progress?: number;
    model_urls?: Partial<Record<'glb' | 'fbx' | 'obj' | 'usdz', string>>;
    [k: string]: any;
}

type AiModel = 'meshy-4' | 'meshy-5' | 'latest';

export interface RequestModelOpts {
    apiKey?: string;
    baseUrlV1?: string; // default: https://api.meshy.ai/openapi/v1
    baseUrlV2?: string; // default: https://api.meshy.ai/openapi/v2

    // common geometry / moderation
    aiModel?: AiModel;
    topology?: 'quad' | 'triangle';
    targetPolycount?: number;
    shouldRemesh?: boolean;
    symmetryMode?: 'off' | 'auto' | 'on';
    isATPose?: boolean;
    moderation?: boolean;

    // TEXT mode
    textStage?: 'preview' | 'refine'; // default: preview
    prompt?: string;                  // required for preview
    artStyle?: 'realistic' | 'sculpture';
    seed?: number;
    previewTaskId?: string;           // required for refine
    enablePBR?: boolean;
    texturePrompt?: string;
    textureImageUrl?: string;

    // IMAGE mode
    imageUrls?: string[];             // 1 → single-image endpoint; >1 → multi
    shouldTexture?: boolean;          // default true

    // progress
    onProgress?: (p: { id: string; status: MeshyTaskStatus; progress?: number }) => void;
    stream?: boolean;
    pollMs?: number;                  // default 2000
    waitFor?: 'none' | 'succeeded' | 'terminal'; // default 'none'
}

// tiny fetch helpers
function buildHeaders(apiKey: string) {
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
}
async function fetchJSON<T>(url: string, init: RequestInit) {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(`${init.method || 'GET'} ${url} failed (${res.status}): ${await safeText(res)}`);
    return res.json() as Promise<T>;
}

async function streamTask(
    url: string,
    headers: Record<string, string>,
    onProgress?: (s: { id: string; status: MeshyTaskStatus; progress?: number }) => void,
    until: 'succeeded' | 'terminal' = 'succeeded',
): Promise<MeshyTask> {
    const res = await fetch(url, { headers });
    if (!res.ok || !res.body) throw new Error(`SSE stream error (${res.status})`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = ''; let last: MeshyTask | undefined;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const chunks = buf.split('\n\n'); buf = chunks.pop() || '';
        for (const c of chunks) {
            const line = c.split('\n').find(l => l.startsWith('data: '));
            if (!line) continue;
            try {
                const obj = JSON.parse(line.slice(6)) as MeshyTask;
                last = obj;
                onProgress?.({ id: obj.id, status: obj.status, progress: obj.progress });
                if (until === 'succeeded' && obj.status === 'SUCCEEDED') return obj;
                if (until === 'terminal' && (obj.status === 'SUCCEEDED' || obj.status === 'FAILED' || obj.status === 'CANCELED')) return obj;
            } catch { /* ignore */ }
        }
    }
    if (last) return last;
    throw new Error('SSE stream ended without final object');
}

async function waitForTask(
    getFn: () => Promise<MeshyTask>,
    opts: { pollMs?: number; onProgress?: (s: { id: string; status: MeshyTaskStatus; progress?: number }) => void; until?: 'succeeded' | 'terminal' }
): Promise<MeshyTask> {
    const pollMs = opts.pollMs ?? 2000;
    const until = opts.until ?? 'succeeded';
    for (;;) {
        const t = await getFn();
        opts.onProgress?.({ id: t.id, status: t.status, progress: t.progress });
        if (until === 'succeeded' && t.status === 'SUCCEEDED') return t;
        if (until === 'terminal' && (t.status === 'SUCCEEDED' || t.status === 'FAILED' || t.status === 'CANCELED')) return t;
        await delay(pollMs);
    }
}

export default class Generator implements GeneratorType {
    type: "text" | "image";
    textPrompt: string;
    images: Image[];
    designated: Partial<Record<DesignatedSlot, Image | null>>;
    dirtySinceLastModel: boolean = false;
    approvalSet?: string[] | undefined;
    messages: Message[];
    selectedImageKeys: Set<string> = new Set();
    private onChange?: OnChangeFn;

    constructor(type: "text" | "image" = "text", onChange?: OnChangeFn) {
        this.type = type;
        this.textPrompt = "";
        this.images = [];
        this.messages = [];
        this.designated = { front: null, back: null, side: null, threeQuarter: null, top: null, bottom: null };
        this.onChange = onChange;
    }

    setOnChange(fn?: OnChangeFn) { this.onChange = fn; }
    private notify(type: GeneratorActionType | undefined, payload?: Record<string, any>, message?: Message) {
        this.dirtySinceLastModel = true;
        this.onChange?.({ type, payload, message });
    }

    setType(type: "text" | "image") { this.type = type; this.notify("SET_MODE", { mode: type }); }
    addImage(image: Image) {
        if (this.type !== "image") this.setType("image");
        this.images.push(image);
        this.notify("ADD_IMAGE", { count: 1, imageId: (image as any)?.id ?? undefined });
    }
    assignImage(slot: keyof typeof this.designated, image: Image) {
        this.designated[slot] = image;
        this.notify("ASSIGN_SLOT", { slot, imageId: (image as any)?.id ?? undefined });
    }
    updatePrompt(text: string) {
        if (this.type !== "text") throw new Error("Cannot update text in image mode");
        this.textPrompt = text;
        this.notify("UPDATE_TEXT", { length: text.length });
    }
    addMessage(text: string, role: MessageRole = "user"): void {
        const msg: Message = { id: uid(), role, content: text, createdAt: new Date().toISOString() };
        this.messages.push(msg);
        this.notify(undefined, undefined, msg);
    }

    toJSON() {
        return {
            type: this.type,
            textPrompt: this.textPrompt,
            images: this.images,
            designated: this.designated,
            dirtySinceLastModel: this.dirtySinceLastModel,
            selectedKeys: Array.from(this.selectedImageKeys),
            selectedUrls: this.getSelectedImageUrls(),
            messages: this.messages,
        };
    }

    // ---------- Meshy integration (updated) ----------
    /**
     * Create a Meshy generation task for text or image mode.
     * Returns the task id. Optionally waits for completion (see opts.waitFor/stream).
     *
     * Endpoints:
     *   - Text→3D:   POST/GET/STREAM  /openapi/v2/text-to-3d          (mode: preview|refine)
     *   - Image→3D:  POST/GET/STREAM  /openapi/v1/image-to-3d         (image_url)
     *   - Multi→3D:  POST/GET/STREAM  /openapi/v1/multi-image-to-3d   (image_urls[])
     * Docs: Text→3D & Image→3D reference. :contentReference[oaicite:1]{index=1}
     */
    async requestModelFromMeshy(opts: RequestModelOpts): Promise<string> {
        const baseUrlV1 = opts.baseUrlV1 ?? "https://api.meshy.ai/openapi/v1";
        const baseUrlV2 = opts.baseUrlV2 ?? "https://api.meshy.ai/openapi/v2";
        const apiKey = opts.apiKey ?? (typeof process !== "undefined" ? process.env.MESHY_API_KEY : undefined);
        if (!apiKey) throw new Error("Meshy API key missing. Set MESHY_API_KEY.");
        const headers = buildHeaders(apiKey);

        // Common fields
        const commonGeom: any = {
            ai_model: opts.aiModel,
            topology: opts.topology,
            target_polycount: opts.targetPolycount,
            should_remesh: opts.shouldRemesh,
            symmetry_mode: opts.symmetryMode,
            is_a_t_pose: opts.isATPose,
            moderation: opts.moderation,
        };

        // TEXT MODE
        if (this.type === "text") {
            const stage = opts.textStage ?? "preview";

            if (stage === "preview") {
                const prompt = (opts.prompt ?? this.textPrompt ?? "").trim();
                if (!prompt) throw new Error("Meshy: empty text prompt.");
                const body = {
                    mode: "preview",
                    prompt,
                    art_style: opts.artStyle,
                    seed: opts.seed,
                    ...commonGeom,
                };
                const { result: taskId } = await fetchJSON<{ result: string }>(`${baseUrlV2}/text-to-3d`, {
                    method: "POST", headers, body: JSON.stringify(body),
                });
                this.notify("GENERATE_MODEL", { provider: "meshy", taskId, stage: "preview" });

                if (opts.waitFor && opts.waitFor !== 'none') {
                    if (opts.stream) {
                        await streamTask(`${baseUrlV2}/text-to-3d/${taskId}/stream`, headers, opts.onProgress, opts.waitFor === 'terminal' ? 'terminal' : 'succeeded');
                    } else {
                        await waitForTask(() => this.getMeshyTextTask(apiKey, baseUrlV2, taskId), {
                            pollMs: opts.pollMs, onProgress: opts.onProgress, until: opts.waitFor === 'terminal' ? 'terminal' : 'succeeded',
                        });
                    }
                }
                return taskId;
            }

            // refine
            if (!opts.previewTaskId) throw new Error("Meshy: refine requires previewTaskId.");
            const body = {
                mode: "refine",
                preview_task_id: opts.previewTaskId,
                enable_pbr: opts.enablePBR,
                texture_prompt: opts.texturePrompt,
                texture_image_url: opts.textureImageUrl,
                ai_model: opts.aiModel,
                moderation: opts.moderation,
            };
            const { result: taskId } = await fetchJSON<{ result: string }>(`${baseUrlV2}/text-to-3d`, {
                method: "POST", headers, body: JSON.stringify(body),
            });
            this.notify("GENERATE_MODEL", { provider: "meshy", taskId, stage: "refine" });

            if (opts.waitFor && opts.waitFor !== 'none') {
                if (opts.stream) {
                    await streamTask(`${baseUrlV2}/text-to-3d/${taskId}/stream`, headers, opts.onProgress, opts.waitFor === 'terminal' ? 'terminal' : 'succeeded');
                } else {
                    await waitForTask(() => this.getMeshyTextTask(apiKey, baseUrlV2, taskId), {
                        pollMs: opts.pollMs, onProgress: opts.onProgress, until: opts.waitFor === 'terminal' ? 'terminal' : 'succeeded',
                    });
                }
            }
            return taskId;
        }

        // IMAGE MODE
        const selected = this.getSelectedImageUrls();
        const urls = (opts.imageUrls && opts.imageUrls.length > 0)
            ? opts.imageUrls
            : (selected.length > 0 ? selected : this.collectDesignatedImageUrls());
        if (!urls || urls.length === 0) throw new Error("Meshy: no images selected for image-to-3d.");

        const shouldTexture = (opts.shouldTexture ?? true);
        const textureBits: any = shouldTexture
            ? { should_texture: true, enable_pbr: opts.enablePBR, texture_prompt: opts.texturePrompt, texture_image_url: opts.textureImageUrl }
            : { should_texture: false };

        if (urls.length === 1) {
            // single-image endpoint (image_url)
            const body = { image_url: urls[0], ...commonGeom, ...textureBits };
            const { result: taskId } = await fetchJSON<{ result: string }>(`${baseUrlV1}/image-to-3d`, {
                method: "POST", headers, body: JSON.stringify(body),
            });
            this.notify("GENERATE_MODEL", { provider: "meshy", taskId, images: 1 });

            if (opts.waitFor && opts.waitFor !== 'none') {
                if (opts.stream) {
                    await streamTask(`${baseUrlV1}/image-to-3d/${taskId}/stream`, headers, opts.onProgress, opts.waitFor === 'terminal' ? 'terminal' : 'succeeded');
                } else {
                    await waitForTask(() => this.getMeshyImageTask(apiKey, baseUrlV1, taskId, false), {
                        pollMs: opts.pollMs, onProgress: opts.onProgress, until: opts.waitFor === 'terminal' ? 'terminal' : 'succeeded',
                    });
                }
            }
            return taskId;
        } else {
            // multi-image endpoint (image_urls)
            const body = { image_urls: urls, ...commonGeom, ...textureBits };
            const { result: taskId } = await fetchJSON<{ result: string }>(`${baseUrlV1}/multi-image-to-3d`, {
                method: "POST", headers, body: JSON.stringify(body),
            });
            this.notify("GENERATE_MODEL", { provider: "meshy", taskId, images: urls.length });

            if (opts.waitFor && opts.waitFor !== 'none') {
                if (opts.stream) {
                    await streamTask(`${baseUrlV1}/multi-image-to-3d/${taskId}/stream`, headers, opts.onProgress, opts.waitFor === 'terminal' ? 'terminal' : 'succeeded');
                } else {
                    await waitForTask(() => this.getMeshyImageTask(apiKey, baseUrlV1, taskId, true), {
                        pollMs: opts.pollMs, onProgress: opts.onProgress, until: opts.waitFor === 'terminal' ? 'terminal' : 'succeeded',
                    });
                }
            }
            return taskId;
        }
    }

    // Retrieve task helpers (used by waitForTask)
    private async getMeshyTextTask(apiKey: string, baseUrlV2: string, id: string): Promise<MeshyTask> {
        return fetchJSON<MeshyTask>(`${baseUrlV2}/text-to-3d/${id}`, { method: 'GET', headers: buildHeaders(apiKey) });
    }
    private async getMeshyImageTask(apiKey: string, baseUrlV1: string, id: string, multi = false): Promise<MeshyTask> {
        const path = multi ? 'multi-image-to-3d' : 'image-to-3d';
        return fetchJSON<MeshyTask>(`${baseUrlV1}/${path}/${id}`, { method: 'GET', headers: buildHeaders(apiKey) });
    }

    /**
     * (Kept for compatibility) Simple poller by task + route kind.
     * Prefer requestModelFromMeshy({ waitFor: ... }) instead.
     */
    async pollMeshyTask(opts: {
        apiKey: string;
        taskId: string;
        kind?: 'text' | 'image' | 'multi'; // NEW: choose correct endpoint
        baseUrlV1?: string;
        baseUrlV2?: string;
        intervalMs?: number;
        timeoutMs?: number;
    }): Promise<any> {
        const baseUrlV1 = opts.baseUrlV1 ?? "https://api.meshy.ai/openapi/v1";
        const baseUrlV2 = opts.baseUrlV2 ?? "https://api.meshy.ai/openapi/v2";
        const interval = opts.intervalMs ?? 2500;
        const timeout = opts.timeoutMs ?? 5 * 60 * 1000;
        const start = Date.now();

        const getOnce = () => {
            if (opts.kind === 'text') return this.getMeshyTextTask(opts.apiKey, baseUrlV2, opts.taskId);
            if (opts.kind === 'multi') return this.getMeshyImageTask(opts.apiKey, baseUrlV1, opts.taskId, true);
            return this.getMeshyImageTask(opts.apiKey, baseUrlV1, opts.taskId, false);
        };

        for (;;) {
            const data = await getOnce();
            if (data.status === 'SUCCEEDED') return data;
            if (data.status === 'FAILED' || data.status === 'CANCELED') throw new Error(`Meshy task ${data.status}`);
            if (Date.now() - start > timeout) throw new Error(`Meshy poll timeout after ${Math.round(timeout / 1000)}s (task ${opts.taskId}).`);
            await delay(interval);
        }
    }

    // ---------- existing selection/image helpers (unchanged) ----------
    private collectDesignatedImageUrls(): string[] {
        const urls: string[] = [];
        (["front","back","side","threeQuarter","top","bottom"] as const).forEach(slot => {
            const img = this.designated[slot];
            const url = (img as any)?.url ?? (img as any)?.src;
            if (url) urls.push(String(url));
        });
        if (urls.length === 0) {
            for (const img of this.images) {
                const url = (img as any)?.url ?? (img as any)?.src;
                if (url) urls.push(String(url));
            }
        }
        return Array.from(new Set(urls));
    }

    private imageKey(img: Image): string {
        const id = (img as any)?.id;
        const url = (img as any)?.url ?? (img as any)?.src;
        return String(id ?? url ?? uid());
    }
    selectImage(image: Image) { const key = this.imageKey(image); this.selectedImageKeys.add(key); this.notify("SELECT_IMAGE", { key }); }
    unselectImage(image: Image) { const key = this.imageKey(image); if (this.selectedImageKeys.delete(key)) this.notify("UNSELECT_IMAGE", { key }); }
    clearSelection() { if (this.selectedImageKeys.size > 0) { this.selectedImageKeys.clear(); this.notify("CLEAR_SELECTION"); } }

    getSelectedImageUrls(): string[] {
        const urlByKey = new Map<string, string>();
        (["front","back","side","threeQuarter","top","bottom"] as const).forEach(slot => {
            const img = this.designated[slot];
            const url = img ? ((img as any)?.url ?? (img as any)?.src) : undefined;
            if (img && url) urlByKey.set(this.imageKey(img), String(url));
        });
        for (const img of this.images) {
            const url = (img as any)?.url ?? (img as any)?.src;
            if (url) urlByKey.set(this.imageKey(img), String(url));
        }
        const urls: string[] = [];
        for (const key of this.selectedImageKeys) {
            const u = urlByKey.get(key);
            if (u) urls.push(u);
        }
        return Array.from(new Set(urls));
    }

    async generateImagesWithGPT(opts?: {
        apiKey?: string; prompt?: string; n?: number; size?: "256x256" | "512x512" | "1024x1024"; model?: string;
    }): Promise<string[]> {
        const apiKey = opts?.apiKey ?? (typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined);
        if (!apiKey) throw new Error("OpenAI API key missing. Set OPENAI_API_KEY.");
        const model = opts?.model ?? "gpt-image-1";
        const n = Math.max(1, Math.min(opts?.n ?? 1, 10));
        const size = opts?.size ?? "1024x1024";
        const prompt = (opts?.prompt ?? this.textPrompt).trim();
        if (!prompt) throw new Error("Image generation: prompt is empty.");

        const selected = this.getSelectedImageUrls();
        if (selected.length > 0) {
            const form = new FormData();
            form.append("model", model);
            form.append("prompt", prompt);
            form.append("n", String(n));
            form.append("size", size);
            for (const url of selected) {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`Failed to fetch reference image: ${url}`);
                const blob = await resp.blob();
                form.append("image", blob, fileNameFromUrl(url));
            }
            const res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: form });
            if (!res.ok) throw new Error(`OpenAI image edits failed (${res.status}): ${await safeText(res)}`);
            const json = await res.json() as { data?: { url?: string }[] };
            const urls = (json.data ?? []).map(x => x.url!).filter(Boolean);
            if (urls.length === 0) throw new Error("OpenAI edits returned no images.");
            this.notify("GENERATE_IMAGE", { provider: "openai", count: urls.length, edited: true });
            return urls;
        }

        const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model, prompt, n, size }),
        });
        if (!res.ok) throw new Error(`OpenAI image generation failed (${res.status}): ${await safeText(res)}`);
        const json = await res.json() as { data?: { url?: string }[] };
        const urls = (json.data ?? []).map(x => x.url!).filter(Boolean);
        if (urls.length === 0) throw new Error("OpenAI generations returned no images.");
        this.notify("GENERATE_IMAGE", { provider: "openai", count: urls.length, edited: false });
        return urls;
    }

    unassignSlot(slot: keyof typeof this.designated) { if (this.designated[slot] !== null) { this.designated[slot] = null; this.notify("UNASSIGN_SLOT", { slot }); } }
    clearSlot(slot: keyof typeof this.designated) { this.unassignSlot(slot); }

    deleteImageByUrl(url: string): boolean {
        if (!url) return false;
        const before = this.images.length;
        this.images = this.images.filter(img => ((img as any)?.url ?? (img as any)?.src) !== url);
        const removedAny = this.images.length !== before;
        this.selectedImageKeys.delete(String(url));
        (["front","back","side","threeQuarter","top","bottom"] as const).forEach(slot => {
            const d = this.designated[slot];
            const dUrl = d ? ((d as any).url ?? (d as any).src) : undefined;
            if (dUrl && dUrl === url) this.designated[slot] = null;
        });
        if (removedAny) this.notify("DELETE_IMAGE", { url });
        return removedAny;
    }
    deleteImage(image: Image): boolean {
        const url = (image as any)?.url ?? (image as any)?.src;
        if (!url) return false;
        return this.deleteImageByUrl(String(url));
    }
}
