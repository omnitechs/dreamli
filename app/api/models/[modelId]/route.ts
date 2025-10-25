import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  if (!modelId) return NextResponse.json({ error: 'modelId required' }, { status: 400 });

  try {
    const commits = await prisma.commit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2000,
      select: { id: true, projectId: true, createdAt: true, snapshot: true },
    });

    for (const c of commits) {
      const snap: any = c.snapshot ?? {};
      const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
      for (const m of models) {
        if (!m || typeof m !== 'object') continue;
        const id = String(m.id || '');
        if (id !== modelId) continue;
        const payload = {
          id: m.id,
          taskId: m.taskId || null,
          provider: m.provider || null,
          kind: m.kind || null,
          prompt: m.prompt || '',
          thumbnailUrl: m.thumbnailUrl || (Array.isArray(m.imageUrls) ? m.imageUrls[0] : null) || null,
          previewVideoUrl: m.previewVideoUrl || null,
          modelUrls: m.modelUrls || {},
          createdAt: m.createdAt || c.createdAt,
          projectId: c.projectId,
          commitId: c.id,
          status: m.status || 'SUCCEEDED',
        };
        return NextResponse.json(payload);
      }
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('GET /api/models/[modelId] failed', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
