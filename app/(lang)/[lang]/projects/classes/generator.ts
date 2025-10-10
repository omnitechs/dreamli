//generator.ts
import type {
    Image,
    Generator as GeneratorType,
    DesignatedSlot,
    Message,
    MessageRole, OnChangeFn, GeneratorActionType
} from "./interface";
import {safeText,delay,fileNameFromUrl} from "../helper/utils"
import uid from "../helper/uuid";

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
        this.designated = {
            front: null,
            back: null,
            side: null,
            threeQuarter: null,
            top: null,
            bottom: null,
        };
        this.onChange = onChange;

    }

    /** Allow wiring the listener later if needed */
    setOnChange(fn?: OnChangeFn) {
        this.onChange = fn;
    }



    private notify(type: GeneratorActionType | undefined, payload?: Record<string, any>, message?: Message) {
        this.dirtySinceLastModel = true;
        this.onChange?.({ type, payload, message });
    }



    setType(type: "text" | "image") {
        this.type = type;
        this.notify("SET_MODE", { mode: type });
    }

    addImage(image: Image) {
        // NEW: auto switch to image mode if not already
        if (this.type !== "image") {
            this.setType("image"); // will notify SET_MODE
        }

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

    addMessage(text: string, role: MessageRole = "user"):void {
        const msg: Message = {
            id: uid(),
            role,
            content: text,
            createdAt: new Date().toISOString(),
        };
        this.messages.push(msg);
        // This is a *message* (chat), not a system action; we still want a commit.
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



    /**
     * Kick off a Meshy.ai generation job.
     * - If mode is "text": uses this.textPrompt (text->3D).
     * - If mode is "image": uses designated images (front/back/side/...) or falls back to any images present (image->3D).
     *
     * Returns the created task id.
     */
    async requestModelFromMeshy(opts: {
        apiKey?: string;
        baseUrl?: string; // default: https://api.meshy.ai/v2
        style?: string;
        topology?: string;
        format?: string; // "glb" | "obj" | "fbx"
        unit?: string;   // e.g. "meter"
        imageUrls?: string[]; // explicit override
        prompt?: string; // explicit override
        extra?: Record<string, unknown>;
    }): Promise<string> {
        console.log("here we go")
        const baseUrl = opts.baseUrl ?? "https://api.meshy.ai/openapi/v2";
        const apiKey =
            opts.apiKey ??
            (typeof process !== "undefined" ? process.env.MESHY_API_KEY : undefined);
        if (!apiKey) throw new Error("Meshy API key missing. Set MESHY_API_KEY.");

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        } as const;

        if (this.type === "text") {
            const prompt = (opts.prompt ?? this.textPrompt).trim();
            if (!prompt) throw new Error("Meshy: empty text prompt.");

            const body: Record<string, unknown> = {
                prompt,
                mode:"preview",
                art_style: opts.style ?? "sculpture",
                topology: opts.topology ?? "triangle",
                format: opts.format ?? "glb",
                unit: opts.unit ?? "meter",
                ...(opts.extra ?? {}),
            };

            const res = await fetch(`${baseUrl}/text-to-3d`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const t = await safeText(res);
                throw new Error(`Meshy text-to-3d failed (${res.status}): ${t}`);
            }
            const json = await res.json() as { task_id?: string; id?: string };
            console.log(json)
            const taskId = json.task_id ?? json.id;
            if (!taskId) throw new Error("Meshy: no task id returned for text-to-3d.");
            this.notify("GENERATE_MODEL", { provider: "meshy", taskId });
            return taskId;

        } else {
            // image mode
            const selected = this.getSelectedImageUrls();
            const urls = (opts.imageUrls && opts.imageUrls.length > 0)
                ? opts.imageUrls
                : (selected.length > 0 ? selected : this.collectDesignatedImageUrls());

            if (urls.length === 0) throw new Error("Meshy: no images selected for image-to-3d.");

            const body: Record<string, unknown> = {
                image_urls: urls,
                style: opts.style ?? "default",
                topology: opts.topology ?? "triangle",
                format: opts.format ?? "glb",
                unit: opts.unit ?? "meter",
                ...(opts.extra ?? {}),
            };

            const res = await fetch(`${baseUrl}/image-to-3d`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const t = await safeText(res);
                throw new Error(`Meshy image-to-3d failed (${res.status}): ${t}`);
            }
            const json = await res.json() as { task_id?: string; id?: string };
            const taskId = json.task_id ?? json.id;
            if (!taskId) throw new Error("Meshy: no task id returned for image-to-3d.");
            this.notify("GENERATE_MODEL", { provider: "meshy", taskId, images: urls.length });
            return taskId;
        }
    }

    /**
     * Poll a Meshy.ai task until it finishes or times out.
     * Returns the final task payload (you can extract the model URL/id and then create a version commit in the service).
     */
    async pollMeshyTask(opts: {
        apiKey: string;
        taskId: string;
        baseUrl?: string;         // default: https://api.meshy.ai/v2
        intervalMs?: number;      // default: 2500
        timeoutMs?: number;       // default: 5 * 60 * 1000 (5 min)
    }): Promise<any> {
        const baseUrl = opts.baseUrl ?? "https://api.meshy.ai/v2";
        const headers = { "Authorization": `Bearer ${opts.apiKey}` } as const;
        const interval = opts.intervalMs ?? 2500;
        const timeout = opts.timeoutMs ?? 5 * 60 * 1000;

        const started = Date.now();
        while (true) {
            const res = await fetch(`${baseUrl}/tasks/${encodeURIComponent(opts.taskId)}`, {
                method: "GET",
                headers,
            });
            if (!res.ok) {
                const t = await safeText(res);
                throw new Error(`Meshy poll failed (${res.status}): ${t}`);
            }
            const data = await res.json() as {
                id?: string;
                task_id?: string;
                status?: "queued" | "running" | "succeeded" | "failed" | string;
                result?: unknown;
                error?: unknown;
            };

            const status = data.status ?? "unknown";
            if (status === "succeeded") {
                // optional: this.notify("GENERATE_MODEL", { provider: "meshy", taskId: opts.taskId, status });
                return data;
            }
            if (status === "failed") {
                throw new Error(`Meshy task failed: ${JSON.stringify(data.error ?? data)}`);
            }

            if (Date.now() - started > timeout) {
                throw new Error(`Meshy poll timeout after ${Math.round(timeout/1000)}s (task ${opts.taskId}).`);
            }
            await delay(interval);
        }
    }

    /**
     * Helper: collect designated image URLs first, then fall back to any images[] URLs.
     */
    private collectDesignatedImageUrls(): string[] {
        const urls: string[] = [];
        const slots: (keyof typeof this.designated)[] = [
            "front", "back", "side", "threeQuarter", "top", "bottom"
        ];
        for (const slot of slots) {
            const img = this.designated[slot];
            const url = (img as any)?.url ?? (img as any)?.src;
            if (url) urls.push(String(url));
        }
        if (urls.length === 0) {
            for (const img of this.images) {
                const url = (img as any)?.url ?? (img as any)?.src;
                if (url) urls.push(String(url));
            }
        }
        // de-dupe
        return Array.from(new Set(urls));
    }

    // inside class Generator (add with your other fields)
    // selectedImageKeys: Set<string> = new Set();

// helper to build a stable key for any image
    private imageKey(img: Image): string {
        const id = (img as any)?.id;
        const url = (img as any)?.url ?? (img as any)?.src;
        return String(id ?? url ?? uid()); // last resort uid, but prefer id/url
    }

// public API
    selectImage(image: Image) {
        const key = this.imageKey(image);
        this.selectedImageKeys.add(key);
        this.notify("SELECT_IMAGE", { key });
    }

    unselectImage(image: Image) {
        const key = this.imageKey(image);
        if (this.selectedImageKeys.delete(key)) {
            this.notify("UNSELECT_IMAGE", { key });
        }
    }

    clearSelection() {
        if (this.selectedImageKeys.size > 0) {
            this.selectedImageKeys.clear();
            this.notify("CLEAR_SELECTION");
        }
    }

// resolve currently selected image URLs (in order: designated slots → images list)
    getSelectedImageUrls(): string[] {
        const urlByKey = new Map<string, string>();

        // designated first (front/back/side/threeQuarter/top/bottom)
        const slots: (keyof typeof this.designated)[] = [
            "front", "back", "side", "threeQuarter", "top", "bottom"
        ];
        for (const slot of slots) {
            const img = this.designated[slot];
            if (!img) continue;
            const url = (img as any)?.url ?? (img as any)?.src;
            if (!url) continue;
            urlByKey.set(this.imageKey(img), String(url));
        }

        // then the general images[]
        for (const img of this.images) {
            const url = (img as any)?.url ?? (img as any)?.src;
            if (!url) continue;
            urlByKey.set(this.imageKey(img), String(url));
        }

        // map selected keys → urls
        const urls: string[] = [];
        for (const key of this.selectedImageKeys) {
            const u = urlByKey.get(key);
            if (u) urls.push(u);
        }
        // de-dupe
        return Array.from(new Set(urls));
    }

    // inside class Generator

    /**
     * Generate images via GPT (OpenAI Images).
     * - If you selected images, we use the "edits" endpoint with them as references.
     * - If none selected, we use "generations" with the text prompt.
     * Returns an array of image URLs (base64 variants can be added if you prefer).
     */
    async generateImagesWithGPT(opts?: {
        apiKey?: string;
        prompt?: string;        // override textPrompt
        n?: number;             // number of images to generate (default 1)
        size?: "256x256" | "512x512" | "1024x1024";
        model?: string;         // default "gpt-image-1"
    }): Promise<string[]> {
        const apiKey =
            opts?.apiKey ??
            (typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined);
        if (!apiKey) throw new Error("OpenAI API key missing. Set OPENAI_API_KEY.");

        const model = opts?.model ?? "gpt-image-1";
        const n = Math.max(1, Math.min(opts?.n ?? 1, 10));
        const size = opts?.size ?? "1024x1024";
        const prompt = (opts?.prompt ?? this.textPrompt).trim();
        if (!prompt) throw new Error("Image generation: prompt is empty.");

        const selected = this.getSelectedImageUrls();

        // If we have reference images, call the "edits" endpoint
        if (selected.length > 0) {
            // Build multipart/form-data
            const form = new FormData();
            form.append("model", model);
            form.append("prompt", prompt);
            form.append("n", String(n));
            form.append("size", size);

            // Fetch each selected image and attach as "image"
            for (const url of selected) {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`Failed to fetch reference image: ${url}`);
                const blob = await resp.blob();
                // Each image under the "image" key per OpenAI Images edits API
                form.append("image", blob, fileNameFromUrl(url));
            }

            const res = await fetch("https://api.openai.com/v1/images/edits", {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}` },
                body: form,
            });
            if (!res.ok) {
                const t = await safeText(res);
                throw new Error(`OpenAI image edits failed (${res.status}): ${t}`);
            }
            const json = await res.json() as { data?: { url?: string }[] };
            const urls = (json.data ?? []).map(x => x.url!).filter(Boolean);
            if (urls.length === 0) throw new Error("OpenAI edits returned no images.");
            this.notify("GENERATE_IMAGE", { provider: "openai", count: urls.length, edited: true });
            return urls;
        }

        // Else plain generations
        const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                prompt,
                n,
                size,
            }),
        });
        if (!res.ok) {
            const t = await safeText(res);
            throw new Error(`OpenAI image generation failed (${res.status}): ${t}`);
        }
        const json = await res.json() as { data?: { url?: string }[] };
        const urls = (json.data ?? []).map(x => x.url!).filter(Boolean);
        if (urls.length === 0) throw new Error("OpenAI generations returned no images.");
        this.notify("GENERATE_IMAGE", { provider: "openai", count: urls.length, edited: false });
        return urls;
    }
    /** Unassign an image from a designated slot (keep image in library) */
    unassignSlot(slot: keyof typeof this.designated) {
        if (this.designated[slot] !== null) {
            this.designated[slot] = null;
            // fire the clearer, but use the clearer name
            this.notify("UNASSIGN_SLOT", { slot });
        }
    }

    /** Backward-compat: Clear == Unassign */
    clearSlot(slot: keyof typeof this.designated) {
        this.unassignSlot(slot);
    }

    /** Delete the image entirely by URL:
     * - removes from images[]
     * - removes from selection
     * - unassigns from ANY slot that used it
     * Returns true if anything was removed.
     */
    deleteImageByUrl(url: string): boolean {
        if (!url) return false;

        // remove from images[]
        const before = this.images.length;
        this.images = this.images.filter(img => {
            const u = (img as any)?.url ?? (img as any)?.src;
            return u !== url;
        });
        const removedAny = this.images.length !== before;

        // drop from selection set
        // We use imageKey() which prefers url; removing by URL is enough:
        // just remove key == url and also any key that resolves to this url
        this.selectedImageKeys.delete(String(url));

        // unassign from every slot that referenced it
        (["front","back","side","threeQuarter","top","bottom"] as const).forEach(slot => {
            const d = this.designated[slot];
            const dUrl = d ? ((d as any).url ?? (d as any).src) : undefined;
            if (dUrl && dUrl === url) {
                this.designated[slot] = null;
            }
        });

        if (removedAny) {
            this.notify("DELETE_IMAGE", { url });
        }
        return removedAny;
    }

    /** Delete by reference (convenience) */
    deleteImage(image: Image): boolean {
        const url = (image as any)?.url ?? (image as any)?.src;
        if (!url) return false;
        return this.deleteImageByUrl(String(url));
    }

}



