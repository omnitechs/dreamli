'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import useCommit from '@/app/(lang)/[lang]/ai/hooks/useCommit';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/(lang)/[lang]/ai/store';
import LazyGlb from '@/components/GlbViewer';

export default function Build3DCard({ projectId }: { projectId: string }) {
    const { headId, onCommit, savingCommit } = useCommit();
    const generator = useSelector((s: RootState) => (s as any)?.generator);

    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);
    const [modelUrl, setModelUrl] = useState<string>();
    const [error, setError] = useState<string | null>(null);
    const esRef = useRef<EventSource | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            esRef.current?.close();
        };
    }, []);

    /** 🔹 Start 3D generation via Meshy stream API */
    const onGenerate = () => {
        if (!projectId || !headId) return;
        setError(null);
        setStatus('');
        setProgress(0);
        setModelUrl(undefined);

        startTransition(async () => {
            try {
                const res = await fetch(`/api/ai/meshy/start?projectId=${projectId}&commitId=${headId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: generator.textPrompt ?? '',
                        images: generator.images ?? [],
                    }),
                });

                if (!res.ok) throw new Error(`Failed to start 3D generation (${res.status})`);
                const { streamUrl } = await res.json();

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

    return (
        <div className="rounded-xl border p-4 space-y-3 bg-white shadow-sm">
            <div className="font-medium text-gray-900 flex items-center gap-2">
                3D Model Generation
            </div>

            <button
                onClick={onGenerate}
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

            {modelUrl && (
                <div className="rounded-lg overflow-hidden border mt-2">
                    <LazyGlb modelUrl={modelUrl} />
                </div>
            )}

            {error && <div className="text-xs text-red-600">Error: {error}</div>}
        </div>
    );
}
