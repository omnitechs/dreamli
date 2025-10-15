'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import useCommit from '@/app/(lang)/[lang]/ai/hooks/useCommit';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/(lang)/[lang]/ai/store';
import LazyGlb from '@/components/GlbViewer';
import {useMeshyStream} from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";

export default function Build3DCard({ projectId }: { projectId: string }) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [modelUrl, setModelUrl] = useState<string>();
    const [error, setError] = useState<string | null>(null);
    const { streamExistingTask,resumeAll ,startGenerationFromPrompt} = useMeshyStream();
    const {models} = useModels()
    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
        if (!modelUrls) return undefined;
        return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
    }
    React.useEffect(() => {
        console.log("loading the resumeAll");
        if (models?.length) resumeAll(models);
    }, []);

    const selectedModel = React.useMemo(
        () => models.find((m: any) => m.id === selectedId) ?? null,
        [models, selectedId]
    );

    const selectedModelUrl = pickBestModelUrl(selectedModel?.modelUrls);



    return (
        <div className="rounded-xl border p-4 space-y-3 bg-white shadow-sm">
            <div className="font-medium text-gray-900 flex items-center gap-2">
                3D Model Generation
            </div>

            <button
                onClick={startGenerationFromPrompt}
                disabled={isPending}
                className="rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
                {isPending ? 'Generating…' : 'Generate 3D (Meshy)'}
            </button>

            {status && (
                <div className="text-xs opacity-80">
                    Status: {status}{' '}
                    {Number.isFinite(progress) ? `(${Math.round(progress)}%)` : null}
                    {modelUrl && (
                        <>
                            {' '}—{' '}
                            <a
                                href={modelUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline"
                            >
                                Open model
                            </a>
                        </>
                    )}
                </div>
            )}

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
        </div>
    );
}
