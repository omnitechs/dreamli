import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const prompt: string = String(body?.prompt ?? '');
    const size: ImgSize = isImgSize(body?.size) ? body.size : '1024x1024';
    const nRaw = Number(body?.n ?? 1);
    const n = Number.isFinite(nRaw) && nRaw > 0 ? Math.min(10, Math.floor(nRaw)) : 1;
    const refs = Array.isArray(body?.refs) ? body.refs : [];

    if (!prompt && refs.length === 0) {
        return new Response(JSON.stringify({ error: 'Provide a prompt or refs' }), { status: 400 });
    }

    const job = await prisma.imageJob.create({
        data: { prompt, size, n, status: 'QUEUED', refs },
        select: { id: true, n: true },
    });

    // ❌ do NOT start here (Vercel may kill background)
    // runImageJob(job.id).catch(() => {});

    const placeholderIds = Array.from({ length: job.n }, (_, i) => `${job.id}__ph__${i}`);

    return new Response(JSON.stringify({ jobId: job.id, placeholderIds }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
