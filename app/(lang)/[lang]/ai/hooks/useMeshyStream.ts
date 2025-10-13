"use client";
import { useDispatch } from "react-redux";
import {
    upsertModel,
    setModelStatus,
    finalizeModelFromTask,
    failModel,
} from "../store/slices/generatorSlice";
import type { MeshyKind, GeneratorModel3D } from "../store/slices/generatorSlice";

/**
 * Hook for attaching a Meshy task stream (Redux integrated)
 * Works with /api/meshy/stream?id=<taskId>&kind=<kind>
 */
export function useMeshyStream() {
    const dispatch = useDispatch();

    async function streamExistingTask(
        taskId: string,
        kind: MeshyKind,
        meta?: { prompt?: string; stage?: string; imageUrls?: string[] }
    ) {
        const url = `/api/meshy/stream?id=${encodeURIComponent(taskId)}&kind=${encodeURIComponent(kind)}`;

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
        };
        dispatch(upsertModel(model));

        const es = new EventSource(url);

        es.onmessage = (ev) => {
            try {
                const data = JSON.parse(ev.data);
                if (!data.status) return;

                dispatch(
                    setModelStatus({
                        id: taskId,
                        status: data.status,
                        progress: data.progress ?? 0,
                    })
                );

                if (data.status === "SUCCEEDED") {
                    const modelUrls = data.model_urls ?? {};
                    const complete: GeneratorModel3D = {
                        ...model,
                        status: "SUCCEEDED",
                        progress: 100,
                        modelUrls,
                        thumbnailUrl: data.thumbnail_url,
                        previewVideoUrl: data.video_url,
                        textureUrls: data.texture_urls,
                    };
                    dispatch(finalizeModelFromTask(complete));
                    es.close();
                } else if (["FAILED", "CANCELED"].includes(data.status)) {
                    dispatch(failModel({ id: taskId, error: data.status }));
                    es.close();
                }
            } catch (err) {
                console.warn("[Meshy] parse error:", err);
            }
        };

        es.onerror = (err) => {
            console.error("[Meshy] stream error:", err);
            dispatch(failModel({ id: taskId, error: "Stream error" }));
            es.close();
        };
    }

    // ✅ export it under this name
    return { streamExistingTask };
}
