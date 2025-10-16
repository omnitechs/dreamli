import { prisma } from '@/lib/prisma';
import { JobBus } from './jobBus';
import OpenAI from 'openai';

export const runtime = 'nodejs';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';

const DRY = process.env.AI_DRY_RUN === '1';
const USE_MOCK = false   // ← toggle with env
const VERBOSE = process.env.AI_VERBOSE_LOG === '1';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const BASE64_RE = /^[A-Za-z0-9+/=\r\n]+$/;
const MIN_B64_LEN = process.env.NODE_ENV === 'development' ? 80 : 1000;

function collectBase64Candidates(node: any, out: string[], depth = 0) {
    if (!node || depth > 7) return;
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
    if (Array.isArray(node)) { for (const it of node) collectBase64Candidates(it, out, depth + 1); return; }
    if (typeof node === 'object') {
        const preferred = ['image_base64','image_b64','b64','b64_json','data','result','results','images','image','output','content'];
        for (const k of Object.keys(node)) if (preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
        for (const k of Object.keys(node)) if (!preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
    }
}

// ✅ idempotent write using composite unique (jobId,index)
async function saveChunk(jobId: string, index: number, base64: string) {
    await prisma.imageChunk.upsert({
        where: { jobId_index: { jobId, index } as any },
        create: { jobId, index, base64 },
        update: { base64 },
    });
}

async function emitOne(jobId: string, index: number, base64: string) {
    await saveChunk(jobId, index, base64);
    await prisma.imageJob.update({
        where: { id: jobId },
        data: { emitted: { increment: 1 } },
    });
    JobBus.publish(jobId, { type: 'image', index, base64 });
}

/* ------------ MOCK PATH (dev-only SSE to your fake endpoint) ------------ */

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
                try { yield JSON.parse(line.slice(5)); } catch {}
            }
        }
    } finally { try { await reader.cancel(); } catch {} }
}

function resolveBaseUrl() {
    const explicit = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
    if (explicit) return explicit.replace(/\/$/, '');
    const vercel = process.env.VERCEL_URL;
    if (vercel) return `https://${vercel}`.replace(/\/$/, '');
    return 'http://localhost:3000';
}

