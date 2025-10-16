// app/(lang)/[lang]/ai/hooks/useImages.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    addImages,
    removeImage,
    removeSelectedImages,
    setSelected,
} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";
import type { Image as StoreImage, UUID } from "@/app/(lang)/[lang]/ai/types";

/* ---------------- Types ---------------- */
type ImgSize = "512x512" | "1024x1024" | "2048x2048";

type GenerateOpts = {
    prompt: string;
    refs?: string[];        // optional; if omitted we collect from selection/all and normalize
    size?: ImgSize;
    n?: number;
    // NEW: allow resuming a pending job using the same streamId & placeholders
    resume?: { streamId: string; placeholderIds: string[] };
};

type PendingStream = {
    id: string;
    prompt: string;
    refs: string[];
    size: ImgSize;
    n: number;
    createdAt: number;
    placeholderIds: string[];
};

/* ---------------- Constants ---------------- */
const PENDING_KEY = "ai.pendingStreams"; // used as a prefix; each job is stored under `${PENDING_KEY}:${streamId}`
const TRANSPARENT_1PX_SVG =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=";

/* ---------------- URL helpers ---------------- */

// return a primitive string
function asString(u: unknown): string {
    return typeof u === "string" ? u : String(u ?? "");
}
function isHttpUrl(u: unknown): boolean {
    const s = asString(u);
    return /^https?:\/\//i.test(s);
}
function isBlobUrl(u: unknown): boolean {
    const s = asString(u);
    return s.startsWith("blob:");
}
function isDataUrl(u: unknown): boolean {
    const s = asString(u);
    return s.startsWith("data:");
}
function looksLikeUrl(u: unknown): boolean {
    const s = asString(u);
    return s.length > 0;
}

// Extract a usable URL from multiple possible keys
function extractUrl(i: any): string {
    if (!i || typeof i !== "object") return "";
    return (
        (typeof i.url === "string" && i.url) ||
        (typeof i.src === "string" && i.src) ||
        (typeof i.imageUrl === "string" && i.imageUrl) ||
        (typeof i.href === "string" && i.href) ||
        (typeof i.meta?.url === "string" && i.meta.url) ||
        ""
    );
}

// Convert relative/protocol-relative → absolute (same-origin)
function toAbsoluteIfLocal(u: unknown): string {
    const s = asString(u);
    if (isHttpUrl(s) || isDataUrl(s) || isBlobUrl(s)) return s;
    if (typeof window !== "undefined") {
        if (s.startsWith("//")) return `${window.location.protocol}${s}`;
        if (s.startsWith("/")) return `${window.location.origin}${s}`;
    }
    return s;
}

// Convert data: URL to File
function dataUrlToFile(dataUrl: string, filename = "ref.png"): File {
    const [header, base64] = dataUrl.split(",");
    const mime = /data:(.*?);base64/.exec(header)?.[1] || "image/png";
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return new File([bytes], filename, { type: mime });
}

// Upload a file and return a public HTTPS URL
async function uploadFileToPublic(file: File): Promise<{ url: string; key: string }> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/uploads/presign", { method: "POST", body: fd });
    if (!res.ok) throw new Error(`upload failed (${res.status})`);
    const data = await res.json();
    return { url: String(data?.url ?? ""), key: String(data?.key ?? "") };
}

// Convert gen snapshot image → store-compatible object
function toImage(partial: Partial<StoreImage> & { id: string }): StoreImage {
    return {
        id: partial.id,
        url: partial.url ?? "",
        key: typeof partial.key === "string" ? partial.key : "",
        meta: partial.meta,
    };
}

type Img = { id?: string; url?: string; src?: string; meta?: any };
const getUrl = (img: Img) => img.url || img.src || '';

