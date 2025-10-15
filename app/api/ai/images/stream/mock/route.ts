// app/api/ai/images/stream/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';

// ---- config / types ----
type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

const enc = new TextEncoder();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isHttpUrl = (u: unknown): u is string =>
    typeof u === 'string' && /^https?:\/\//i.test(u);

// A few tiny 1x1 PNGs (valid base64). Different values so thumbnails aren't identical.
const PNGS = [
    // white
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotWQAAAABJRU5ErkJggg==',
    // red (1x1)
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAADUlEQVR4nGP4z8AIAAEBAQAT5m5QAAAAAElFTkSuQmCC',
    // black-ish variation (just a different byte so you see change)
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotWQAAAACJRU5ErkJggg==',
    // gray-ish
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAADUlEQVR4nGMAAQAABQABDQotWQAAAABJRU5ErkJggg==',
];

// ---- robust base64 extraction (kept for parity with your code) ----
const BASE64_RE = /^[A-Za-z0-9+/=\r\n]+$/;
function collectBase64Candidates(node: any, out: string[], depth = 0) {
    if (!node || depth > 6) return;
    if (typeof node === 'string') {
        if (node.length > 1000 && BASE64_RE.test(node)) out.push(node);
        return;
    }
    if (Array.isArray(node)) {
        for (const item of node) collectBase64Candidates(item, out, depth + 1);
        return;
    }
    if (typeof node === 'object') {
        const preferredKeys = [
            'image_base64', 'image_b64', 'b64', 'b64_json', 'data',
            'result', 'results', 'images', 'image', 'output', 'content',
        ];
        for (const k of Object.keys(node)) {
            if (preferredKeys.includes(k)) collectBase64Candidates(node[k], out, depth + 1);
        }
        for (const k of Object.keys(node)) {
            if (!preferredKeys.includes(k)) collectBase64Candidates(node[k], out, depth + 1);
        }
    }
}

// small util
function clampInt(n: unknown, min: number, max: number, fallback: number) {
    const v = Math.floor(Number(n));
    if (!Number.isFinite(v)) return fallback;
    return Math.max(min, Math.min(max, v));
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const prompt: string = (body?.prompt ?? '').toString();
        const refsInput: unknown = body?.refs;
        const refs = Array.isArray(refsInput) ? refsInput : [];
        const httpRefs = refs.filter(isHttpUrl) as string[];

        const size: ImgSize = isImgSize(body?.size) ? body.size : '1024x1024';
        const n = clampInt(body?.n ?? 1, 1, 10, 1);

        // Mock tuning knobs (optional in body)
        const delayMs       = clampInt(body?.delayMs ?? 2500, 0, 10_000, 2500);  // delay between batches
        const imagesPerBatch= clampInt(body?.imagesPerBatch ?? 1, 1, 4, 1);     // images per emitted batch
        const echoRefs      = body?.echoRefs !== false;                         // default true
        const injectStatus  = body?.injectStatus !== false;                     // default true
        const failAtBatch   = clampInt(body?.failAtBatch ?? 0, 0, 10_000, 0);   // 0 = never fail

        if (!prompt && httpRefs.length === 0) {
            return new Response(JSON.stringify({
                error: 'Provide a prompt or at least one HTTP(S) reference image.',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const totalBatches = Math.ceil(n / imagesPerBatch);

        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                let closed = false;

                const safeSend = (payload: unknown) => {
                    if (closed) return;
                    try {
                        controller.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`));
                    } catch {
                        closed = true;
                    }
                };
                const safeClose = () => {
                    if (closed) return;
                    closed = true;
                    try { controller.close(); } catch {}
                };
                const onAbort = () => safeClose();

                // Handle client disconnects (refresh / nav)
                if (req.signal) {
                    if (req.signal.aborted) onAbort();
                    else req.signal.addEventListener('abort', onAbort);
                }

                try {
                    // ---- STREAM SEQUENCE (mocking OpenAI) ----
                    if (injectStatus) safeSend({ type: 'status', stage: 'queued' });
                    await sleep(60);

                    if (echoRefs) {
                        safeSend({ type: 'echo_refs', refs: httpRefs, size, prompt });
                    }

                    if (injectStatus) safeSend({ type: 'status', stage: 'generating', total: totalBatches });

                    let emitted = 0;
                    for (let batch = 1; batch <= totalBatches; batch++) {
                        if (closed) break;

                        // optional failure injection
                        if (failAtBatch > 0 && batch === failAtBatch) {
                            safeSend({ type: 'error', message: 'Mock failure at requested batch.', batch, total: totalBatches });
                            break;
                        }

                        // build batch images
                        const count = Math.min(imagesPerBatch, n - emitted);
                        const images: string[] = Array.from({ length: count }, (_, i) => {
                            const pick = (emitted + i) % PNGS.length;
                            return PNGS[pick];
                        });

                        safeSend({ type: 'image_base64_batch', images, batch, total: totalBatches });
                        emitted += count;

                        if (batch < totalBatches) await sleep(delayMs);
                    }

                    if (injectStatus) safeSend({ type: 'status', stage: 'done' });
                    safeSend({ type: 'done' });
                } catch (e: any) {
                    safeSend({ type: 'error', message: e?.message || 'Mock stream error' });
                } finally {
                    if (req.signal) req.signal.removeEventListener('abort', onAbort);
                    safeClose();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive',
            },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message || 'Invalid request' }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
}
