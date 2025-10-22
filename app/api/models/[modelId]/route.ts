import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Params = { modelId: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> }) {
  const { modelId } = await ctx.params;
  if (!modelId) return NextResponse.json({ error: 'MODEL_ID_REQUIRED' }, { status: 400 });

  // Best-effort: scan recent commits to find the model by id
  const commits = await prisma.commit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1000,
    select: { id: true, projectId: true, createdAt: true, snapshot: true },
  });

  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
    const m = models.find((mm: any) => mm && typeof mm === 'object' && mm.id === modelId);
    if (m) {
      // Fetch project name for better routing/SEO context
      const proj = await prisma.project.findUnique({ where: { id: c.projectId }, select: { name: true } });
      // Return the model plus some context
      return NextResponse.json({
        ...m,
        commitId: c.id,
        projectId: c.projectId,
        projectName: proj?.name || null,
        createdAt: m.createdAt || c.createdAt,
      });
    }
  }

  return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
}
