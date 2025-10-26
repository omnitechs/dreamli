import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { deductCredits } from '@/lib/credits';
import { estimateOpenAiImageCredits } from '@/lib/ai/pricing';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';
const isImgSize = (s: any): s is ImgSize =>
    s === '512x512' || s === '1024x1024' || s === '2048x2048';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json().catch(() => ({}));
    const prompt: string = String(body?.prompt ?? '');
    const size: ImgSize = isImgSize(body?.size) ? body.size : '1024x1024';
    const nRaw = Number(body?.n ?? 1);
    const n = Number.isFinite(nRaw) && nRaw > 0 ? Math.min(10, Math.floor(nRaw)) : 1;
    const refsInput = Array.isArray(body?.refs) ? body.refs : [];
    const httpRefs = refsInput.filter((u: any) => typeof u === 'string' && /^https?:\/\//i.test(u));

    if (!prompt && httpRefs.length === 0) {
        return new Response(JSON.stringify({ error: 'Provide a prompt or at least one HTTP(S) ref' }), { status: 400 });
    }

    // Reserve credits upfront (flat per image by size)
    const estimated = estimateOpenAiImageCredits(size, n);
    const idBaseRaw = `${userId}:${prompt}:${httpRefs.join(',')}:${size}:${n}`;
    const idData = new TextEncoder().encode(idBaseRaw);
    const idHashBuf = await crypto.subtle.digest('SHA-256', idData);
    const idHash = Array.from(new Uint8Array(idHashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const reserveKey = `img-reserve:${idHash}`;
    try {
        await deductCredits({ userId, amount: estimated, reason: `openai:image:${size}:reserve`, idempotencyKey: reserveKey, reference: idHash, details: { kind: 'image_reserve', prompt, size, n, refs: httpRefs, reserveId: idHash } as any });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'INSUFFICIENT_CREDITS' }), { status: 402 });
    }

    const job = await prisma.imageJob.create({
        data: { prompt, size, n, status: 'QUEUED', refs: { urls: httpRefs, reserve: { idHash, estimated, size, n, userId } } as any },
        select: { id: true, n: true },
    });

    // Link the ledger reserve entry with this job for history previews
    try {
        await prisma.creditLedger.update({
            where: { idempotencyKey: reserveKey },
            data: { details: { kind: 'image_reserve', prompt, size, n, refs: httpRefs, reserveId: idHash, jobId: job.id } as any },
        });
    } catch {}

    const placeholderIds = Array.from({ length: job.n }, (_, i) => `${job.id}__ph__${i}`);

    return new Response(JSON.stringify({ jobId: job.id, placeholderIds }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
