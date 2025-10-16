// app/(lang)/[lang]/ai/hooks/useImageJobs.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addImages } from '@/app/(lang)/[lang]/ai/store/slices/generatorSlice';
import {data} from "autoprefixer";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";


const TRANSPARENT_1PX_SVG =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=';

function toImage(partial: { id: string; url: string; key?: string; meta?: any }) {
    return { id: partial.id, url: partial.url, key: partial.key ?? '', meta: partial.meta };
}

function dataUrlToFile(dataUrl: string, filename = 'ai.png'): File {
    const [header, base64] = dataUrl.split(',');
    const mime = /data:(.*?);base64/.exec(header)?.[1] || 'image/png';
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return new File([bytes], filename, { type: mime });
}

async function uploadFileToPublic(file: File): Promise<{ url: string; key: string }> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/uploads/presign', { method: 'POST', body: fd });
    if (!res.ok) throw new Error(`upload failed (${res.status})`);
    const data = await res.json();
    return { url: String(data?.url ?? ''), key: String(data?.key ?? '') };
}

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
type JobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
const isTerminal = (s?: JobStatus) => s === 'SUCCEEDED' || s === 'FAILED' || s === 'CANCELED';


type Img = { id?: string; url?: string; src?: string; meta?: any };
const getUrl = (img: Img) => img.url || img.src || '';

export default function useImageJobs() {
    const dispatch = useDispatch();
    const {getSelectedImageUrls} = useImages()
    const [activeJobIds, setActive] = useState<string[]>([]);
    const sources = useRef<Map<string, EventSource>>(new Map());
    const jobStatus = useRef<Map<string, JobStatus>>(new Map());

    /* ---------------- helpers ---------------- */

    const ensurePlaceholder = useCallback((jobId: string, index: number) => {
        const id = `${jobId}__ph__${index}`;
        // Always dispatch a placeholder (idempotent: addImages replaces existing with same id)
        dispatch(
            addImages([
                toImage({
                    id,
                    url: TRANSPARENT_1PX_SVG,
                    meta: { placeholder: true, jobId, index },
                }),
            ]),
        );
        return id;
    }, [dispatch]);

    // Immediate swap to data: URL (UI updates), then upload in background (no await in handler)
    const swapToBase64ThenUpload = useCallback((phId: string, base64: string) => {
        const dataUrl = `data:image/png;base64,${base64}`;
        // 1) Instant UI update
        dispatch(
            addImages([
                toImage({
                    id: phId,
                    url: dataUrl,
                    meta: { swappedAt: Date.now(), fromStream: true },
                }),
            ]),
        );

        console.log("uploading image has been done");

        // 2) Background upload (do NOT await in the onmessage handler)
        (async () => {
            try {
                const file = dataUrlToFile(dataUrl, `ai-${phId}.png`);
                const { url, key } = await uploadFileToPublic(file);
                dispatch(
                    addImages([
                        toImage({
                            id: phId,
                            url,
                            key,
                            meta: { uploadedAt: Date.now(), fromStream: true },
                        }),
                    ]),
                );
            } catch {
                // keep data URL on failure
            }
        })();
    }, [dispatch]);

    const setFinalUrl = useCallback((phId: string, url: string) => {
        dispatch(addImages([toImage({ id: phId, url, meta: { fromStream: true } })]));
    }, [dispatch]);

    /* ---------------- finalize / cleanup ---------------- */

    const finalizeJob = useCallback((jobId: string) => {
        const es = sources.current.get(jobId);
        if (es) {
            try { es.close(); } catch {}
            sources.current.delete(jobId);
        }
        setActive(prev => prev.filter(id => id !== jobId));
        jobStatus.current.delete(jobId);
        try { localStorage.removeItem(`ai.job:${jobId}`); } catch {}
    }, []);

    /* ---------------- SSE attach (replay + live) ---------------- */

    const attach = useCallback((jobId: string) => {
        if (sources.current.has(jobId)) return;
        const es = new EventSource(`/api/ai/images/jobs/${jobId}/events`);
        sources.current.set(jobId, es);
        setActive(prev => (prev.includes(jobId) ? prev : [jobId, ...prev]));

        es.onmessage = (e) => {
            try {
                const payload = JSON.parse(e.data);
                switch (payload?.type) {
                    case 'image': {

                        const index = Number(payload.index ?? 0);
                        const phId = ensurePlaceholder(jobId, index); // self-heal: make sure id exists
                        if (payload.base64) {
                            swapToBase64ThenUpload(phId, payload.base64);
                        } else if (payload.url) {
                            setFinalUrl(phId, payload.url);
                        }
                        return;
                    }

                    case 'status': {
                        const s = String(payload.status || '').toUpperCase() as JobStatus;
                        if (s) jobStatus.current.set(jobId, s);
                        // DON'T finalize on SUCCEEDED; wait for 'done' so replayed images render after refresh.
                        if (s === 'FAILED' || s === 'CANCELED') finalizeJob(jobId);
                        return;
                    }

                    case 'done': {
                        finalizeJob(jobId);
                        return;
                    }

                    case 'debug_event': {
                        console.log('DBG EVENT', payload.idx, payload.evType, payload.evSize, payload.preview);
                    }
                    case 'debug_summary' :{
                        console.log('DBG SUMMARY', payload);
                    }

                    default:
                        // ignore heartbeats/unknown
                        return;
                }
            } catch {
                console.error("error")
                // ignore parse errors
            }
        };

        es.onerror = () => {
            const s = jobStatus.current.get(jobId);
            if (isTerminal(s)) finalizeJob(jobId);
            // else let EventSource retry
        };
    }, [ensurePlaceholder, finalizeJob, setFinalUrl, swapToBase64ThenUpload]);

    /* ---------------- start job ---------------- */

    const startJob = async ({ prompt, n = 1, size = '1024x1024' as ImgSize }) => {

        console.log('startjob')

        const refs = getSelectedImageUrls()
        const res = await fetch('/api/ai/images/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, n, size, refs }),
        });
        if (!res.ok) throw new Error('Failed to start job');
        const { jobId, placeholderIds } = await res.json();

        // Create placeholders deterministically; if server provided IDs, use them
        if (Array.isArray(placeholderIds) && placeholderIds.length) {
            for (let i = 0; i < placeholderIds.length; i++) {
                const id = placeholderIds[i];
                dispatch(addImages([toImage({ id, url: TRANSPARENT_1PX_SVG, meta: { placeholder: true, jobId, index: i } })]));
            }
        } else {
            for (let i = 0; i < n; i++) ensurePlaceholder(jobId, i);
        }

        try { localStorage.setItem(`ai.job:${jobId}`, '1'); } catch {}
        jobStatus.current.set(jobId, 'RUNNING');
        attach(jobId);
        return jobId;
    };

    /* ---------------- auto-resume ---------------- */

    useEffect(() => {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i)!;
                if (k.startsWith('ai.job:')) {
                    const jobId = k.slice('ai.job:'.length);
                    attach(jobId);
                }
            }
        } catch {
            // ignore
        }
    }, [attach]);

    /* ---------------- teardown ---------------- */

    useEffect(() => {
        return () => {
            for (const es of sources.current.values()) {
                try { es.close(); } catch {}
            }
            sources.current.clear();
            jobStatus.current.clear();
        };
    }, []);

    return { startJob, activeJobIds, attach };
}
