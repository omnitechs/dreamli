// app/api/ai/images/jobs/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runImageJob } from '@/app/(lang)/[lang]/ai/services/runImageJob';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// const normalizeRefs = (x: unknown): string[] => {
//     if (!Array.isArray(x)) return [];
//     return x
//         .map(String)
//         .map(s => s.trim())
//         .filter(s => /^https?:\/\//i.test(s))            // avoid data: URLs / junk
//         .slice(0, 16); // safety cap
// };

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    console.log(body)
    const prompt: string = String(body?.prompt ?? '');
    const size: ImgSize = isImgSize(body?.size) ? body.size : '1024x1024';
    const nRaw = Number(body?.n ?? 1);
    const n = Number.isFinite(nRaw) && nRaw > 0 ? Math.min(10, Math.floor(nRaw)) : 1;
    const refs = body?.refs;
    if (!prompt && (!Array.isArray(body?.refs) || body.refs.length === 0)) {
        return new Response(JSON.stringify({ error: 'Provide a prompt or refs' }), { status: 400 });
    }
    console.log("refs in jobs.route",refs)
    // Persist job (you can also store refs here if you want to upload/verify first)
    const job = await prisma.imageJob.create({
        data: { prompt, size, n, status: 'QUEUED' ,refs},
        select: { id: true, n: true },
    });

    // Start async runner (don’t wait)
    runImageJob(job.id).catch(() => {});

    // create placeholder ids on the client deterministically if you prefer,
    // or return them now:
    const placeholderIds = Array.from({ length: job.n }, (_, i) => `${job.id}__ph__${i}`);

    return new Response(JSON.stringify({ jobId: job.id, placeholderIds }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
