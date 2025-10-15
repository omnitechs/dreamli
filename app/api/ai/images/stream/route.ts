// app/api/ai/images/stream/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const DRY = process.env.AI_DRY_RUN === '1'; // set to '1' to skip OpenAI costs while testing refs

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

const enc = new TextEncoder();
const send = (c: ReadableStreamDefaultController<Uint8Array>, payload: unknown) =>
    c.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`));

const isHttpUrl = (u: unknown): u is string =>
    typeof u === 'string' && /^https?:\/\//i.test(u);

// --- robust base64 extraction (future-proof) -------------------------------
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

export async function POST(req: NextRequest) {
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
            return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
                status: 500, headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!prompt && httpRefs.length === 0) {
            return new Response(JSON.stringify({
                error: 'Provide a prompt or at least one HTTP(S) reference image.',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        if ((refs as unknown[]).length > 0 && httpRefs.length === 0) {
            return new Response(JSON.stringify({
                error: 'All provided refs are non-HTTP(S). Upload images first to obtain public URLs.',
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const instruction =
            (prompt || 'Create an image inspired by the references.') +
            ` (Generate at ${size}; PNG output.)`;

        // const baseContent: any[] = [
        //     ...httpRefs.map((url) => ({ type: 'input_image', image_url: { url } })),
        //     { type: 'input_text', text: instruction },
        // ];
        const baseContent: any[] = [

            { type: 'input_text', text: instruction },
        ];

        console.log('[AI/ROUTE] POST /stream ->',
            { promptLen: instruction.length, refsCount: httpRefs.length, size, n });
        console.log('[AI/ROUTE] BODY refs:', refs);
        console.log('[AI/ROUTE] HTTP refs:', httpRefs);

        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                // close/abort-aware writer
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

                // respect client disconnects (refresh/nav)
                if (req.signal) {
                    if (req.signal.aborted) onAbort();
                    else req.signal.addEventListener('abort', onAbort);
                }

                safeSend({ type: 'status', stage: 'queued' });

                const emitImages = (arr: unknown, label = 'unknown') => {
                    if (closed) return 0;
                    const tmp: string[] = [];
                    collectBase64Candidates(arr, tmp);
                    if (tmp.length) {
                        safeSend({ type: 'image_base64_batch', images: tmp, label });
                        return tmp.length;
                    }
                    return 0;
                };

                const runOnce = async (index: number) => {
                    if (closed) return;

                    if (DRY) {
                        safeSend({ type: 'echo_refs', refs: httpRefs, index });
                        await new Promise((r) => setTimeout(r, 300));
                        return;
                    }

                    return new Promise((r) => setTimeout(r, 5000));

                    const rsp = await fetch("/api/ai/images/stream/mock", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt,
                            refs,            // optional
                            size: "1024x1024",
                            n: 5,            // total images you want
                            imagesPerBatch: 2,   // how many per SSE frame
                            delayMs: 250,        // spacing between frames
                            echoRefs: true,
                            injectStatus: true,
                            // failAtBatch: 2,   // uncomment to test error handling
                        }),
                    });
                    // // Real streaming call (your original call)
                    // const rsp = await openai.responses.create({
                    //     model: 'gpt-5',
                    //     input: [{ role: 'user', content: baseContent }],
                    //     tools: [{ type: 'image_generation' }],
                    //     tool_choice: 'required',
                    //     stream: true,
                    // });

                    let emitted = 0;
                    for await (const ev of rsp as any) {
                        if (closed) break;
                        const t = ev?.type as string | undefined;
                        if (!t) continue;

                        switch (t) {
                            case 'response.image_generation_call.partial_image':
                                emitted += emitImages(ev, t);
                                break;
                            case 'tool_call.completed':
                                emitted += emitImages(ev.result, t);
                                break;
                            case 'response.completed':
                                if (emitted === 0) {
                                    emitted += emitImages(ev, t + '.self');
                                    if (ev?.response) emitted += emitImages(ev.response, t + '.response');
                                    if (ev?.response?.output) emitted += emitImages(ev.response.output, t + '.response.output');
                                }
                                break;
                            case 'response.error':
                                safeSend({ type: 'error', message: ev?.error?.message || 'Generation failed' });
                                break;
                            default:
                                emitted += emitImages(ev, t);
                                break;
                        }
                    }

                    if (!closed && emitted === 0) {
                        safeSend({ type: 'no_image', index, total: n });
                    }
                };

                try {
                    for (let i = 1; i <= n; i++) {
                        if (closed) break;
                        await runOnce(i);
                    }
                    if (!closed) safeSend({ type: 'done' });
                } catch (e: any) {
                    if (!closed) safeSend({ type: 'error', message: e?.message || 'Unexpected error' });
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
        console.error('[AI/ROUTE] 400', e?.message);
        return new Response(JSON.stringify({ error: e?.message || 'Invalid request' }), {
            status: 400, headers: { 'Content-Type': 'application/json' },
        });
    }
}
