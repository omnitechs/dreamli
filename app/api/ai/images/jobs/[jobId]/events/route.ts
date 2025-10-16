// app/api/ai/images/jobs/[jobId]/events/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobBus } from '@/app/(lang)/[lang]/ai/services/jobBus';

const enc = new TextEncoder();
const send = (c: ReadableStreamDefaultController<Uint8Array>, payload: unknown) =>
    c.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`));

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
    const { jobId } = await params;

    // 1) Fetch job + all previously emitted chunks for *replay*
    const job = await prisma.imageJob.findUnique({
        where: { id: jobId },
        select: { id: true, status: true, emitted: true },
    });
    if (!job) return new Response('Not found', { status: 404 });

    const past = await prisma.imageChunk.findMany({
        where: { jobId },
        orderBy: { index: 'asc' },
        select: { index: true, base64: true, url: true },
    });

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            // 2) First: replay history so refresh shows *everything already produced*
            //    (UI expects `type: 'image'` frames)
            send(controller, { type: 'status', status: job.status });
            for (const c of past) {
                send(controller, { type: 'image', index: c.index, base64: c.base64 ?? undefined, url: c.url ?? undefined });
            }

            // If job already finished, end stream.
            if (job.status === 'SUCCEEDED' || job.status === 'FAILED' || job.status === 'CANCELED') {
                send(controller, { type: 'done' });
                try { controller.close(); } catch {}
                return;
            }

            // 3) Subscribe to *live* events for anything that comes after we attached
            const unsubscribe = JobBus.subscribe(jobId, (ev) => {
                try { send(controller, ev); } catch {}
            });

            // 4) Keep the SSE alive with a heartbeat; also auto-timeout
            const heartbeat = setInterval(() => {
                try { send(controller, { type: 'heartbeat' }); } catch {}
            }, 25_000);

            const kill = setTimeout(() => {
                try { send(controller, { type: 'done' }); } catch {}
                try { controller.close(); } catch {}
                clearInterval(heartbeat);
                unsubscribe();
            }, 30 * 60 * 1000); // 30 minutes cap

            // Cleanup on client disconnect
            (controller as any)._cleanup = () => {
                clearInterval(heartbeat);
                clearTimeout(kill);
                unsubscribe();
            };
        },
        cancel() {
            // Client went away; nothing special here.
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
