// app/api/ai/images/stream/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const DRY = process.env.AI_DRY_RUN === '1'; // set to '1' to skip OpenAI costs while testing refs
const VERBOSE = process.env.AI_VERBOSE_LOG === '1'; // extra noisy logging toggle

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

const enc = new TextEncoder();
const send = (c: ReadableStreamDefaultController<Uint8Array>, payload: unknown) =>
    c.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`));

const isHttpUrl = (u: unknown): u is string =>
    typeof u === 'string' && /^https?:\/\//i.test(u);

// --- robust base64 extraction (future-proof)
const BASE64_RE = /^[A-Za-z0-9+/=\r\n]+$/;
function collectBase64Candidates(node: any, out: string[], depth = 0) {
    if (!node || depth > 7) return;

    if (typeof node === 'string') {
        const s = node.trim();
        // data: URLs
        if (s.startsWith('data:image/') && s.includes(';base64,')) {
            const b64 = s.split(',')[1] || '';
            if (b64.length > 80 && BASE64_RE.test(b64)) out.push(b64);
            return;
        }
        // raw base64
        if (s.length > 80 && BASE64_RE.test(s)) out.push(s);
        return;
    }

    if (Array.isArray(node)) {
        for (const it of node) collectBase64Candidates(it, out, depth + 1);
        return;
    }

    if (typeof node === 'object') {
        const preferred = [
            'image_base64', 'image_b64', 'b64', 'b64_json', 'data',
            'result', 'results', 'images', 'image', 'output', 'content',
        ];
        for (const k of Object.keys(node)) {
            if (preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
        }
        for (const k of Object.keys(node)) {
            if (!preferred.includes(k)) collectBase64Candidates((node as any)[k], out, depth + 1);
        }
    }
}

// pretty size
const sizeOf = (obj: unknown) => {
    try { return JSON.stringify(obj).length; } catch { return -1; }
};

export async function POST(req: NextRequest) {
    const reqId = Math.random().toString(36).slice(2, 10);
    const startedAt = Date.now();
    const t = () => `${(Date.now() - startedAt).toString().padStart(4, ' ') }ms`;

    const log = (...args: any[]) => console.log(`[AI/STREAM ${reqId}]`, ...args);
    const warn = (...args: any[]) => console.warn(`[AI/STREAM ${reqId}]`, ...args);
    const err = (...args: any[]) => console.error(`[AI/STREAM ${reqId}]`, ...args);

    try {
        const body = await req.json().catch(() => ({}));
        const prompt: string = (body?.prompt ?? '').toString();
        const refsInput: unknown = body?.refs;
        const refs = Array.isArray(refsInput) ? refsInput : [];
        const httpRefs = refs.filter(isHttpUrl) as string[];

        const size: ImgSize = isImgSize(body?.size) ? body.size : '1024x1024';
        const nRaw = Number(body?.n ?? 1);
        const n = Number.isFinite(nRaw) && nRaw > 0 ? Math.min(10, Math.floor(nRaw)) : 1;

        if (!process.env.OPENAI_API_KEY && !DRY) {
            err('Missing OPENAI_API_KEY');
            return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
                status: 500, headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!prompt && httpRefs.length === 0) {
            warn('Neither prompt nor http refs provided.');
            return new Response(JSON.stringify({
                error: 'Provide a prompt or at least one HTTP(S) reference image.',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if ((refs as unknown[]).length > 0 && httpRefs.length === 0) {
            warn('Refs provided, but none were HTTP(S).');
            return new Response(JSON.stringify({
                error: 'All provided refs are non-HTTP(S). Upload images first to obtain public URLs.',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Construct content for Responses API (text + optional input_image blocks)
        const instruction =
            (prompt || 'Create an image inspired by the references.') +
            ` (Generate at ${size}; PNG output.)`;

        const baseContent: any[] = [
            ...httpRefs.map((url) => ({ type: 'input_image', image_url: { url } })),
            { type: 'input_text', text: instruction },
        ];

        log(t(), 'BEGIN', { refs: httpRefs.length, promptLen: instruction.length, n, size, DRY });

        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                let closed = false;
                let emitted = 0;
                let eventCount = 0;

                const safeSend = (payload: unknown) => {
                    if (closed) return;
                    try { controller.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`)); }
                    catch { closed = true; }
                };
                const safeClose = () => {
                    if (closed) return;
                    closed = true;
                    try { controller.close(); } catch {}
                };
                const onAbort = () => {
                    warn(t(), 'Client aborted.');
                    safeClose();
                };

                if (req.signal) {
                    if (req.signal.aborted) onAbort();
                    else req.signal.addEventListener('abort', onAbort);
                }

                // Initial status + debug
                safeSend({ type: 'status', stage: 'queued' });
                safeSend({ type: 'debug', stage: 'queued', reqId, now: Date.now(), n, size, refsCount: httpRefs.length });

                const emitImages = (arr: unknown, label = 'unknown') => {
                    const tmp: string[] = [];
                    collectBase64Candidates(arr, tmp);
                    if (tmp.length) {
                        emitted += tmp.length;
                        log(t(), `EMIT ${tmp.length} img(s) from [${label}] — total=${emitted}`);
                        safeSend({ type: 'image_base64_batch', images: tmp, label });
                    } else if (VERBOSE) {
                        log(t(), `NO-IMG in [${label}]`);
                    }
                    return tmp.length;
                };

                try {
                    if (DRY) {
                        // dev shim
                        log(t(), 'DRY mode: sending a tiny 1×1 PNG base64 and finishing.');
                        safeSend({ type: 'status', stage: 'generating' });
                        safeSend({
                            type: 'image_base64_batch',
                            images: [
                                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottwAAAABJRU5ErkJggg=='
                            ],
                            label: 'dry-run'
                        });
                        emitted += 1;
                        safeSend({ type: 'debug_summary', emitted, eventCount });
                        safeSend({ type: 'done' });
                        safeClose();
                        return;
                    }

                    // return
                    // Real streaming call (event API)
                    const rsp = await openai.responses.stream({
                        model: 'gpt-5',
                        input: [{ role: 'user', content: baseContent }],
                        tools: [{ type: 'image_generation' }],
                        tool_choice: 'required',
                    });

                    safeSend({ type: 'status', stage: 'generating' });

                    rsp.on('event', (ev: any) => {
                        eventCount++;
                        // Small preview to avoid logging megabytes
                        let preview = '';
                        try { preview = JSON.stringify(ev).slice(0, 500); } catch {}

                        const evType = ev?.type ?? 'unknown';
                        const evSize = sizeOf(ev);
                        if (VERBOSE) log(t(), `EVENT #${eventCount} ${evType} (${evSize} bytes)`);

                        // Push a debug event to client so you can see the stream shape live
                        safeSend({ type: 'debug_event', idx: eventCount, evType, evSize, preview });

                        switch (evType) {
                            case 'response.image_generation_call.partial_image': {
                                emitImages(ev, evType);
                                break;
                            }
                            case 'tool_call.completed': {
                                emitImages(ev.result, evType);
                                break;
                            }
                            case 'response.completed': {
                                // Sometimes the last event might contain images elsewhere
                                const before = emitted;
                                emitImages(ev, `${evType}.self`);
                                if (ev?.response) emitImages(ev.response, `${evType}.response`);
                                if (ev?.response?.output) emitImages(ev.response.output, `${evType}.response.output`);
                                if (VERBOSE) log(t(), `COMPLETED: emitted += ${emitted - before}`);
                                break;
                            }
                            case 'response.error': {
                                warn(t(), 'RESPONSE ERROR', ev?.error?.message);
                                safeSend({ type: 'error', message: ev?.error?.message || 'Generation failed' });
                                break;
                            }
                            default: {
                                // Catch-all for future shapes
                                emitImages(ev, evType);
                                break;
                            }
                        }
                    });

                    rsp.on('error', (e: any) => {
                        err(t(), 'STREAM ERROR', e?.message);
                        safeSend({ type: 'error', message: e?.message || 'Stream error' });
                    });

                    rsp.on('end', () => {
                        log(t(), `END: events=${eventCount}, emitted=${emitted}`);
                        safeSend({ type: 'debug_summary', emitted, eventCount });
                        if (emitted === 0) safeSend({ type: 'no_image' });
                        safeSend({ type: 'done' });
                        safeClose();
                    });

                    // Keep handler alive until completion
                    await rsp.done();

                } catch (e: any) {
                    err(t(), 'EXCEPTION', e?.message);
                    safeSend({ type: 'error', message: e?.message || 'Unexpected error' });
                    safeSend({ type: 'debug_summary', emitted, eventCount, error: e?.message || 'Unexpected error' });
                    safeClose();
                } finally {
                    if (req.signal) req.signal.removeEventListener('abort', onAbort);
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
        console.error('[AI/ROUTE FATAL]', e?.message);
        return new Response(JSON.stringify({ error: e?.message || 'Invalid request' }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
}
