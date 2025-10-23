import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { addCredits, deductCredits } from '@/lib/credits';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

function pickObjUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.obj || undefined;
}

export async function POST(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Determine cost (DC = credits). Default to 750 if not set.
  const rawCost = process.env.DOWNLOAD_COST_DC || '750';
  let cost = 750;
  try { cost = Math.max(1, Math.floor(Number(rawCost))); } catch { cost = 750; }

  // Load recent commits and find the model by id, then its project + owner
  const commits = await prisma.commit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1500,
    select: { id: true, projectId: true, createdAt: true, snapshot: true },
  });

  let objUrl: string | undefined;
  let ownerId: string | null = null;
  let projectId: string | null = null;

  // Build project map lazily when needed
  const projectCache = new Map<string, { ownerId: string }>();

  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
    for (const m of models) {
      if (!m || typeof m !== 'object') continue;
      const id = String(m.id || '');
      if (id !== modelId) continue;
      const status = (m.status || '').toString().toUpperCase();
      const url = pickObjUrl(m.modelUrls);
      if (status !== 'SUCCEEDED' || !url) continue; // require OBJ
      objUrl = url;
      projectId = c.projectId;
      // load ownerId
      if (projectId) {
        let proj = projectCache.get(projectId);
        if (!proj) {
          const p = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
          if (p) {
            proj = { ownerId: p.ownerId };
            projectCache.set(projectId, proj);
          }
        }
        ownerId = proj?.ownerId || null;
      }
      break;
    }
    if (objUrl) break;
  }

  if (!objUrl) {
    // Either model not found or OBJ not available
    return NextResponse.json({ error: 'OBJ not available for this model' }, { status: 404 });
  }

  // If downloader is the owner, allow free download
  if (ownerId && ownerId === userId) {
    return NextResponse.json({ url: objUrl });
  }

  // If user has already paid for this model in the past, allow free re-download
  try {
    const prior = await prisma.creditLedger.findFirst({
      where: { userId, reason: 'download_charge', reference: `model_download:${modelId}` },
      select: { id: true },
    });
    if (prior) {
      return NextResponse.json({ url: objUrl });
    }
  } catch (e) {
    // non-fatal; fall through to charge path
  }

  // Check balance and perform charge + revenue share
  try {
    // Read current balance
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { creditsBalance: true } });
    const balance = me?.creditsBalance ?? new Prisma.Decimal(0);
    const need = new Prisma.Decimal(cost);
    if (balance.lt(need)) {
      return NextResponse.json({ error: 'Insufficient credits', required: cost, balance: Number(balance.toString()) }, { status: 402 });
    }

    const reference = `model_download:${modelId}`;
    // Perform ledger updates inside a transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Deduct full amount from downloader
      const dec = new Prisma.Decimal(cost);
      // Use underlying helpers but with the same client by re-implementing minimal logic here for atomicity
      // Read current balance
      const user = await tx.user.findUnique({ where: { id: userId }, select: { creditsBalance: true } });
      if (!user) throw new Error('user not found');
      const newBal = user.creditsBalance.minus(dec);
      if (newBal.lt(0)) throw new Error('insufficient credits');
      await tx.creditLedger.create({
        data: { userId, delta: dec.negated(), reason: 'download_charge', reference, balanceAfter: newBal },
      });
      await tx.user.update({ where: { id: userId }, data: { creditsBalance: newBal } });

      // Credit owner 50% (burn the rest)
      if (ownerId && ownerId !== userId) {
        const half = dec.dividedBy(2);
        const owner = await tx.user.findUnique({ where: { id: ownerId }, select: { creditsBalance: true } });
        if (owner) {
          const ownerNew = owner.creditsBalance.plus(half);
          await tx.creditLedger.create({
            data: { userId: ownerId, delta: half, reason: 'download_revenue_share', reference, balanceAfter: ownerNew },
          });
          await tx.user.update({ where: { id: ownerId }, data: { creditsBalance: ownerNew } });
        }
      }
    });
  } catch (e) {
    // If anything fails, return generic error
    console.error('Download charge failed', e);
    return NextResponse.json({ error: 'Could not process download' }, { status: 500 });
  }

  // Return the OBJ URL for client to download
  return NextResponse.json({ url: objUrl });
}
