// app/projects/[projectId]/components/ModelsGallery.tsx
'use client';

import LazyGlb from '@/components/GlbViewer';
import useModels from '@/app/(lang)/[lang]/ai/hooks/useModels';
import React, { useEffect, useMemo, useState } from 'react';
import { useMeshyStream } from '@/app/(lang)/[lang]/ai/hooks/useMeshyStream';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
    if (!modelUrls) return undefined;
    return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export default function ModelsGallery() {
    const { models } = useModels();                    // ✅ hook always runs
    const { resumeAll } = useMeshyStream();            // ✅ hook always runs

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [modelUrl, setModelUrl] = useState<string>();

    // ✅ effect runs every render, but does nothing when empty
    useEffect(() => {
        if (models?.length) resumeAll(models);
    }, [models, resumeAll]);

    const selectedModel = useMemo(
        () => models?.find((m: any) => m.id === selectedId) ?? null,
        [models, selectedId]
    );
    const selectedModelUrl = pickBestModelUrl(selectedModel?.modelUrls);

    // ---- render (branch *after* hooks) ----
    const empty = !models?.length;

    return (
        <div className="space-y-6">
            {status && (
                <div className="text-xs opacity-80">
                    Status: {status} {Number.isFinite(progress) ? `(${Math.round(progress)}%)` : null}
                    {modelUrl && (
                        <>
                            {' '}—{' '}
                            <a href={modelUrl} target="_blank" rel="noreferrer" className="underline">
                                Open model
                            </a>
                        </>
                    )}
                </div>
            )}

            {empty ? (
                <div className="rounded-xl border p-4 text-sm opacity-70">
                    No models yet. Generate one to see it here.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {models.map((m: any) => (
                            <article
                                key={m.id}
                                onClick={() => setSelectedId(m.id)}
                                className={`rounded-xl border p-3 space-y-2 cursor-pointer transition ${
                                    selectedId === m.id ? 'ring-2 ring-black' : 'hover:bg-gray-50'
                                }`}
                                title="Click to preview below"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium truncate">{m.prompt ?? m.kind}</div>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100">
                    {m.status ?? '—'}
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

                                {typeof m.progress === 'number' &&
                                    (m.status === 'PENDING' || m.status === 'IN_PROGRESS') && (
                                        <div className="w-full h-2 bg-gray-200 rounded">
                                            <div
                                                className="h-2 rounded bg-black transition-all"
                                                style={{ width: `${Math.max(0, Math.min(100, m.progress ?? 0))}%` }}
                                            />
                                        </div>
                                    )}

                                {m.status === 'SUCCEEDED' && (
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
                                    modelUrl={selectedModelUrl}
                                />
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No previewable URL yet. (We look for <code>.glb</code> first, then <code>.fbx</code>, <code>.obj</code>, <code>.usdz</code>.)
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
