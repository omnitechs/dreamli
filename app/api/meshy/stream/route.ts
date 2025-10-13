// app/api/meshy/stream/route.ts
import { NextRequest } from 'next/server';
export const runtime = 'nodejs';

function sseEncode(obj: unknown) {
    return `data: ${JSON.stringify(obj)}\n\n`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const kind = searchParams.get('kind') || 'text';
    if (!id) return new Response('Missing id', { status: 400 });

    // Build reliable absolute URL to task endpoint (dev/prod safe)
    const taskUrl = new URL('/api/meshy/task', req.url);
    taskUrl.searchParams.set('id', id);
    taskUrl.searchParams.set('kind', kind);

    const stream = new ReadableStream({
        async start(controller) {
            const enc = new TextEncoder();
            let alive = true;
            let lastEmit = Date.now();

            // EventSource retry suggestion (2s)
            controller.enqueue(enc.encode(`retry: 2000\n\n`));

            // Heartbeat to keep proxies from closing
            const hb = setInterval(() => {
                try { controller.enqueue(enc.encode(`: ping ${Date.now()}\n\n`)); } catch {}
            }, 15000);

            req.signal.addEventListener('abort', () => {
                alive = false; clearInterval(hb);
                try { controller.close(); } catch {}
            });

            try {
                while (alive) {
                    // Always no-store
                    const res = await fetch(taskUrl, { signal: req.signal, cache: 'no-store' });
                    if (!res.ok) {
                        controller.enqueue(enc.encode(sseEncode({ status: 'FAILED', error: `task ${res.status}` })));
                        break;
                    }

                    const data = await res.json().catch(() => ({}));
                    controller.enqueue(enc.encode(sseEncode(data)));
                    lastEmit = Date.now();

                    const status = String(data?.status ?? '').toUpperCase();
                    if (status === 'SUCCEEDED' || status === 'FAILED' || status === 'CANCELED') break;

                    await new Promise(r => setTimeout(r, 1500));
                }
            } catch {
                controller.enqueue(enc.encode(sseEncode({ status: 'FAILED', error: 'stream-exception' })));
            } finally {
                clearInterval(hb);
                try { controller.close(); } catch {}
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
