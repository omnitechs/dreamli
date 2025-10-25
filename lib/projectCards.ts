import { prisma } from '@/lib/prisma';
import { getPublicProjectsByOwner, getProjectViewsMap } from '@/lib/views';

export function slugifyTitle(s?: string | null): string {
  const base = (s || '').toString().toLowerCase();
  return (
    base
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'project'
  );
}

export function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export type ProjectCardItem = {
  id: string;
  name: string;
  thumbnail: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  isPublic: boolean;
  representativeModelId?: string;
  userLiked?: boolean;
};

export async function loadProjectCardsForOwner(ownerId: string, viewerId?: string, onlyPublic: boolean = false): Promise<{ projects: ProjectCardItem[]; totals: { totalProjects: number; totalLikes: number; totalViews: number } }> {
  if (!ownerId) return { projects: [], totals: { totalProjects: 0, totalLikes: 0, totalViews: 0 } };

  // Load projects list depending on visibility flag availability
  let baseProjects: Array<{ id: string; name: string; createdAt: any; isPublic: boolean }> = [];
  try {
    if (onlyPublic) {
      baseProjects = await getPublicProjectsByOwner(ownerId);
    } else {
      // When not onlyPublic, fetch all owned projects, defaulting isPublic to true when schema lacks it
      try {
        const rows = await prisma.project.findMany({ where: { ownerId }, select: { id: true, name: true, createdAt: true, isPublic: true as any } } as any);
        baseProjects = rows as any;
      } catch {
        const rows = await prisma.project.findMany({ where: { ownerId }, select: { id: true, name: true, createdAt: true } });
        baseProjects = rows.map((p: any) => ({ ...p, isPublic: true }));
      }
    }
  } catch {
    baseProjects = [];
  }

  const projectIds = baseProjects.map(p => p.id);
  const totalProjects = projectIds.length;

  // Prepare per-project info structure
  type ProjInfo = { id: string; name: string; createdAt: any; views: number; thumbnail: string | null; modelIds: Set<string>; isPublic: boolean };
  const projInfoById = new Map<string, ProjInfo>();
  for (const p of baseProjects) {
    const isPublic = typeof (p as any).isPublic === 'boolean' ? !!(p as any).isPublic : true;
    projInfoById.set(p.id, { id: p.id, name: p.name ?? 'Project', createdAt: p.createdAt, views: 0, thumbnail: null, modelIds: new Set<string>(), isPublic });
  }

  // Views per project
  let totalViews = 0;
  try {
    const viewsMap = await getProjectViewsMap(projectIds);
    for (const id of projectIds) {
      const v = viewsMap.get(id) || 0;
      const pi = projInfoById.get(id);
      if (pi) pi.views = v;
      totalViews += v;
    }
  } catch {
    totalViews = 0;
  }

  // Gather commits and determine model IDs and thumbnails
  if (projectIds.length) {
    const commits = await prisma.commit.findMany({ where: { projectId: { in: projectIds } }, orderBy: { createdAt: 'desc' }, take: 3000, select: { id: true, projectId: true, snapshot: true } });
    for (const c of commits) {
      const snap: any = (c as any).snapshot || {};
      const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
      for (const m of models) {
        if (!m || typeof m !== 'object') continue;
        const status = String(m.status || '').toUpperCase();
        const best = pickBestModelUrl(m.modelUrls);
        const id = String(m.id || '');
        if (status !== 'SUCCEEDED' || !best || !id) continue;
        const pi = projInfoById.get(c.projectId);
        if (!pi) continue;
        if (!pi.thumbnail) pi.thumbnail = m.thumbnailUrl || (Array.isArray(m.imageUrls) ? m.imageUrls[0] : null) || null;
        pi.modelIds.add(id);
      }
    }
  }

  // Aggregate likes and comments across all models
  const allModelIds = Array.from(new Set(Array.from(projInfoById.values()).flatMap(p => Array.from(p.modelIds))));
  const likeCountByModel = new Map<string, number>();
  const commentCountByModel = new Map<string, number>();
  if (allModelIds.length) {
    try {
      const likeRows: any[] = await (prisma as any).modelLike.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
      for (const r of likeRows) likeCountByModel.set(String((r as any).modelId), (likeCountByModel.get(String((r as any).modelId)) || 0) + 1);
    } catch {
      try {
        const likeRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
        for (const r of likeRows || []) likeCountByModel.set(String(r.modelId), Number(r.count) || 0);
      } catch {}
    }
    try {
      const commentRows: any[] = await (prisma as any).modelComment.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
      for (const r of commentRows) commentCountByModel.set(String((r as any).modelId), (commentCountByModel.get(String((r as any).modelId)) || 0) + 1);
    } catch {
      try {
        const commentRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelComment" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
        for (const r of commentRows || []) commentCountByModel.set(String(r.modelId), Number(r.count) || 0);
      } catch {}
    }
  }

  // Determine representative model per project
  const representativeByProject = new Map<string, string | undefined>();
  for (const p of Array.from(projInfoById.values())) {
    const first = Array.from(p.modelIds)[0];
    representativeByProject.set(p.id, first);
  }

  // Compute viewer liked set for representative models
  const likedSet = new Set<string>();
  const repIds = Array.from(new Set(Array.from(representativeByProject.values()).filter(Boolean))) as string[];
  if (viewerId && repIds.length) {
    try {
      const rows = await (prisma as any).modelLike.findMany({ where: { userId: viewerId, modelId: { in: repIds } }, select: { modelId: true } });
      for (const r of rows as any[]) likedSet.add(String((r as any).modelId));
    } catch {
      try {
        const rows = await prisma.$queryRaw<{ modelId: string }[]>`SELECT "modelId" FROM "ModelLike" WHERE "userId" = ${viewerId} AND "modelId" = ANY(${repIds}::text[])`;
        for (const r of rows || []) likedSet.add(String(r.modelId));
      } catch {}
    }
  }

  // Build final items and totals
  let totalLikes = 0;
  const projects: ProjectCardItem[] = Array.from(projInfoById.values()).map(p => {
    let likes = 0, comments = 0;
    for (const mid of p.modelIds) {
      likes += likeCountByModel.get(mid) || 0;
      comments += commentCountByModel.get(mid) || 0;
    }
    const representativeModelId = representativeByProject.get(p.id);
    const userLiked = representativeModelId ? likedSet.has(representativeModelId) : false;
    totalLikes += likes;
    return {
      id: p.id,
      name: p.name,
      thumbnail: p.thumbnail || '/placeholder.png',
      likes,
      views: p.views,
      comments,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
      isPublic: p.isPublic,
      representativeModelId,
      userLiked,
    };
  });

  return { projects, totals: { totalProjects, totalLikes, totalViews } };
}
