export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobBus } from '@/app/(lang)/[lang]/ai/services/jobBus';
import { runImageJob } from '@/app/(lang)/[lang]/ai/services/runImageJob';

const enc = new TextEncoder();
const send = (c: ReadableStreamDefaultController<Uint8Array>, payload: unknown) =>
    c.enqueue(enc.encode(`data:${JSON.stringify(payload)}\n\n`));

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
    const { jobId } = await params;

    // ✅ Try to atomically claim the job (QUEUED → RUNNING) so only one connection starts it
    const claimed = await prisma.imageJob.updateMany({
        where: { id: jobId, status: 'QUEUED' },
        data: { status: 'RUNNING' },
    });
    if (claimed.count === 1) {
        // only the winner starts the runner (do not await)
        runImageJob(jobId).catch(() => {});
    }

    // Get current status after the claim attempt
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
            // 1) replay history so refresh shows everything already produced
            send(controller, { type: 'status', status: job.status });
            for (const c of past) {
                send(controller, {
                    type: 'image',
                    index: c.index,
                    base64: c.base64 ?? undefined,
                    url: c.url ?? undefined,
                });
            }

            // If terminal, end stream
            if (job.status === 'SUCCEEDED' || job.status === 'FAILED' || job.status === 'CANCELED') {
                send(controller, { type: 'done' });
                try { controller.close(); } catch {}
                return;
            }

            // 2) subscribe to live bus
            const unsubscribe = JobBus.subscribe(jobId, (ev) => {
                try { send(controller, ev); } catch {}
            });

            // 3) heartbeat + auto-timeout
            const heartbeat = setInterval(() => {
                try { send(controller, { type: 'heartbeat' }); } catch {}
            }, 25_000);

            const kill = setTimeout(() => {
                try { send(controller, { type: 'done' }); } catch {}
                try { controller.close(); } catch {}
                clearInterval(heartbeat);
                unsubscribe();
            }, 30 * 60 * 1000); // 30 minutes

            (controller as any)._cleanup = () => {
                clearInterval(heartbeat);
                clearTimeout(kill);
                unsubscribe();
            };
        },
        cancel() {
            // client disconnected
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
