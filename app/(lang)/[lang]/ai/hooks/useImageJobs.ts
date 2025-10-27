// app/(lang)/[lang]/ai/hooks/useImageJobs.ts
'use client';

/* Client image jobs logging helper */
const uiLog = (...args: any[]) => { try { console.log('[IMG/JOB]', ...args); } catch {} };

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addImages, setMode, updateText } from '@/app/store/slices/generatorSlice';
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

export default function useImageJobs() {
    const dispatch = useDispatch();
    const {getSelectedImageUrls} = useImages()
    const [activeJobIds, setActive] = useState<string[]>([]);
    const sources = useRef<Map<string, EventSource>>(new Map());
    const jobStatus = useRef<Map<string, JobStatus>>(new Map());
    // Track placeholders per job and latest URLs to safely update meta without losing URLs
    const jobToIds = useRef<Map<string, Set<string>>>(new Map());
    const idToUrl = useRef<Map<string, string>>(new Map());
    const idToIndex = useRef<Map<string, number>>(new Map());

    /* ---------------- helpers ---------------- */

    const ensurePlaceholder = useCallback((jobId: string, index: number) => {
        const id = `${jobId}__ph__${index}`;
        uiLog('PH', { jobId, index, id });
        // Track mapping for status updates
        const setForJob = jobToIds.current.get(jobId) || new Set<string>();
        setForJob.add(id);
        jobToIds.current.set(jobId, setForJob);
        idToIndex.current.set(id, index);
        idToUrl.current.set(id, TRANSPARENT_1PX_SVG);
        // Always dispatch a placeholder (idempotent: addImages replaces existing with same id)
        const current = jobStatus.current.get(jobId);
        const st = current === 'RUNNING' ? 'Generating' : current === 'SUCCEEDED' ? 'Done' : current === 'FAILED' ? 'Failed' : current === 'CANCELED' ? 'Canceled' : 'Queued';
        dispatch(
            addImages([
                toImage({
                    id,
                    url: TRANSPARENT_1PX_SVG,
                    meta: { placeholder: true, jobId, index, status: st },
                }),
            ]),
        );
        return id;
    }, [dispatch]);

    // Immediate swap to data: URL (UI updates), then upload in background (no await in handler)
    const swapToBase64ThenUpload = useCallback((phId: string, base64: string) => {
        const dataUrl = `data:image/png;base64,${base64}`;
        idToUrl.current.set(phId, dataUrl);
        // 1) Instant UI update
        dispatch(
            addImages([
                toImage({
                    id: phId,
                    url: dataUrl,
                    meta: { swappedAt: Date.now(), fromStream: true, status: 'Generating' },
                }),
            ]),
        );

        // 2) Background upload (do NOT await in the onmessage handler)
        (async () => {
            try {
                uiLog('UPLOAD_START', { id: phId });
                const file = dataUrlToFile(dataUrl, `ai-${phId}.png`);
                const { url, key } = await uploadFileToPublic(file);
                uiLog('UPLOAD_OK', { id: phId, key });
                idToUrl.current.set(phId, url);
                dispatch(
                    addImages([
                        toImage({
                            id: phId,
                            url,
                            key,
                            meta: { uploadedAt: Date.now(), fromStream: true, status: 'Done' },
                        }),
                    ]),
                );
            } catch (e:any) {
                uiLog('UPLOAD_FAIL', { id: phId, error: String(e?.message || e) });
                // keep data URL on failure
            }
        })();
    }, [dispatch]);

    const setFinalUrl = useCallback((phId: string, url: string) => {
        idToUrl.current.set(phId, url);
        dispatch(addImages([toImage({ id: phId, url, meta: { fromStream: true, status: 'Done' } })]));
    }, [dispatch]);

    /* ---------------- finalize / cleanup ---------------- */

    const finalizeJob = useCallback((jobId: string) => {
        uiLog('FINALIZE', { jobId });
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
        uiLog('ATTACH', { jobId });
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
                        // Update status label on all known placeholders for this job
                        const ids = jobToIds.current.get(jobId);
                        const label = s === 'RUNNING' ? 'Generating' : s === 'SUCCEEDED' ? 'Done' : s === 'FAILED' ? 'Failed' : s === 'CANCELED' ? 'Canceled' : 'Queued';
                        if (ids && ids.size) {
                            const updates = Array.from(ids).map((id) => toImage({ id, url: idToUrl.current.get(id) || TRANSPARENT_1PX_SVG, meta: { fromStream: true, status: label } }));
                            if (updates.length) dispatch(addImages(updates));
                        }
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

    const startJob = async (
        { prompt, n = 1, size = '1024x1024' as ImgSize, refs }: { prompt: string; n?: number; size?: ImgSize; refs?: string[] }
    ) => {
        // Ensure the right panel shows the image grid
        try { (dispatch as any)(setMode('image')); } catch {}
        const refsToUse = Array.isArray(refs) && refs.length ? refs : getSelectedImageUrls();
        uiLog('START', { promptLen: prompt.length, n, size, refsCount: Array.isArray(refsToUse) ? refsToUse.length : 0 });
        // Sync prompt into Generator UI so it matches manual flow
        try { (dispatch as any)(updateText(prompt)); } catch {}
        const res = await fetch('/api/ai/images/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, n, size, refs: refsToUse }),
        });
        if (res.status === 402) {
            uiLog('START 402 insufficient credits');
            try { sessionStorage.setItem('insufficient_credits_msg', 'Your balance is not enough. Please add credits.'); } catch {}
            const seg = (typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en');
            try { window.dispatchEvent(new CustomEvent('open-credits-modal', { detail: { lang: seg } })); } catch {}
            return null;
        }
        if (!res.ok) { uiLog('START_FAIL', { status: res.status }); throw new Error('Failed to start job'); }
        // reservation completed → notify header to refresh
        try { window.dispatchEvent(new Event('credits-updated')); } catch {}
        const { jobId, placeholderIds } = await res.json();
        uiLog('START_OK', { jobId, placeholders: Array.isArray(placeholderIds) ? placeholderIds.length : 0 });

        // Create placeholders deterministically; if server provided IDs, use them
        if (Array.isArray(placeholderIds) && placeholderIds.length) {
            const current = jobStatus.current.get(jobId) || 'QUEUED';
            const st = current === 'RUNNING' ? 'Generating' : current === 'SUCCEEDED' ? 'Done' : current === 'FAILED' ? 'Failed' : current === 'CANCELED' ? 'Canceled' : 'Queued';
            for (let i = 0; i < placeholderIds.length; i++) {
                const id = placeholderIds[i];
                // track mappings so later status updates apply to these too
                const setForJob = jobToIds.current.get(jobId) || new Set<string>();
                setForJob.add(id);
                jobToIds.current.set(jobId, setForJob);
                idToIndex.current.set(id, i);
                idToUrl.current.set(id, TRANSPARENT_1PX_SVG);
                dispatch(addImages([toImage({ id, url: TRANSPARENT_1PX_SVG, meta: { placeholder: true, jobId, index: i, status: st } })]));
            }
        } else {
            for (let i = 0; i < n; i++) ensurePlaceholder(jobId, i);
        }

        try { localStorage.setItem(`ai.job:${jobId}`, '1'); } catch {}
        jobStatus.current.set(jobId, 'RUNNING');
        attach(jobId);
        try { window.dispatchEvent(new CustomEvent('ai-images-job-started', { detail: { jobId } })); } catch {}
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
