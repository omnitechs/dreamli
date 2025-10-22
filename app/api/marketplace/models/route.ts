import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export async function GET(req: Request) {
  // Pagination params
  const url = new URL(req.url);
  const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = 10; // fixed per requirement

  // Public endpoint: list recent 3D models across all users (marketplace)
  // Minimal, best-effort approach: scan latest commits and extract models with downloadable URLs
  const commits = await prisma.commit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1500, // scan enough to build several pages of unique items without stressing DB
    select: {
      id: true,
      projectId: true,
      createdAt: true,
      snapshot: true,
    },
  });

  // We also need project owner info
  const projectIds = Array.from(new Set(commits.map(c => c.projectId)));
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, ownerId: true, name: true },
  });
  const projectById = new Map(projects.map(p => [p.id, p]));

  const ownerIds = Array.from(new Set(projects.map(p => p.ownerId)));
  const users = await prisma.user.findMany({
    where: { id: { in: ownerIds } },
    select: { id: true, name: true, image: true },
  });
  const userById = new Map(users.map(u => [u.id, u]));

  type AnyModel = any;
  const itemsMap = new Map<string, any>(); // dedupe by model id

  for (const c of commits) {
    // snapshot is arbitrary JSON; expect generator snapshot with models array
    const snap: any = c.snapshot ?? {};
    const models: AnyModel[] = Array.isArray(snap?.models) ? snap.models : [];
    for (const m of models) {
      if (!m || typeof m !== 'object') continue;
      const status = (m.status || '').toString().toUpperCase();
      const bestUrl = pickBestModelUrl(m.modelUrls);
      if (status !== 'SUCCEEDED' || !bestUrl) continue; // only finished 3D models
      const id = String(m.id || '');
      if (!id || itemsMap.has(id)) continue; // dedupe

      const proj = projectById.get(c.projectId);
      const owner = proj ? userById.get(proj.ownerId) : undefined;

      itemsMap.set(id, {
        id: m.id,
        taskId: m.taskId,
        provider: m.provider,
        kind: m.kind,
        prompt: m.prompt || '',
        thumbnailUrl: m.thumbnailUrl || m?.imageUrls?.[0] || null,
        previewVideoUrl: m.previewVideoUrl || null,
        modelUrls: m.modelUrls || {},
        createdAt: m.createdAt || c.createdAt,
        projectId: c.projectId,
        projectName: proj?.name || null,
        commitId: c.id,
        owner: owner ? { id: owner.id, name: owner.name || 'User', image: owner.image || null } : null,
        // Minimal placeholder pricing until a dedicated pricing model/table exists
        priceEur: 10,
      });
    }
  }

  // Sort by createdAt desc and paginate
  const allItems = Array.from(itemsMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = allItems.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageItems = start >= 0 && start < total ? allItems.slice(start, end) : [];
  const hasMore = end < total;

  return NextResponse.json({ items: pageItems, page, pageSize: limit, total, hasMore });
}
