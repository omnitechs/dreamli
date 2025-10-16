// app/api/ai/images/jobs/[jobId]/route.ts
import { prisma } from '@/lib/prisma';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { jobId: string } }) {
    const job = await prisma.imageJob.findUnique({
        where: { id: params.jobId },
        include: { chunks: { orderBy: { index: 'asc' } } },
    });
    if (!job) return new Response('Not found', { status: 404 });
    return Response.json(job);
}

export async function DELETE(_: Request, { params }: { params: { jobId: string } }) {
    // mark canceled; your runner should periodically check and stop early
    await prisma.imageJob.update({ where: { id: params.jobId }, data: { status: 'CANCELED' } });
    return Response.json({ ok: true });
}
