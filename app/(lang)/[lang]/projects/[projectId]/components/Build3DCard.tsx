// app/projects/[projectId]/components/Build3DCard.tsx
'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { actionGenerate3D, actionRecordVersion } from '../actions';
import LazyGlb from "@/components/GlbViewer";

type Props = { projectId: string; headId: string; };

export default function Build3DCard({ projectId, headId }: Props) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const esRef = useRef<EventSource | null>(null);

    useEffect(() => () => { esRef.current?.close(); }, []);

    const onGenerate = () => {
        setError(null);
        setStatus('');
        setProgress(0);
        setModelUrl(undefined);

        startTransition(async () => {
            try {
                const { streamUrl, taskId } = await actionGenerate3D(projectId, headId);
                setStatus('PENDING');

                // Subscribe to SSE
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

                            if (best) setModelUrl(best);

                            // 👇 include `kind` you used for the streamUrl
                            await actionRecordVersion(projectId, headId, taskId, /* kind: */ new URL(streamUrl, location.href).searchParams.get('kind') as any);

                            es.close();
                        }
                    } catch { /* ignore JSON parse errors */ }
                };

                es.addEventListener('error', () => {
                    setError('Stream disconnected.');
                    es.close();
                });
            } catch (e: any) {
                setError(e?.message ?? String(e));
            }
        });
    };

    return (
        <div className="rounded-xl border p-3 space-y-3">
            <div className="font-medium">3D</div>

            <button
                onClick={onGenerate}
                disabled={isPending}
                className="rounded px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
            >
                {isPending ? 'Generating…' : 'Generate 3D (Meshy)'}
            </button>

            {status ? (
                <div className="text-xs opacity-80">
                    Status: {status}{' '}
                    {Number.isFinite(progress) ? `(${Math.round(progress)}%)` : null}
                    {modelUrl ? (
                        <>
                            {' '}—{' '}
                            <a href={modelUrl} target="_blank" rel="noreferrer" className="underline">
                                Open model
                            </a>
                        </>
                    ) : null}
                </div>
            ) : null}
            {modelUrl ? <LazyGlb modelUrl={modelUrl}/> : null}
            {error ? <div className="text-xs text-red-600">Error: {error}</div> : null}
        </div>
    );
}