/* ---------------- Hook ---------------- */
export default function useImages() {
    const dispatch = useDispatch();
    const { gen } = useGenerator();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const controllers = useRef<Map<string, AbortController>>(new Map());
    const [activeStreams, setActiveStreams] = useState<string[]>([]);
    const resumedOnceRef = useRef(false); // ensures auto-resume runs once per mount

    /* ---------- selection helpers ---------- */
    const selectAll = () => dispatch(setSelected((gen.images ?? []).map((i: any) => i.id)));
    const clearSel = () => dispatch(setSelected([]));
    const removeSelected = () => dispatch(removeSelectedImages());
    const onPickFiles = useCallback(() => fileInputRef.current?.click(), []);

    /* ---------- manual uploads ---------- */
    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files) return;
            for (const file of Array.from(files)) {
                const tempId = crypto.randomUUID();
                const tempUrl = URL.createObjectURL(file);

                // optimistic add
                dispatch(
                    addImages([
                        toImage({
                            id: tempId,
                            url: tempUrl,
                            key: "",
                            meta: { name: file.name, size: file.size, type: file.type },
                        }),
                    ])
                );

                try {
                    const { url, key } = await uploadFileToPublic(file);
                    dispatch(
                        addImages([
                            toImage({
                                id: tempId,
                                url,
                                key,
                                meta: { uploadedAt: Date.now() },
                            }),
                        ])
                    );
                } catch {
                    dispatch(removeImage(tempId));
                }
            }
        },
        [dispatch]
    );

    const removeImageById = useCallback((id: string) => dispatch(removeImage(id)), [dispatch]);

    /* ---------- derived ---------- */
    const images: StoreImage[] = (gen.images as StoreImage[]) ?? [];
    const selected = (gen.selected ?? []) as (UUID | string | any)[];
    const selectedCount = selected.length;
    const selectedSet = useMemo(
        () =>
            new Set(
                selected.map((t: any) => (t && typeof t === "object" ? String(t.id ?? "") : String(t)))
            ),
        [selected]
    );
    const setSelectedHandler = (sel: UUID[]) => dispatch(setSelected(sel));

    /* ---------- collect refs (IDs or URLs) → absolute HTTP(S) ---------- */
    const collectRefsForModel = useCallback(async (): Promise<string[]> => {
        const all = ((gen.images ?? []) as any[]).filter(Boolean);

        // 1) normalize selected tokens => ids (accept objects or strings)
        const selTokens: string[] = (gen.selected ?? [])
            .map((t: any) => (t && typeof t === "object" ? String(t.id ?? "") : String(t ?? "")))
            .filter(Boolean);
        console.log("selected tokens are",selTokens);

        // 2) Lookup maps
        const byId = new Map<string, any>();
        const byUrl = new Map<string, any>();
        for (const img of all) {
            const id = String(img?.id ?? "");
            const href = extractUrl(img);
            if (id) byId.set(id, img);
            if (href) byUrl.set(href, img);
        }

        // 3) resolve selection (prefer ids; if token looks like a URL, match by URL)
        const resolvedFromSelection: any[] = [];
        for (const token of selTokens) {
            let match = byId.get(token);
            if (!match && looksLikeUrl(token)) match = byUrl.get(token);
            if (match) resolvedFromSelection.push(match);
        }

        // 4) Source images: selection if available, else all
        let sourceImages: any[] = resolvedFromSelection.length ? resolvedFromSelection : all;

        // 5) Allow placeholders only if they carry a data: URL (post-swap), else skip
        sourceImages = sourceImages.filter((img: any) => {
            if (!img?.meta?.placeholder) return true;
            const u = extractUrl(img);
            return isDataUrl(u); // include if already swapped to data:
        });

        // 6) Raw hrefs → absolutize local paths to host/address
        const raw: string[] = sourceImages
            .map((img: any) => extractUrl(img))
            .filter(looksLikeUrl)
            .map((u) => toAbsoluteIfLocal(u));

        // 7) Only absolute HTTP(S)
        const out: string[] = [];
        const seen = new Set<string>();
        for (const u of raw) {
            if (isHttpUrl(u)) {
                const s = asString(u);
                if (!seen.has(s)) {
                    out.push(s);
                    seen.add(s);
                }
            }
            // data:/blob: ignored here (collector is for host/address refs)
        }

        // 8) Fallback: any non-placeholder absolute http from all
        if (out.length === 0) {
            const firstHttp = all
                .filter((img: any) => !img?.meta?.placeholder)
                .map((img: any) => toAbsoluteIfLocal(extractUrl(img)))
                .find((href: string) => isHttpUrl(href));
            if (firstHttp) return [asString(firstHttp)];
        }

        return out;
    }, [gen.images, gen.selected]);

    const buildHttpRefsFromSelection = useCallback(async () => {
        return collectRefsForModel();
    }, [collectRefsForModel]);

    // ✅ NEW: expose a handy resolver so callers can get refs outside generateAIImages
    const getCurrentRefs = useCallback(() => {
        return collectRefsForModel();
    }, [collectRefsForModel]);

    // ✅ NEW: a helper that mirrors your inline ternary:
    // refs ? refs : await collectRefsForModel()
    const resolveRefs = useCallback(
        async (maybeRefs?: string[]) => {
            if (Array.isArray(maybeRefs) && maybeRefs.length) return maybeRefs;
            return collectRefsForModel();
        },
        [collectRefsForModel]
    );

    /* ---------- placeholders ---------- */
    const ensurePlaceholders = useCallback(
        (streamId: string, n: number): string[] => {
            const ids: string[] = [];
            const total = Math.max(1, Math.floor(n));
            for (let i = 0; i < total; i++) {
                const id = `${streamId}__ph__${i}`;
                ids.push(id);
                dispatch(
                    addImages([
                        toImage({
                            id,
                            url: TRANSPARENT_1PX_SVG,
                            key: "",
                            meta: { streamId, placeholder: true, index: i + 1, total },
                        }),
                    ])
                );
            }
            return ids;
        },
        [dispatch]
    );

    /* ---------- swap placeholder -> data URL, then upload -> public URL ---------- */
    const swapPlaceholderWithBase64 = useCallback(
        async (phId: string, base64: string) => {
            const dataUrl = `data:image/png;base64,${base64}`;

            dispatch(
                addImages([
                    toImage({
                        id: phId,
                        url: dataUrl,
                        key: "",
                        meta: { fromStream: true, swappedAt: Date.now() },
                    }),
                ])
            );

            try {
                const file = dataUrlToFile(dataUrl, `ai-${phId}.png`);
                const { url, key } = await uploadFileToPublic(file);
                dispatch(
                    addImages([
                        toImage({
                            id: phId,
                            url,
                            key,
                            meta: { fromStream: true, uploadedAt: Date.now() },
                        }),
                    ])
                );
            } catch {
                // keep data URL if upload fails
            }
        },
        [dispatch]
    );

    /* ---------- streaming generator (supports "resume") ---------- */
    const generateAIImages = useCallback(
        async (opts: GenerateOpts) => {
            const prompt = (opts?.prompt ?? "").toString();
            const n = Math.min(10, Math.max(1, Math.floor(Number(opts?.n ?? 1))));
            const size = (opts?.size ?? "1024x1024") as ImgSize;

            const refs = Array.isArray(opts?.refs) && opts.refs.length
                ? opts.refs
                : await collectRefsForModel();

            // Reuse IDs when resuming, otherwise create new
            const streamId = opts.resume?.streamId ?? crypto.randomUUID();
            const placeholderIds =
                opts.resume?.placeholderIds ?? ensurePlaceholders(streamId, n);

            // persist/refresh pending record
            const pending: PendingStream = {
                id: streamId,
                prompt,
                refs,
                size,
                n,
                createdAt: Date.now(),
                placeholderIds,
            };
            try {
                localStorage.setItem(`${PENDING_KEY}:${streamId}`, JSON.stringify(pending));
            } catch {}

            const ac = new AbortController();
            controllers.current.set(streamId, ac);
            setActiveStreams((prev) => (prev.includes(streamId) ? prev : [streamId, ...prev]));

            try {
                const resp = await fetch("/api/ai/images/stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt, refs, size, n }),
                    signal: ac.signal,
                });

                if (!resp.ok || !resp.body) throw new Error(`Stream failed (${resp.status})`);

                const reader = resp.body.getReader();
                const decoder = new TextDecoder();
                let buf = "";

                let filled = 0;
                const nextPh = () => placeholderIds[Math.min(filled, placeholderIds.length - 1)];

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    buf += decoder.decode(value, { stream: true });
                    const chunks = buf.split("\n\n");
                    buf = chunks.pop() || "";

                    for (const frame of chunks) {
                        const line = frame.trim();
                        if (!line.startsWith("data:")) continue;
                        const payload = JSON.parse(line.slice(5));
                        const type = payload?.type;
                        if (!type) continue;

                        if (type === "image_base64_batch") {
                            const arr: string[] = Array.isArray(payload.images) ? payload.images : [];
                            for (const b64 of arr) {
                                const phId = nextPh();
                                if (!phId) break;
                                filled += 1;
                                void swapPlaceholderWithBase64(phId, b64);
                            }
                        }
                    }
                }
            } catch {
                // swallow; placeholders remain for visibility
            } finally {
                controllers.current.delete(streamId);
                setActiveStreams((prev) => prev.filter((id) => id !== streamId));
                try {
                    localStorage.removeItem(`${PENDING_KEY}:${streamId}`);
                } catch {}
            }

            return streamId;
        },
        [collectRefsForModel, ensurePlaceholders, swapPlaceholderWithBase64]
    );

    /* ---------- rehydrate + auto-resume after refresh ---------- */
    useEffect(() => {
        if (resumedOnceRef.current) return; // ensure this block runs only once
        resumedOnceRef.current = true;

        try {
            const pend: PendingStream[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i)!;
                if (k.startsWith(`${PENDING_KEY}:`)) {
                    const p = JSON.parse(localStorage.getItem(k) || "null");
                    if (p?.id) pend.push(p);
                }
            }
            if (!pend.length) return;

            // 1) show them in the UI
            setActiveStreams((prev) => {
                const ids = new Set(prev);
                for (const p of pend) ids.add(p.id);
                return Array.from(ids);
            });

            // 2) ensure placeholders exist
            const have = new Set((gen.images ?? []).map((i: any) => i.id));
            for (const p of pend) {
                const missing = p.placeholderIds.filter((id) => !have.has(id));
                for (const id of missing) {
                    dispatch(
                        addImages([
                            {
                                id,
                                url: TRANSPARENT_1PX_SVG,
                                key: "",
                                meta: { streamId: p.id, placeholder: true },
                            } as any,
                        ])
                    );
                }
            }

            // 3) auto-resume each job with saved params
            for (const p of pend) {
                void generateAIImages({
                    prompt: p.prompt,
                    refs: p.refs,
                    size: p.size,
                    n: p.n,
                    resume: { streamId: p.id, placeholderIds: p.placeholderIds },
                });
            }
        } catch {
            // ignore
        }
        // including generateAIImages is safe thanks to the resumedOnceRef guard
    }, [dispatch, gen.images, generateAIImages]);

    const getSelectedImageUrls=()  => {
        const all = ((gen.images ?? []) as any[]).filter(Boolean);
        console.log("selected",gen.selected)
        // normalize selection tokens -> ids (accept objects or strings)
        const selTokens: string[] = (gen.selected ?? [])
            .map((t: any) => (t && typeof t === "object" ? String(t.id ?? "") : String(t ?? "")))
            .filter(Boolean);

        // fast lookup
        const byId = new Map<string, any>();
        const byUrl = new Map<string, any>();
        for (const img of all) {
            const id = String(img?.id ?? "");
            const href = extractUrl(img);
            if (id) byId.set(id, img);
            if (href) byUrl.set(href, img);
        }

        // resolve selected tokens to image objects
        const selectedImages: any[] = [];
        for (const token of selTokens) {
            let match = byId.get(token);
            if (!match && looksLikeUrl(token)) match = byUrl.get(token);
            if (match) selectedImages.push(match);
        }

        // map to URLs (absolute when local)
        const urls = selectedImages
            .map((img) => toAbsoluteIfLocal(extractUrl(img)))
            .filter(looksLikeUrl);

        return urls;
    }

    /* ---------- expose API ---------- */
    return {
        // selection
        selectAll,
        clearSel,
        removeSelected,
        selectedCount,
        selectedSet,
        selected,
        setSelectedHandler,

        // upload
        onPickFiles,
        handleFiles,
        fileInputRef,
        removeImageById,
        images,

        // helpers
        buildHttpRefsFromSelection,

        // AI streaming
        generateAIImages,
        activeStreams,

        //refs
        getCurrentRefs,   // -> Promise<string[]>
        resolveRefs,      // -> Promise<string[]>
        getSelectedImageUrls
    };
}
