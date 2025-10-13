"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/(lang)/[lang]/ai/store";
import { useMeshyStream } from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import {
    finalizeModelFromTask,
    upsertModel,
} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import LazyGlb from "@/components/GlbViewer";

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
    if (!modelUrls) return undefined;
    return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export function ModelsPanel() {
    const dispatch = useDispatch();
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? { textPrompt: "", models: [] };
    const { streamExistingTask,resumeAll } = useMeshyStream();

    // selected model id for the preview panel below the grid
    const [selectedId, setSelectedId] = React.useState<string | null>(null);


    React.useEffect(() => {
        console.log("loading the resumeAll");
        if (gen?.models?.length) resumeAll(gen.models);
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // one button: use generator.textPrompt from Redux, start Meshy text preview
    const startGeneration = async () => {
        const prompt = (gen.textPrompt ?? "").trim();
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

    const models = gen?.models ?? [];

    // // One-time background sync on page load (for any unfinished models)
    // React.useEffect(() => {
    //     if (!models?.length) return;
    //     const controller = new AbortController();
    //
    //     (async () => {
    //         for (const m of models) {
    //             if (m.status === "SUCCEEDED") continue;
    //             try {
    //                 const res = await fetch(`/api/meshy/task?id=${m.taskId}&kind=${m.kind}`, {
    //                     signal: controller.signal,
    //                 });
    //                 if (!res.ok) continue;
    //                 const data = await res.json();
    //
    //                 if (data?.status && data?.status !== m.status) {
    //                     dispatch(
    //                         upsertModel({
    //                             ...m,
    //                             status: data.status,
    //                             progress: data.progress ?? m.progress,
    //                         })
    //                     );
    //                 }
    //
    //                 if (data?.status === "SUCCEEDED" && data?.model_urls) {
    //                     dispatch(
    //                         finalizeModelFromTask({
    //                             ...m,
    //                             modelUrls: data.model_urls,
    //                             thumbnailUrl: data.thumbnail_url,
    //                             previewVideoUrl: data.video_url,
    //                             textureUrls: data.texture_urls,
    //                             status: "SUCCEEDED",
    //                             progress: 100,
    //                         })
    //                     );
    //                 }
    //             } catch {
    //                 /* silent */
    //             }
    //         }
    //     })();
    //
    //     return () => controller.abort();
    //     // run once on initial mount
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const selectedModel = React.useMemo(
        () => models.find((m: any) => m.id === selectedId) ?? null,
        [models, selectedId]
    );

    const selectedModelUrl = pickBestModelUrl(selectedModel?.modelUrls);

    return (
        <section className="bg-white rounded-2xl shadow p-4 border space-y-6">
            {/* Single action button — uses Redux generator state under the hood */}
            <div className="flex items-center justify-end">
                <button
                    onClick={startGeneration}
                    className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white"
                >
                    Generate & Stream
                </button>
            </div>

            {/* Models grid */}
            {models.length === 0 ? (
                <div className="text-sm text-gray-500">No models yet.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((m: any) => (
                        <article
                            key={m.id}
                            onClick={() => setSelectedId(m.id)}
                            className={`rounded-xl border p-3 space-y-2 cursor-pointer transition ${
                                selectedId === m.id ? "ring-2 ring-black" : "hover:bg-gray-50"
                            }`}
                            title="Click to preview below"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium truncate">{m.prompt ?? m.kind}</div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100">
                  {m.status ?? "—"}
                </span>
                            </div>

                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                {m.thumbnailUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={m.thumbnailUrl} alt="thumb" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-xs text-gray-500">No thumbnail</div>
                                )}
                            </div>

                            {typeof m.progress === "number" &&
                                (m.status === "PENDING" || m.status === "IN_PROGRESS") && (
                                    <div className="w-full h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-2 rounded bg-black transition-all"
                                            style={{ width: `${Math.max(0, Math.min(100, m.progress ?? 0))}%` }}
                                        />
                                    </div>
                                )}

                            {m.status === "SUCCEEDED" && (
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {Object.entries(m.modelUrls ?? {}).map(([fmt, url]) =>
                                        url ? (
                                            <a
                                                key={fmt}
                                                href={String(url)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {fmt}
                                            </a>
                                        ) : null
                                    )}
                                </div>
                            )}

                            <div className="text-[10px] text-gray-500">
                                {new Date(m.createdAt ?? Date.now()).toLocaleString()}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Preview panel (below the grid) */}
            {selectedModel && (
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">
                            Preview: {selectedModel.prompt ?? selectedModel.kind}
                        </div>
                        <button
                            className="text-xs underline text-gray-600"
                            onClick={() => setSelectedId(null)}
                        >
                            Close
                        </button>
                    </div>

                    {selectedModelUrl ? (
                        <LazyGlb
                            key={selectedModelUrl || selectedModel.id}
                            modelUrl={selectedModelUrl} />
                    ) : (
                        <div className="text-sm text-gray-500">
                            No previewable URL yet. (We look for <code>.glb</code> first, then <code>.fbx</code>, <code>.obj</code>, <code>.usdz</code>.)
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
