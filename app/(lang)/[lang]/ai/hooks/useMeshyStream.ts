// app/(lang)/[lang]/ai/hooks/useMeshyStream.ts
"use client";
import { useDispatch } from "react-redux";
import {
    upsertModel,
    setModelStatus,
    finalizeModelFromTask,
    failModel,
} from "../store/slices/generatorSlice";
import {GeneratorModel3D} from "@/app/(lang)/[lang]/ai/types";
import usePrompt from "@/app/(lang)/[lang]/ai/hooks/usePrompt";
import React, {useRef, useState, useTransition} from "react";
import useMode from "@/app/(lang)/[lang]/ai/hooks/useMode";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";

type Terminal = "SUCCEEDED" | "FAILED" | "CANCELED";
const TERMINAL: Record<string, true> = { SUCCEEDED: true, FAILED: true, CANCELED: true };

// One EventSource per taskId (in-memory, reset on full reload)
const activeStreams = new Map<string, EventSource>();

async function pollTask(taskId: string, kind: string) {
    const url = `/api/meshy/task?id=${encodeURIComponent(taskId)}&kind=${encodeURIComponent(kind)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}

export function useMeshyStream() {
    const dispatch = useDispatch();
    const {prompt} = usePrompt();

    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [modelUrl, setModelUrl] = useState<string>();
    const [error, setError] = useState<string | null>(null);
    const {images} = useImages()
    const {headId,onCommit} = useCommit()
    const esRef = useRef<EventSource | null>(null);
    // const {models} = useModels()




    function openStream(base: GeneratorModel3D) {
        console.log("openStream");
        const { taskId, kind, id } = base;
        if (!taskId) return;

        // ✅ hard guard: if we already have a live ES for this task, bail
        if (activeStreams.has(taskId)) return;

        // ✅ mark streaming in Redux so resumeAll/streamExistingTask won't double open
        dispatch(upsertModel({ ...base, streaming: true }));

        const url = `/api/meshy/stream?id=${encodeURIComponent(taskId)}&kind=${encodeURIComponent(kind)}`;
        const es = new EventSource(url);
        activeStreams.set(taskId, es);

        let lastMessageAt = Date.now();
        let watchdog: ReturnType<typeof setInterval> | null = null;

        const clearAll = () => {
            try { es.close(); } catch {}
            activeStreams.delete(taskId);
            if (watchdog) clearInterval(watchdog);
            // clear streaming flag
            dispatch(upsertModel({ id, taskId, kind, streaming: false } as any));
        };

        const startWatchdog = () => {
            if (watchdog) clearInterval(watchdog);
            watchdog = setInterval(async () => {
                const staleMs = Date.now() - lastMessageAt;
                if (staleMs > 20000) { // 20s without SSE -> poll once
                    try {
                        const data = await pollTask(taskId, kind);
                        const status = String(data?.status ?? "").toUpperCase();
                        const progress = typeof data?.progress === "number" ? data.progress : undefined;

                        if (status) dispatch(setModelStatus({ id: taskId, status, progress }));

                        if (status === "SUCCEEDED") {
                            dispatch(finalizeModelFromTask({
                                ...base,
                                status: "SUCCEEDED",
                                progress: 100,
                                modelUrls: data.model_urls ?? {},
                                thumbnailUrl: data.thumbnail_url,
                                previewVideoUrl: data.video_url,
                                textureUrls: data.texture_urls,
                                streaming: false,
                            }));
                            clearAll();
                            return;
                        }

                        if (TERMINAL[status]) {
                            dispatch(failModel({ id: taskId, error: status || "Failed" }));
                            clearAll();
                            return;
                        }

                        // Not terminal -> reopen a fresh SSE
                        clearAll();
                        openStream(base);
                    } catch {
                        // ignore; try again next tick
                    }
                }
            }, 5000);
        };

        es.onopen = () => {
            lastMessageAt = Date.now();
            startWatchdog();
        };

        es.onmessage = (ev) => {
            lastMessageAt = Date.now();
            try {
                const data = JSON.parse(ev.data || "{}");
                const status = String(data?.status ?? "").toUpperCase();
                const progress = typeof data?.progress === "number" ? data.progress : 0;

                if (status) dispatch(setModelStatus({ id: taskId, status, progress }));

                if (status === "SUCCEEDED") {
                    dispatch(finalizeModelFromTask({
                        ...base,
                        status: "SUCCEEDED",
                        progress: 100,
                        modelUrls: data.model_urls ?? {},
                        thumbnailUrl: data.thumbnail_url,
                        previewVideoUrl: data.video_url,
                        textureUrls: data.texture_urls,
                    }));
                    clearAll();
                } else if (TERMINAL[status]) {
                    dispatch(failModel({ id: taskId, error: status || "Failed" }));
                    clearAll();
                }
            } catch {
                // parse hiccup -> ignore
            }
        };

        es.onerror = () => {
            // Server will hint retry; watchdog also covers stalls
            // no-op here
        };
    }

    /** Start a new task stream */
    function streamExistingTask(
        taskId: string,
        kind: GeneratorModel3D["kind"],
        meta?: { prompt?: string; stage?: string; imageUrls?: string[] }
    ) {
        const model: GeneratorModel3D = {
            id: taskId,
            provider: "meshy",
            taskId,
            kind,
            modelUrls: {},
            createdAt: new Date().toISOString(),
            status: "PENDING",
            progress: 0,
            prompt: meta?.prompt,
            imageUrls: meta?.imageUrls,
            stage: meta?.stage as any,
            streaming: false,
        };
        dispatch(upsertModel(model));
        openStream(model);
    }

    /** Re-attach one unfinished model after refresh */
    function resumeModel(m: GeneratorModel3D) {
        console.log(m.streaming)
        const st = String(m.status ?? "").toUpperCase();
        if (TERMINAL[st]) return;
        // if (m.streaming) return;          // ✅ already streaming per Redux flag
        openStream({ ...m, streaming: true });
    }

    /** Re-attach all unfinished models (call once after rehydrate) */
    function resumeAll(models?: GeneratorModel3D[]) {
        (models ?? []).forEach(resumeModel);
    }

    // one button: use generator.textPrompt from Redux, start Meshy text preview
    const startGenerationFromPrompt = async () => {
        if (!prompt) return;
        try {
            const res = await fetch("/api/meshy/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            if (!res.ok) {
                console.error("Meshy start failed:", await res.text());
                return;
            }
            const { taskId } = await res.json();
            streamExistingTask(taskId, "text", { prompt, stage: "preview" });
        } catch (err) {
            console.error("Generation error:", err);
        }
    };


    /** 🔹 Start 3D generation via Meshy stream API */
    const onGenerate = (projectId: string) => {
        if (!projectId || !headId) return;
        setError(null);
        setStatus('');
        setProgress(0);
        setModelUrl(undefined);

        startTransition(async () => {
            try {
                const res = await fetch(`/api/ai/meshy/start?projectId=${projectId}&commitId=${headId}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        prompt: prompt ?? '',
                        images: images ?? [],
                    }),
                });

                if (!res.ok) throw new Error(`Failed to start 3D generation (${res.status})`);
                const {streamUrl} = await res.json();

                setStatus('PENDING');

                const es = new EventSource(streamUrl);
                esRef.current = es;

                es.onmessage = async (evt) => {
                    try {
                        const data = JSON.parse(evt.data);
                        if (typeof data.status === 'string') setStatus(data.status);
                        if (typeof data.progress === 'number') setProgress(data.progress);

                        if (data.status === 'SUCCEEDED') {
                            const best =
                                data?.model_urls?.glb ??
                                data?.model_urls?.fbx ??
                                data?.model_urls?.obj ??
                                data?.model_urls?.usdz;

                            if (best) {
                                setModelUrl(best);
                                await onCommit('Generated 3D Model'); // ✅ now uses proper commit hook
                            }

                            es.close();
                        }
                    } catch (err) {
                        console.warn('SSE parse error', err);
                    }
                };

                es.onerror = () => {
                    setError('Stream disconnected.');
                    es.close();
                };
            } catch (e: any) {
                setError(e?.message ?? String(e));
            }
        });
    };

    return { streamExistingTask, resumeModel, resumeAll,startGenerationFromPrompt ,useRef,onGenerate};
}
