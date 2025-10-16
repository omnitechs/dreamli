// app/(lang)/[lang]/ai/server/runImageJob.ts
import { prisma } from '@/lib/prisma';
import { JobBus } from './jobBus';
export const runtime = 'nodejs';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';

const DRY = process.env.AI_DRY_RUN === '1';

// false => use real /api/ai/images/stream ; true => use /mock
const USE_MOCK_STREAM = false;
const MOCK_PATH   = '/api/ai/images/stream/mock';
const STREAM_PATH = '/api/ai/images/stream';

/* -------------------- helpers -------------------- */

const BASE64_RE = /^[A-Za-z0-9+/=\r\n]+$/;
const MIN_B64_LEN = process.env.NODE_ENV === 'development' ? 80 : 1000;

function collectBase64Candidates(node: any, out: string[], depth = 0) {
    if (!node || depth > 6) return;

    if (typeof node === 'string') {
        const s = node.trim();
        if (s.startsWith('data:image/') && s.includes(';base64,')) {
            const b64 = s.split(',')[1] || '';
            if (b64.length >= MIN_B64_LEN && BASE64_RE.test(b64)) out.push(b64);
            return;
        }
        if (s.length >= MIN_B64_LEN && BASE64_RE.test(s)) out.push(s);
        return;
    }

    if (Array.isArray(node)) {
        for (const it of node) collectBase64Candidates(it, out, depth + 1);
        return;
    }

    if (typeof node === 'object') {
        const preferred = ['image_base64','image_b64','b64','b64_json','data','result','results','images','image','output','content'];
        for (const k of Object.keys(node)) if (preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
        for (const k of Object.keys(node)) if (!preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
    }
}

function resolveBaseUrl() {
    const explicit = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    if (explicit) return explicit.replace(/\/$/, '');
    const vercel = process.env.VERCEL_URL;
    if (vercel) return `https://${vercel}`.replace(/\/$/, '');
    return 'http://localhost:3000';
}

async function* iterateSSE(resp: Response) {
    if (!resp.ok || !resp.body) throw new Error(`stream failed (${resp.status})`);
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const frames = buf.split('\n\n');
            buf = frames.pop() || '';
            for (const frame of frames) {
                const line = frame.trim();
                if (!line.startsWith('data:')) continue;
                try {
                    const payload = JSON.parse(line.slice(5));
                    yield payload;
                } catch {
                    // ignore malformed frame
                }
            }
        }
    } finally {
        try { await reader.cancel(); } catch {}
    }
}

async function saveChunk(jobId: string, index: number, base64: string) {
    try {
        await prisma.imageChunk.create({ data: { jobId, index, base64 } });
    } catch (e: any) {
        if (e?.code === 'P2002') {
            await prisma.imageChunk.update({
                where: { jobId_index: { jobId, index } as any },
                data: { base64 },
            }).catch(async () => {
                const existing = await prisma.imageChunk.findFirst({ where: { jobId, index } });
                if (existing) {
                    await prisma.imageChunk.update({ where: { id: existing.id }, data: { base64 } });
                }
            });
        } else {
            throw e;
        }
    }
}

async function emitOne(jobId: string, index: number, base64: string) {
    await saveChunk(jobId, index, base64);
    await prisma.imageJob.update({ where: { id: jobId }, data: { emitted: { increment: 1 } } });
    JobBus.publish(jobId, { type: 'image', index, base64 });
}

/* -------------------- main runner -------------------- */

