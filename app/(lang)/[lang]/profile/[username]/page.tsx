import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProfileHeader from '@/model/profile/ProfileHeader';
import UserProjects from '@/model/profile/UserProjects';

export const dynamic = 'force-dynamic';

function avatarFallback(name: string) {
  const letter = (name || 'U').trim().charAt(0).toUpperCase() || 'U';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='#60a5fa'/>
        <stop offset='100%' stop-color='#a78bfa'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='48' font-family='Arial, Helvetica, sans-serif' fill='white'>${letter}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export default async function PublicProfilePage({ params }: { params: Promise<{ lang: string; username: string }> }) {
  const { lang, username } = await params;

  // Load by username (preferred) or fallback to ID
  let user: any = null;
  try {
    user = await prisma.user.findFirst({
      where: { OR: [ { username: username as any }, { id: username } ] },
      select: { id: true, name: true, email: true, image: true, username: true as any, bio: true as any, createdAt: true },
    } as any);
  } catch {
    user = await prisma.user.findUnique({ where: { id: username }, select: { id: true, name: true, email: true, image: true, createdAt: true } });
    if (user) { (user as any).username = null; (user as any).bio = null; }
  }
  if (!user) return notFound();

  // Projects owned by this user (only public projects)
  let baseProjects: any[] = [];
  try {
    baseProjects = await prisma.project.findMany({ where: { ownerId: user.id, isPublic: true as any }, select: { id: true, name: true, createdAt: true, isPublic: true as any } } as any);
  } catch {
    baseProjects = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, createdAt: true } });
    // Best-effort: assume public if column missing
    baseProjects = baseProjects.map((p: any) => ({ ...p, isPublic: true }));
  }
  const projectIds = baseProjects.map(p => p.id);

  // Totals (views + likes) across public projects
  let totalViews = 0;
  try {
    const agg: any = await (prisma as any).project.aggregate({ _sum: { viewsCount: true }, where: { ownerId: user.id, isPublic: true } });
    totalViews = Number(agg?._sum?.viewsCount || 0);
  } catch {
    totalViews = 0;
  }

  // Collect models across these projects to compute likes and thumbnails
  type ProjInfo = { id: string; name: string; createdAt: any; views: number; thumbnail: string | null; modelIds: Set<string>; isPublic: boolean };
  const projInfoById = new Map<string, ProjInfo>();
  for (const p of baseProjects as any[]) {
    projInfoById.set(p.id, { id: p.id, name: p.name ?? 'Project', createdAt: p.createdAt, views: 0, thumbnail: null, modelIds: new Set<string>(), isPublic: true });
  }
  try {
    const viewRows: any[] = await (prisma as any).project.findMany({ where: { id: { in: projectIds } }, select: { id: true, viewsCount: true } });
    for (const r of viewRows || []) {
      const pi = projInfoById.get(r.id);
      if (pi) pi.views = Number((r as any).viewsCount || 0);
    }
  } catch {}

  let totalLikes = 0;
  // Per-model engagement maps to enable per-project aggregation
  const likeCountByModel = new Map<string, number>();
  const commentCountByModel = new Map<string, number>();

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

    const allModelIds = Array.from(new Set(Array.from(projInfoById.values()).flatMap(p => Array.from(p.modelIds))));
    if (allModelIds.length) {
      // Likes aggregation
      try {
        const rows = await (prisma as any).modelLike.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
        for (const r of rows as any[]) {
          const k = String((r as any).modelId);
          likeCountByModel.set(k, (likeCountByModel.get(k) || 0) + 1);
        }
        totalLikes = Array.from(likeCountByModel.values()).reduce((s, v) => s + v, 0);
      } catch {
        try {
          const rows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
          for (const r of rows || []) likeCountByModel.set(String(r.modelId), Number(r.count) || 0);
          totalLikes = rows.reduce((s, r) => s + Number(r.count || 0), 0);
        } catch { totalLikes = 0; }
      }

      // Comments aggregation
      try {
        const rows = await (prisma as any).modelComment.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
        for (const r of rows as any[]) {
          const k = String((r as any).modelId);
          commentCountByModel.set(k, (commentCountByModel.get(k) || 0) + 1);
        }
      } catch {
        try {
          const rows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelComment" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
          for (const r of rows || []) commentCountByModel.set(String(r.modelId), Number(r.count) || 0);
        } catch {}
      }
    }
  }

  const displayName: string = (user as any).username || (user as any).name || 'User';
  const emailPublic = '';
  const avatar: string = (user as any).image || avatarFallback(displayName);
  const bio: string = (user as any).bio || '';
  const joinDate: string = (user as any).createdAt instanceof Date ? (user as any).createdAt.toISOString() : String((user as any).createdAt);

  const projectCards = Array.from(projInfoById.values()).map(p => {
    let likes = 0, comments = 0;
    for (const mid of p.modelIds) {
      likes += likeCountByModel.get(mid) || 0;
      comments += commentCountByModel.get(mid) || 0;
    }
    return {
      id: p.id,
      name: p.name,
      thumbnail: p.thumbnail || '/placeholder.png',
      likes,
      views: p.views,
      comments,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
      isPublic: true,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ProfileHeader
          user={{
            id: String(user.id),
            username: displayName,
            email: emailPublic,
            bio,
            avatar,
            joinDate,
            totalProjects: projectCards.length,
            totalLikes,
            totalViews,
          }}
          isOwnProfile={false}
        />

        <div className="mt-8">
          <UserProjects projects={projectCards as any} isOwnProfile={false} baseLang={lang} />
        </div>
      </div>
    </div>
  );
}
