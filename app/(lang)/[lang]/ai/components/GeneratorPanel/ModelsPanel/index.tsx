"use client";

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { useMeshyStream } from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";

import LazyGlb from "@/components/GlbViewer";
import { useParams, useRouter } from "next/navigation";
import {useTranslations} from 'next-intl';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
    if (!modelUrls) return undefined;
    return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export function ModelsPanel() {
    const dispatch = useDispatch();
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? { textPrompt: "", models: [] };
    const { streamExistingTask,resumeAll } = useMeshyStream();
    const t = useTranslations('AI.Page.Models');

    const router = useRouter();
    const params = useParams();
    const lang = (params as any)?.lang as string | undefined;

    // selected model id for the preview panel below the grid
    const [selectedId, setSelectedId] = React.useState<string | null>(null);


    React.useEffect(() => {

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
                    {t('generateStream')}
                </button>
            </div>

            {/* Models grid */}
            {models.length === 0 ? (
                <div className="text-sm text-gray-500">{t('noModels')}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((m: any) => (
                        <article
                            key={m.id}
                            onClick={() => setSelectedId(m.id)}
                            className={`rounded-xl border p-3 space-y-2 cursor-pointer transition ${
                                selectedId === m.id ? "ring-2 ring-black" : "hover:bg-gray-50"
                            }`}
                            title={t('clickToPreview')}
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
                                    <img src={m.thumbnailUrl} alt={t('thumbAlt')} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-xs text-gray-500">{t('noThumbnail')}</div>
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

                            <div className="flex items-center justify-between">
                                <div className="text-[10px] text-gray-500">
                                    {new Date(m.createdAt ?? Date.now()).toLocaleString()}
                                </div>
                                {m.status === 'SUCCEEDED' ? (
                                    <button
                                        className="text-[10px] sm:text-xs px-2 py-1 rounded border hover:bg-gray-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const path = `/${lang ?? ''}/ai/purchase?modelId=${encodeURIComponent(m.id)}`.replace('//', '/');
                                            router.push(path);
                                        }}
                                        title={t('purchaseTitle')}
                                    >
                                        {t('purchase')}
                                    </button>
                                ) : null}
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
                            {t('previewLabel')} {selectedModel.prompt ?? selectedModel.kind}
                        </div>
                        <button
                            className="text-xs underline text-gray-600"
                            onClick={() => setSelectedId(null)}
                        >
                            {t('close')}
                        </button>
                    </div>

                    {selectedModelUrl ? (
                        <LazyGlb
                            key={selectedModelUrl || selectedModel.id}
                            modelUrl={selectedModelUrl} />
                    ) : (
                        <div className="text-sm text-gray-500">
                            {t('noPreviewable')}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