export async function runImageJob(jobId: string) {
    await prisma.imageJob.update({ where: { id: jobId }, data: { status: 'RUNNING' } });
    JobBus.publish(jobId, { type: 'status', status: 'RUNNING' });

    const job = await prisma.imageJob.findUnique({ where: { id: jobId } }) as any;
    if (!job) return;

    const n: number = Math.min(10, Math.max(1, Number(job.n ?? 1)));
    const size: ImgSize = (job.size as ImgSize) || '1024x1024';
    const prompt: string = String(job.prompt ?? '');
    const refs: string[] = Array.isArray(job?.refs) ? job.refs : [];
    console.log("refs",refs)

    JobBus.publish(jobId, { type: 'context', prompt, refs, size, n });

    try {
        if (DRY) {
            for (let i = 0; i < n; i++) {
                await new Promise(r => setTimeout(r, 200));
                const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottwAAAABJRU5ErkJggg==';
                await emitOne(jobId, i, b64);
            }
            await prisma.imageJob.update({ where: { id: jobId }, data: { status: 'SUCCEEDED' } });
            JobBus.publish(jobId, { type: 'status', status: 'SUCCEEDED' });
            JobBus.publish(jobId, { type: 'done' });
            return;
        }

        const base = resolveBaseUrl();
        const path = USE_MOCK_STREAM ? MOCK_PATH : STREAM_PATH;

        console.log(`[JOB ${jobId}] open stream → ${path}`, { n, size, refs: refs.length });

        // ⬇️ CRITICAL: make this fetch SSE-friendly to avoid buffering
        const resp = await fetch(`${base}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',     // tell server/proxies it's SSE
                'Accept-Encoding': 'identity',     // disable gzip chunk coalescing
            },
            cache: 'no-store',                    // disable caching/buffering
            next: { revalidate: 0 },              // (Next) same as above
            body: JSON.stringify({ prompt, refs, size, n }),
        });

        let emitted = 0;
        let eventsRead = 0;

        for await (const ev of iterateSSE(resp)) {
            eventsRead++;
            JobBus.publish(jobId, {
                type: 'debug_event',
                idx: eventsRead,
                evType: ev?.type ?? '(no type)',
                evSize: (() => { try { return JSON.stringify(ev).length; } catch { return -1; } })(),
                preview: typeof ev === 'object' ? Object.keys(ev).slice(0, 6) : String(ev).slice(0, 60),
            } as any);

            if (ev?.type === 'status' && ev.stage) {
                JobBus.publish(jobId, { type: 'status', status: 'RUNNING' });
            }
            if (ev?.type === 'response.error' || ev?.type === 'error') {
                throw new Error(ev?.error?.message || ev?.message || 'Generation failed');
            }

            // 1) Preferred batch
            if (ev?.type === 'image_base64_batch' && Array.isArray(ev.images)) {
                for (const b64 of ev.images) {
                    if (emitted >= n) break;
                    await emitOne(jobId, emitted, b64);
                    emitted++;
                }
                continue;
            }

            // 2) OpenAI-like partials
            if (ev?.result && Array.isArray(ev.result.images)) {
                for (const it of ev.result.images) {
                    const b64 = it?.image_base64;
                    if (typeof b64 === 'string' && b64) {
                        if (emitted >= n) break;
                        await emitOne(jobId, emitted, b64);
                        emitted++;
                    }
                }
                continue;
            }

            // 3) Completed bundles
            if (Array.isArray(ev?.result)) {
                for (const it of ev.result) {
                    const b64 = it?.b64_json;
                    if (typeof b64 === 'string' && b64) {
                        if (emitted >= n) break;
                        await emitOne(jobId, emitted, b64);
                        emitted++;
                    }
                }
                continue;
            }

            // 4) Fallback collector
            const tmp: string[] = [];
            collectBase64Candidates(ev, tmp);
            for (const b64 of tmp) {
                if (emitted >= n) break;
                await emitOne(jobId, emitted, b64);
                emitted++;
            }
        }

        JobBus.publish(jobId, { type: 'debug_summary', eventsRead, emitted } as any);

        const ok = emitted > 0;
        await prisma.imageJob.update({
            where: { id: jobId },
            data: { status: ok ? 'SUCCEEDED' : 'FAILED', error: ok ? null : 'No images emitted' },
        });
        JobBus.publish(jobId, { type: 'status', status: ok ? 'SUCCEEDED' : 'FAILED' });
        JobBus.publish(jobId, { type: 'done' });
        return;

    } catch (e: any) {
        await prisma.imageJob.update({
            where: { id: jobId },
            data: { status: 'FAILED', error: e?.message ?? 'Failed' },
        });
        JobBus.publish(jobId, { type: 'error', message: e?.message ?? 'Failed' });
        JobBus.publish(jobId, { type: 'status', status: 'FAILED' });
    }
}
