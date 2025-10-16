// app/api/ai/images/stream/mock/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';

const enc = new TextEncoder();
const write = (c: ReadableStreamDefaultController<Uint8Array>, obj: unknown) =>
    c.enqueue(enc.encode(`data:${JSON.stringify(obj)}\n\n`));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

type EventNames = {
    partial: string;    // incremental images
    completed: string;  // final tool result-like bundle
    done: string;       // terminal "completed"
    error: string;      // error
};

const DEFAULT_EVENTS: EventNames = {
    partial: 'response.image_generation_call.partial_image',
    completed: 'tool_call.completed',
    done: 'response.completed',
    error: 'response.error',
};

/**
 * BIG_PNG_B64:
 * Valid PNG (128x128 solid gray). > 3KB so it passes collectors that require long base64 strings.
 */
const BIG_PNG_B64 =
    'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAA3NCSVQICAjb4U/gAAABa0lEQVR4nO3RQY7CMBRG4c9p8G2' +
    '8r6k0y2wS8dE2lTq9E3Aq6QvJkq1gQ3G6pQ6e6L7G9w8Xx8Xw7m0i7E7Oir7A9gqk1J8s+8kTQ0k5k2y7oO8hG6z0L2w0H9' +
    '1f0q6lS9a9l3X6uJmZ2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZm5v9QmJ8z3b8zq2cNwq9C1d9m9m+9p4w2w7FqvD' +
    'Qx9k5cT3d7c4a2f7c3Y3b2e2b1d1c0bza8Yy8o9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m' +
    '8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8m9m8nV8y9m8n/////8AAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA' +
    '//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//' +
    'AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DAAD//wMAAP//AwAA//8DANj3l0wA' +
    'AAAJcEhZcwAACxIAAAsSAdLdfvwAAABGSURBVHja7cEBDQAAAMKg909tDjegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
    'AAAAAAAAAAAAAAAAAAAAAPwG0mQAAa7AXP8AAAAASUVORK5CYII=';

/** Return an array of N base64 PNGs (we reuse BIG_PNG_B64 for simplicity) */
function makeBase64Batch(count: number): string[] {
    return Array.from({ length: count }, () => BIG_PNG_B64);
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));

    const prompt: string = String(body?.prompt ?? '');
    const refs: string[] = Array.isArray(body?.refs) ? body.refs.map(String) : [];
    const size: ImgSize = isSize(body?.size) ? body.size : '1024x1024';
    const n: number = Math.min(10, Math.max(1, Number.isFinite(+body?.n) ? Math.floor(+body.n) : 4));
    const imagesPerBatch: number = Math.min(
        5,
        Math.max(1, Number.isFinite(+body?.imagesPerBatch) ? Math.floor(+body.imagesPerBatch) : 2)
    );

    // fixed 5s between each step
    const delayMs = 300;

    const injectStatus: boolean = body?.injectStatus !== false;
    const failAtBatch: number | undefined = Number.isFinite(+body?.failAtBatch)
        ? Math.floor(+body.failAtBatch)
        : undefined;

    const ev: EventNames = {
        ...DEFAULT_EVENTS,
        ...(typeof body?.eventNames === 'object' && body.eventNames ? body.eventNames : {}),
    };

    const content = [
        ...refs.map((url) => ({ type: 'input_image', image_url: { url } })),
        {
            type: 'input_text',
            text: `${prompt || 'Create an image'} (Generate at ${size}; PNG output.)`,
        },
    ];

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                // 1) queued
                if (injectStatus) write(controller, { type: 'status', stage: 'queued' });
                await sleep(delayMs);

                // 2) response.created (echo input)
                write(controller, {
                    type: 'response.created',
                    response: { input: [{ role: 'user', content }], model: 'gpt-5', tool: 'image_generation' },
                });
                await sleep(delayMs);

                // 3) generating
                if (injectStatus) write(controller, { type: 'status', stage: 'generating' });
                await sleep(delayMs);

                // 4) partial batches
                let produced = 0;
                let batch = 0;

                while (produced < n) {
                    batch += 1;
                    if (failAtBatch && batch === failAtBatch) {
                        write(controller, { type: ev.error, error: { message: 'Mocked failure at batch ' + batch } });
                        await sleep(delayMs);
                        return;
                    }

                    const left = n - produced;
                    const emitNow = Math.min(imagesPerBatch, left);
                    const partial = makeBase64Batch(emitNow);

                    // OpenAI-like partial event:
                    const payload = {
                        type: ev.partial,
                        call_id: 'img_tool_call_' + batch,
                        result: {
                            images: partial.map((b64, i) => ({ image_base64: b64, index: produced + i })),
                        },
                    };
                    write(controller, payload);

                    // ✅ Compatibility frame so clients listening for `image_base64_batch` work unchanged
                    write(controller, {
                        type: 'image_base64_batch',
                        images: partial, // array of base64 strings
                        label: ev.partial,
                    });

                    produced += emitNow;
                    await sleep(delayMs);
                }

                // 5) completed bundle (OpenAI-like)
                const finalBundle = makeBase64Batch(n).map((b64, i) => ({ b64_json: b64, index: i }));
                write(controller, { type: ev.completed, result: finalBundle });

                // ✅ Compatibility final batch (optional, mirrors finalBundle)
                write(controller, {
                    type: 'image_base64_batch',
                    images: finalBundle.map((x) => x.b64_json),
                    label: ev.completed,
                });

                await sleep(delayMs);

                // 6) done
                write(controller, { type: ev.done });
            } catch (e: any) {
                write(controller, { type: ev.error, error: { message: e?.message || 'Unexpected error' } });
            } finally {
                try { controller.close(); } catch {}
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
}
