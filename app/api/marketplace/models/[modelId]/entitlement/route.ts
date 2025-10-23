import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ owned: false }, { status: 401 });

  // Determine if user owns (is the project owner) or has previously paid for this model
  try {
    // Fast path: check previous charge in ledger
    const prior = await prisma.creditLedger.findFirst({
      where: { userId, reason: 'download_charge', reference: `model_download:${modelId}` },
      select: { id: true },
    });
    if (prior) {
      return NextResponse.json({ owned: true });
    }
  } catch {}

  // Check ownership by scanning recent commits to map model -> project owner
  try {
    const commits = await prisma.commit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000,
      select: { id: true, projectId: true, snapshot: true },
    });
    let projectId: string | null = null;
    for (const c of commits) {
      const snap: any = c.snapshot ?? {};
      const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
      for (const m of models) {
        if (!m || typeof m !== 'object') continue;
        const id = String(m.id || '');
        if (id === modelId) {
          projectId = c.projectId;
          break;
        }
      }
      if (projectId) break;
    }
    if (projectId) {
      const proj = await prisma.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
      if (proj?.ownerId === userId) return NextResponse.json({ owned: true });
    }
  } catch {}

  return NextResponse.json({ owned: false });
}
