"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/(lang)/[lang]/ai/store";
import { useMeshyStream } from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import {
    finalizeModelFromTask,
    upsertModel,
} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";

export function ModelsPanel() {
    const dispatch = useDispatch();
    const gen = useSelector((s: RootState) => (s as any)?.generator);
    const { streamExistingTask } = useMeshyStream();

    const [prompt, setPrompt] = React.useState(gen?.textPrompt ?? "");
    const [kind, setKind] = React.useState<"text" | "image" | "multi">("text");

    /** 🔹 Start a new generation */
    const startGeneration = async () => {
        if (!prompt.trim()) return;
        try {
            const res = await fetch("/api/meshy/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim() }),
            });
            if (!res.ok) {
                console.error("Meshy start failed:", await res.text());
                return;
            }
            const { taskId } = await res.json();
            console.log("[Meshy] new taskId:", taskId);
            streamExistingTask(taskId, kind, { prompt });
        } catch (err) {
            console.error("Generation error:", err);
        }
    };

    const models = gen?.models ?? [];

    /**
     * 🔄 One-time background sync on page load
     * Checks each model that isn't SUCCEEDED and fetches its latest state from Meshy.
     * This ensures that any models finished while the user was away get their final URLs.
     */
    React.useEffect(() => {
        if (!models?.length) return;
        const controller = new AbortController();

        (async () => {
            for (const m of models) {
                if (m.status === "SUCCEEDED") continue;
                try {
                    const res = await fetch(`/api/meshy/task?id=${m.taskId}&kind=${m.kind}`, {
                        signal: controller.signal,
                    });
                    if (!res.ok) continue;
                    const data = await res.json();

                    // If progress advanced or status changed, update it
                    if (data?.status && data?.status !== m.status) {
                        dispatch(
                            upsertModel({
                                ...m,
                                status: data.status,
                                progress: data.progress ?? m.progress,
                            })
                        );
                    }

                    // If the final result is available now
                    if (data?.status === "SUCCEEDED" && data?.model_urls) {
                        dispatch(
                            finalizeModelFromTask({
                                ...m,
                                modelUrls: data.model_urls,
                                thumbnailUrl: data.thumbnail_url,
                                previewVideoUrl: data.video_url,
                                textureUrls: data.texture_urls,
                                status: "SUCCEEDED",
                                progress: 100,
                            })
                        );
                    }
                } catch (_) {
                    /* silent */
                }
            }
        })();

        return () => controller.abort();
    }, []); // only run once, on first load

    return (
        <section className="bg-white rounded-2xl shadow p-4 border space-y-4">
            {/* Input prompt + trigger */}
            <div className="flex items-center gap-2">
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type a 3D prompt…"
                    className="flex-1 rounded-lg border p-2 text-sm"
                />
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
                    {models.map((m) => (
                        <article key={m.id} className="rounded-xl border p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium truncate">
                                    {m.prompt ?? m.kind}
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100">
                  {m.status ?? "—"}
                </span>
                            </div>

                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                {m.thumbnailUrl ? (
                                    <img
                                        src={m.thumbnailUrl}
                                        alt="thumb"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-xs text-gray-500">No thumbnail</div>
                                )}
                            </div>

                            {typeof m.progress === "number" &&
                                (m.status === "PENDING" || m.status === "IN_PROGRESS") && (
                                    <div className="w-full h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-2 rounded bg-black transition-all"
                                            style={{
                                                width: `${Math.max(0, Math.min(100, m.progress ?? 0))}%`,
                                            }}
                                        />
                                    </div>
                                )}

                            {m.status === "SUCCEEDED" && (
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {Object.entries(m.modelUrls ?? {}).map(([fmt, url]) =>
                                        url ? (
                                            <a
                                                key={fmt}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline"
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
        </section>
    );
}
