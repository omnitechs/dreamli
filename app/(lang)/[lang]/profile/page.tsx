import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

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

  // Projects owned by the user
  let baseProjects: any[] = [];
  try {
    baseProjects = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, createdAt: true, isPublic: true as any } } as any);
  } catch {
    baseProjects = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true, name: true, createdAt: true } });
    baseProjects = baseProjects.map((p: any) => ({ ...p, isPublic: true }));
  }
  const projectIds = baseProjects.map(p => p.id);

  // Total projects
  const totalProjects = projectIds.length;

  // Total views (sum of Project.viewsCount)
  let totalViews = 0;
  try {
    const agg: any = await (prisma as any).project.aggregate({ _sum: { viewsCount: true }, where: { ownerId: user.id } });
    totalViews = Number(agg?._sum?.viewsCount || 0);
  } catch {
    // migration might be pending
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
    const viewRows: any[] = await (prisma as any).project.findMany({ where: { id: { in: projectIds } }, select: { id: true, viewsCount: true } });
    for (const r of viewRows || []) {
      const pi = projInfoById.get(r.id);
      if (pi) pi.views = Number((r as any).viewsCount || 0);
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

    // Build UI list
    const initialProjects = Array.from(projInfoById.values()).map(p => {
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
        isPublic: p.isPublic,
      };
    });

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
