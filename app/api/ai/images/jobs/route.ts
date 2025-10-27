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
    const reqId = Math.random().toString(36).slice(2, 10);
    const startedAt = Date.now();
    const t = () => `${(Date.now() - startedAt).toString().padStart(4, ' ')}ms`;
    const log = (...args: any[]) => console.log(`[IMG/JOBS ${reqId}]`, ...args);
    const warn = (...args: any[]) => console.warn(`[IMG/JOBS ${reqId}]`, ...args);
    const err = (...args: any[]) => console.error(`[IMG/JOBS ${reqId}]`, ...args);
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

    log('REQ', { promptLen: prompt.length, size, n, refsCount: httpRefs.length });

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
    log('JOB_CREATED', { jobId: job.id, n: job.n });

    // Link the ledger reserve entry with this job for history previews
    try {
        await prisma.creditLedger.update({
            where: { idempotencyKey: reserveKey },
            data: { details: { kind: 'image_reserve', prompt, size, n, refs: httpRefs, reserveId: idHash, jobId: job.id } as any },
        });
        log('LEDGER_LINKED', { reserveKey, jobId: job.id });
    } catch (e:any) {
        warn('LEDGER_LINK_FAIL', String(e?.message || e));
    }

    const placeholderIds = Array.from({ length: job.n }, (_, i) => `${job.id}__ph__${i}`);
    log('PLACEHOLDERS', { jobId: job.id, count: placeholderIds.length });

    return new Response(JSON.stringify({ jobId: job.id, placeholderIds }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
