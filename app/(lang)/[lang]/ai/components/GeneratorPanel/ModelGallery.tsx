// app/projects/[projectId]/components/ModelsGallery.tsx
'use client';

import LazyGlb from '@/components/GlbViewer';
import useModels from '@/app/(lang)/[lang]/ai/hooks/useModels';
import React, { useEffect, useMemo, useState } from 'react';
import { useMeshyStream } from '@/app/(lang)/[lang]/ai/hooks/useMeshyStream';
import { useParams, useRouter } from 'next/navigation';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
    if (!modelUrls) return undefined;
    return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

function PurchaseButton({ modelId, onClick }: { modelId: string; onClick?: React.MouseEventHandler }) {
    const router = useRouter();
    const params = useParams();
    const lang = (params as any)?.lang as string | undefined;

    const go = (e: React.MouseEvent) => {
        onClick?.(e);
        e.stopPropagation();
        const path = `/${lang ?? ''}/ai/purchase?modelId=${encodeURIComponent(modelId)}`.replace('//', '/');
        router.push(path);
    };

    return (
        <button
            className="text-[10px] sm:text-xs px-2 py-1 rounded border hover:bg-gray-50"
            onClick={go}
            title="Purchase this model"
        >
            Purchase
        </button>
    );
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

    // Listen to selection from the top navbar
    useEffect(() => {
        function onSelect(ev: Event) {
            try {
                const ce = ev as CustomEvent<{ modelId?: string }>;
                const id = ce?.detail?.modelId || null;
                if (id) setSelectedId(id);
            } catch {}
        }
        try { window.addEventListener('ai-model-select' as any, onSelect as any); } catch {}
        return () => { try { window.removeEventListener('ai-model-select' as any, onSelect as any); } catch {} };
    }, []);

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
                    {selectedModel ? (
                        <div className="mt-2 space-y-3">
                            <div className="flex items-center justify-between">
                                {/*<div className="text-sm font-medium truncate">*/}
                                {/*    Preview: {selectedModel.prompt ?? selectedModel.kind}*/}
                                {/*</div>*/}
                                <button
                                    className="
      ml-auto
      inline-flex items-center justify-center
      rounded-full
      bg-blue-600
      px-3 py-1
      text-xs font-semibold text-white
      shadow
      hover:bg-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    "
                                    onClick={() => setSelectedId(null)}
                                >
                                    Close
                                </button>
                            </div>
                            <div className="h-80 overflow-hidden rounded-xl border bg-gray-50 flex items-center justify-center shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
                            {selectedModelUrl ? (
                                <LazyGlb
                                    key={selectedModelUrl || selectedModel.id}
                                    modelUrl={selectedModelUrl}
                                />
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No previewable URL yet. We look for .glb first, then .fbx, .obj, .usdz.
                                </div>
                            )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border p-4 text-sm text-gray-600">
                            Select a model from the top bar to preview it here.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