async function runViaMock(jobId: string, { prompt, refs, size, n }:
{ prompt: string; refs: string[]; size: ImgSize; n: number }) {

    const base = resolveBaseUrl();
    const resp = await fetch(`${base}/api/ai/images/stream/mock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'identity',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
        body: JSON.stringify({ prompt, refs, size, n }),
    });

    let emitted = 0;

    for await (const ev of iterateSSE(resp)) {
        // explicit shapes
        if (ev?.type === 'image_base64_batch' && Array.isArray(ev.images)) {
            for (const b64 of ev.images) {
                if (emitted >= n) break;
                await emitOne(jobId, emitted, b64);
                emitted++;
            }
            continue;
        }
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
        // fallback collector
        const tmp: string[] = [];
        collectBase64Candidates(ev, tmp);
        for (const b64 of tmp) {
            if (emitted >= n) break;
            await emitOne(jobId, emitted, b64);
            emitted++;
        }
    }

    return emitted;
}

/* --------------------------- MAIN RUNNER --------------------------- */

export async function runImageJob(jobId: string) {
    // it's okay if status was flipped by the events route claim; but keep this for non-claimed paths
    await prisma.imageJob.updateMany({ where: { id: jobId, status: 'QUEUED' }, data: { status: 'RUNNING' } });
    JobBus.publish(jobId, { type: 'status', status: 'RUNNING' });

    const job = await prisma.imageJob.findUnique({ where: { id: jobId } }) as any;
    if (!job) return;

    const n: number  = Math.min(10, Math.max(1, Number(job.n ?? 1)));
    const size: ImgSize = (job.size as ImgSize) || '1024x1024';
    const prompt: string = String(job.prompt ?? '');
    const refs: string[] = Array.isArray(job?.refs) ? job.refs : [];

    try {
        if (DRY) {
            for (let i = 0; i < n; i++) {
                await new Promise(r => setTimeout(r, 120));
                const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottwAAAABJRU5ErkJggg==';
                await emitOne(jobId, i, b64);
            }
            await prisma.imageJob.update({ where: { id: jobId }, data: { status: 'SUCCEEDED' } });
            JobBus.publish(jobId, { type: 'status', status: 'SUCCEEDED' });
            JobBus.publish(jobId, { type: 'done' });
            return;
        }

        let emitted = 0;

        // simple per-job queue to serialize handler work (no index races)
        let queue: Promise<void> = Promise.resolve();
        const enqueue = (fn: () => Promise<void>) => { queue = queue.then(fn).catch(() => {}); return queue; };

        if (USE_MOCK) {
            emitted = await runViaMock(jobId, { prompt, refs, size, n });

            // finalize after mock
            const ok = emitted > 0;
            await prisma.imageJob.update({
                where: { id: jobId },
                data: { status: ok ? 'SUCCEEDED' : 'FAILED', error: ok ? null : 'No images emitted' },
            });
            JobBus.publish(jobId, { type: 'status', status: ok ? 'SUCCEEDED' : 'FAILED' });
            JobBus.publish(jobId, { type: 'done' });
            return;
        }

        // ---- OpenAI live path ----
        if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

        const instruction =
            (prompt || 'Create an image inspired by the references.') +
            ` (Generate at ${size}; PNG output.)`;

        const baseContent: any[] = [
            ...refs
                .filter((u: unknown) => typeof u === 'string' && /^https?:\/\//i.test(u))
                .map((url: string) => ({ type: 'input_image', image_url: { url } })),
            { type: 'input_text', text: instruction },
        ];

        const rsp = await openai.responses.stream({
            model: 'gpt-5',
            input: [{ role: 'user', content: baseContent }],
            tools: [{ type: 'image_generation' }],
            tool_choice: 'required',
        });

        rsp.on('event', (ev: any) => {
            enqueue(async () => {
                // extract base64 candidates
                const tmp: string[] = [];
                collectBase64Candidates(ev, tmp);

                // explicit shapes
                if (ev?.type === 'image_base64_batch' && Array.isArray(ev.images)) {
                    for (const b64 of ev.images) tmp.push(b64);
                }
                if (ev?.result && Array.isArray(ev.result.images)) {
                    for (const it of ev.result.images) {
                        const b64 = it?.image_base64;
                        if (typeof b64 === 'string') tmp.push(b64);
                    }
                }
                if (Array.isArray(ev?.result)) {
                    for (const it of ev.result) {
                        const b64 = it?.b64_json;
                        if (typeof b64 === 'string') tmp.push(b64);
                    }
                }

                for (const b64 of tmp) {
                    if (emitted >= n) break;
                    const index = emitted; // capture current
                    emitted += 1;          // increment inside the queue
                    await emitOne(jobId, index, b64);
                }
            });
        });

        rsp.on('error', async (e: any) => {
            await queue;
            await prisma.imageJob.update({
                where: { id: jobId },
                data: { status: 'FAILED', error: e?.message || 'Stream error' },
            });
            JobBus.publish(jobId, { type: 'error', message: e?.message || 'Stream error' });
            JobBus.publish(jobId, { type: 'status', status: 'FAILED' });
            JobBus.publish(jobId, { type: 'done' });
        });

        rsp.on('end', async () => {
            await queue; // ensure all pending writes finished
            const ok = emitted > 0;
            await prisma.imageJob.update({
                where: { id: jobId },
                data: { status: ok ? 'SUCCEEDED' : 'FAILED', error: ok ? null : 'No images emitted' },
            });
            JobBus.publish(jobId, { type: 'status', status: ok ? 'SUCCEEDED' : 'FAILED' });
            JobBus.publish(jobId, { type: 'done' });
        });

        await rsp.done();

    } catch (e: any) {
        await prisma.imageJob.update({
            where: { id: jobId },
            data: { status: 'FAILED', error: e?.message ?? 'Failed' },
        });
        JobBus.publish(jobId, { type: 'error', message: e?.message ?? 'Failed' });
        JobBus.publish(jobId, { type: 'status', status: 'FAILED' });
    }
}
