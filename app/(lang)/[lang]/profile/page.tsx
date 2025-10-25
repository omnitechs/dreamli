import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';
import { projectColumnExists, getProjectViewsMap } from '@/lib/views';
import { loadProjectCardsForOwner } from '@/lib/projectCards';

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

export default async function MyProfilePage(props: { params: Promise<{ lang: string }> }) {
  const session = await auth();
  const { lang } = await props.params;
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    redirect(`/${lang}/auth/login?redirect=/${lang}/profile`);
  }

  // Load base user info
  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId! },
      select: { id: true, email: true, name: true, image: true, username: true as any, bio: true as any, createdAt: true },
    } as any);
  } catch {
    user = await prisma.user.findUnique({ where: { id: userId! }, select: { id: true, email: true, name: true, image: true, createdAt: true } });
    (user as any).username = null;
    (user as any).bio = null;
  }
  if (!user) redirect(`/${lang}/auth/login?redirect=/${lang}/profile`);

  // Projects owned by the user — avoid selecting non-existent columns by checking existence first
  let baseProjects: any[] = [];
  const hasIsPublic = await projectColumnExists('isPublic');
  if (hasIsPublic) {
    try {
      // Use raw SQL to avoid Prisma Client DMMF validation issues when the client lacks the column
      baseProjects = await prisma.$queryRaw<{ id: string; name: string; createdAt: any; isPublic: boolean }[]>`
        SELECT id, name, "createdAt", "isPublic" FROM "Project" WHERE "ownerId" = ${user.id}
      `;
    } catch {
      // Fallback to minimal select and default isPublic to true
      const rows = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, createdAt: true } });
      baseProjects = rows.map((p: any) => ({ ...p, isPublic: true }));
    }
  } else {
    const rows = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, createdAt: true } });
    baseProjects = rows.map((p: any) => ({ ...p, isPublic: true }));
  }
  const projectIds = baseProjects.map(p => p.id);

  // Total projects
  const totalProjects = projectIds.length;

  // Total views: sum views across user's projects using safe helper (no schema assumptions)
  let totalViews = 0;
  try {
    const viewsMap = await getProjectViewsMap(projectIds);
    for (const id of projectIds) totalViews += viewsMap.get(id) || 0;
  } catch {
    totalViews = 0;
  }

  // Total likes across all models in user's projects
  let totalLikes = 0;
  if (projectIds.length) {
    // Scan commits for these projects and collect model IDs that are downloadable
    const commits = await prisma.commit.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: 'desc' },
      take: 3000,
      select: { id: true, projectId: true, snapshot: true },
    });
    const ids = new Set<string>();
    for (const c of commits) {
      const snap: any = (c as any).snapshot || {};
      const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
      for (const m of models) {
        if (!m || typeof m !== 'object') continue;
        const status = String(m.status || '').toUpperCase();
        const best = pickBestModelUrl(m.modelUrls);
        const id = String(m.id || '');
        if (status === 'SUCCEEDED' && best && id) ids.add(id);
      }
    }
    const modelIds = Array.from(ids);
    if (modelIds.length) {
      try {
        const rows = await (prisma as any).modelLike.findMany({ where: { modelId: { in: modelIds } }, select: { modelId: true } });
        totalLikes = rows.length;
      } catch {
        try {
          const rows = await prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ANY(${modelIds}::text[])`;
          totalLikes = Number(rows?.[0]?.count || 0);
        } catch {
          totalLikes = 0;
        }
      }
    }
  }

  const username: string = (user as any).username || (user as any).name || (user as any).email || 'User';
  const email: string = (user as any).email || '';
  const avatar: string = (user as any).image || avatarFallback(username);
  const bio: string = (user as any).bio || '';
  const joinDate: string = (user as any).createdAt instanceof Date ? (user as any).createdAt.toISOString() : String((user as any).createdAt);

  // Credits overview
  let currentCredits = 0;
  try {
    const bal = await prisma.user.findUnique({ where: { id: user.id }, select: { creditsBalance: true } });
    currentCredits = bal ? Number(String((bal as any).creditsBalance ?? '0')) : 0;
  } catch {}

  let earned = 0;
  let spent = 0;
  try {
    const rows = await prisma.creditLedger.findMany({ where: { userId: user.id }, select: { delta: true } });
    for (const r of rows as any[]) {
      const v = Number(String(r.delta || 0));
      if (v >= 0) earned += v; else spent += Math.abs(v);
    }
  } catch {}

  const initialCredits = { current: Math.round(currentCredits), earned: Math.round(earned), spent: Math.round(spent) };

  // Recent transactions (last 10)
  let initialTransactions: Array<{ id: string; type: 'earned'|'spent'|'refund'; amount: number; description: string; date: string; status: 'completed'|'pending'|'failed'; projectId?: string; projectName?: string }>= [];
  try {
    const tx = await prisma.creditLedger.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, delta: true, reason: true, reference: true, createdAt: true } });
    initialTransactions = tx.map((t: any) => {
      const amt = Number(String(t.delta || 0));
      const type = String(t.reason || '').includes('refund') ? 'refund' : (amt >= 0 ? 'earned' : 'spent');
      const desc = String(t.reason || '');
      return { id: String(t.id), type, amount: Math.abs(Math.round(amt)), description: desc || 'Transaction', date: (t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt)), status: 'completed' };
    });
  } catch {}

  // Build projects list with stats
  type ProjInfo = { id: string; name: string; createdAt: any; views: number; thumbnail: string | null; modelIds: Set<string>; isPublic: boolean };
  const projInfoById = new Map<string, ProjInfo>();
  for (const p of baseProjects as any[]) {
    const isPublic = typeof p.isPublic === 'boolean' ? p.isPublic : true;
    projInfoById.set(p.id, { id: p.id, name: p.name ?? 'Project', createdAt: p.createdAt, views: 0, thumbnail: null, modelIds: new Set<string>(), isPublic });
  }

  // Views per project (defensive when column may not exist)
  try {
    const viewsMap = await getProjectViewsMap(projectIds);
    for (const id of projectIds) {
      const pi = projInfoById.get(id);
      if (pi) pi.views = viewsMap.get(id) || 0;
    }
  } catch {}

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

    // Aggregate likes and comments across all models
    const allModelIds = Array.from(new Set(Array.from(projInfoById.values()).flatMap(p => Array.from(p.modelIds))));
    const likeCountByModel = new Map<string, number>();
    const commentCountByModel = new Map<string, number>();

    if (allModelIds.length) {
      try {
        const likeRows: any[] = await (prisma as any).modelLike.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
        for (const r of likeRows) likeCountByModel.set(r.modelId, (likeCountByModel.get(r.modelId) || 0) + 1);
      } catch {
        try {
          const likeRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
          for (const r of likeRows || []) likeCountByModel.set(String(r.modelId), Number(r.count) || 0);
        } catch {}
      }
      try {
        const commentRows: any[] = await (prisma as any).modelComment.findMany({ where: { modelId: { in: allModelIds } }, select: { modelId: true } });
        for (const r of commentRows) commentCountByModel.set(r.modelId, (commentCountByModel.get(r.modelId) || 0) + 1);
      } catch {
        try {
          const commentRows = await prisma.$queryRaw<{ modelId: string; count: number }[]>`SELECT "modelId", COUNT(*)::int AS count FROM "ModelComment" WHERE "modelId" = ANY(${allModelIds}::text[]) GROUP BY "modelId"`;
          for (const r of commentRows || []) commentCountByModel.set(String(r.modelId), Number(r.count) || 0);
        } catch {}
      }
    }

    // Determine a representative model per project for like/unlike interactions
    const representativeByProject = new Map<string, string | undefined>();
    for (const p of Array.from(projInfoById.values())) {
      const first = Array.from(p.modelIds)[0];
      representativeByProject.set(p.id, first);
    }

    // Compute whether the current viewer liked the representative model
    const repIds = Array.from(new Set(Array.from(representativeByProject.values()).filter(Boolean))) as string[];
    const likedSet = new Set<string>();
    if (repIds.length) {
      try {
        const rows = await (prisma as any).modelLike.findMany({ where: { userId: user.id, modelId: { in: repIds } }, select: { modelId: true } });
        for (const r of rows as any[]) likedSet.add(String((r as any).modelId));
      } catch {
        try {
          const rows = await prisma.$queryRaw<{ modelId: string }[]>`SELECT "modelId" FROM "ModelLike" WHERE "userId" = ${user.id} AND "modelId" = ANY(${repIds}::text[])`;
          for (const r of rows || []) likedSet.add(String(r.modelId));
        } catch {}
      }
    }

    // Build UI list using centralized loader
    const loaded = await loadProjectCardsForOwner(user.id, user.id, false);
    const initialProjects = loaded.projects as any;
    // Override aggregated totals with centralized computation to keep consistency
    const { totalProjects: totalProjectsLoaded, totalLikes: totalLikesLoaded, totalViews: totalViewsLoaded } = loaded.totals;
    const initialUser = {
      id: String(user.id),
      username,
      email,
      bio,
      avatar,
      joinDate,
      totalProjects: totalProjectsLoaded,
      totalLikes: totalLikesLoaded,
      totalViews: totalViewsLoaded,
    };

    return <ProfileClient initialUser={initialUser} initialCredits={initialCredits as any} initialTransactions={initialTransactions as any} initialProjects={initialProjects as any} baseLang={lang} />;
  }

  // No projects edge case
  const initialUser = {
    id: String(user.id),
    username,
    email,
    bio,
    avatar,
    joinDate,
    totalProjects,
    totalLikes,
    totalViews,
  };

  return <ProfileClient initialUser={initialUser} initialCredits={initialCredits as any} initialTransactions={initialTransactions as any} initialProjects={[]} baseLang={lang} />;
}
