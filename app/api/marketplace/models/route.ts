import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export async function GET(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  // Pagination and sorting params
  const url = new URL(req.url);
  const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = 10; // fixed per requirement
  const sort = (url.searchParams.get('sort') || 'recent').toLowerCase(); // 'recent' | 'likes' | 'comments'

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
        // Engagement placeholders, to be filled below
        likesCount: 0,
        commentsCount: 0,
        userLiked: false,
        // Minimal placeholder pricing until a dedicated pricing model/table exists
        priceEur: 10,
      });
    }
  }

  const allItems = Array.from(itemsMap.values());
  const ids = allItems.map(it => String(it.id));

  // Fetch engagement counts and user liked flags in bulk
  if (ids.length) {
    // Guard for environments where Prisma Client wasn't regenerated (DAOs may be undefined)
    const likesDao: any = (prisma as any).modelLike;
    const commentsDao: any = (prisma as any).modelComment;

    if (likesDao?.findMany && commentsDao?.findMany) {
      // Prisma Accelerate/Data Proxy does not support groupBy; fetch and aggregate in memory
      const [likeRows, commentRows] = await Promise.all([
        likesDao.findMany({ where: { modelId: { in: ids } }, select: { modelId: true } }),
        commentsDao.findMany({ where: { modelId: { in: ids } }, select: { modelId: true } }),
      ]);

      const likeCountById = new Map<string, number>();
      for (const r of likeRows) likeCountById.set(r.modelId, (likeCountById.get(r.modelId) || 0) + 1);

      const commentCountById = new Map<string, number>();
      for (const r of commentRows) commentCountById.set(r.modelId, (commentCountById.get(r.modelId) || 0) + 1);

      for (const it of allItems) {
        it.likesCount = likeCountById.get(it.id) || 0;
        it.commentsCount = commentCountById.get(it.id) || 0;
      }

      if (userId && likesDao?.findMany) {
        const userLikes = await likesDao.findMany({ where: { userId, modelId: { in: ids } }, select: { modelId: true } });
        const likedSet = new Set(userLikes.map((l: any) => l.modelId));
        for (const it of allItems) it.userLiked = likedSet.has(it.id);
      }
    } else {
      // Fallback: use raw SQL (Accelerate/Data Proxy safe) to compute counts in bulk
      try {
        const likeRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`
          SELECT "modelId", COUNT(*)::int AS count
          FROM "ModelLike"
          WHERE "modelId" = ANY(${ids}::text[])
          GROUP BY "modelId"
        `;
        const commentRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`
          SELECT "modelId", COUNT(*)::int AS count
          FROM "ModelComment"
          WHERE "modelId" = ANY(${ids}::text[])
          GROUP BY "modelId"
        `;
        const likeCountById = new Map(likeRows.map(r => [String(r.modelId), Number(r.count) || 0]));
        const commentCountById = new Map(commentRows.map(r => [String(r.modelId), Number(r.count) || 0]));
        for (const it of allItems) {
          it.likesCount = likeCountById.get(String(it.id)) || 0;
          it.commentsCount = commentCountById.get(String(it.id)) || 0;
        }
        if (userId) {
          const userLikedRows = await prisma.$queryRaw<{ modelId: string }[]>`
            SELECT "modelId"
            FROM "ModelLike"
            WHERE "userId" = ${userId} AND "modelId" = ANY(${ids}::text[])
          `;
          const likedSet = new Set(userLikedRows.map(r => String(r.modelId)));
          for (const it of allItems) it.userLiked = likedSet.has(String(it.id));
        } else {
          for (const it of allItems) it.userLiked = false;
        }
      } catch (e) {
        console.error('Failed to load engagement counts (raw)', e);
        for (const it of allItems) {
          it.likesCount = it.likesCount || 0;
          it.commentsCount = it.commentsCount || 0;
          it.userLiked = false;
        }
      }
    }
  }

  // Sort and paginate
  let sorted: any[];
  if (sort === 'likes') {
    sorted = allItems.sort((a, b) => b.likesCount - a.likesCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'comments') {
    sorted = allItems.sort((a, b) => b.commentsCount - a.commentsCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    sorted = allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = sorted.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageItems = start >= 0 && start < total ? sorted.slice(start, end) : [];
  const hasMore = end < total;

  return NextResponse.json({ items: pageItems, page, pageSize: limit, total, hasMore });
}
