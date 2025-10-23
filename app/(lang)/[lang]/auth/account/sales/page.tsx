import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.obj || modelUrls.glb || modelUrls.fbx || modelUrls.usdz || undefined;
}

function slugify(s?: string | null) {
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

export default async function SoldModelsPage({ params }: { params: Promise<{ lang: string }> }) {
  const session = await auth();
  const { lang } = await params;
  if (!session) redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account/sales`);
  const userId = (session.user as any)?.id as string;

  // Find all revenue events for this user
  const revenues = await prisma.creditLedger.findMany({
    where: { userId, reason: 'download_revenue_share', reference: { startsWith: 'model_download:' } },
    select: { reference: true, delta: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  // Aggregate by modelId
  const perModel = new Map<string, { total: number; count: number; lastAt: Date }>();
  for (const r of revenues as any[]) {
    const modelId = String((r.reference || '').replace('model_download:', ''));
    if (!modelId) continue;
    const prev = perModel.get(modelId) || { total: 0, count: 0, lastAt: r.createdAt as Date };
    prev.total += Number(String(r.delta || 0));
    prev.count += 1;
    if (prev.lastAt < (r.createdAt as Date)) prev.lastAt = r.createdAt as Date;
    perModel.set(modelId, prev);
  }
  const modelIds = Array.from(perModel.keys());

  // Resolve model metadata from commits
  const items: Array<{ id: string; prompt?: string; thumbnailUrl?: string | null; projectId: string; projectName?: string | null; lastAt: Date; total: number; count: number }>= [];
  if (modelIds.length) {
    const commits = await prisma.commit.findMany({ orderBy: { createdAt: 'desc' }, take: 2000, select: { id: true, projectId: true, snapshot: true } });
    const projects = await prisma.project.findMany({ where: { id: { in: Array.from(new Set(commits.map(c => c.projectId))) } }, select: { id: true, name: true } });
    const projById = new Map(projects.map(p => [p.id, p] as const));
    const seen = new Set<string>();
    for (const c of commits) {
      const snap: any = c.snapshot ?? {};
      const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
      for (const m of models) {
        if (!m || typeof m !== 'object') continue;
        const id = String(m.id || '');
        if (!id || seen.has(id)) continue;
        if (!modelIds.includes(id)) continue;
        const best = pickBestModelUrl(m.modelUrls);
        if (!best) continue;
        seen.add(id);
        const proj = projById.get(c.projectId);
        const agg = perModel.get(id)!;
        items.push({ id, prompt: m.prompt || '', thumbnailUrl: m.thumbnailUrl || m?.imageUrls?.[0] || null, projectId: c.projectId, projectName: proj?.name || null, lastAt: agg.lastAt, total: agg.total, count: agg.count });
      }
    }
  }

  const totalEarned = Array.from(perModel.values()).reduce((s, v) => s + v.total, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sold models</h1>
      <div className="text-sm text-gray-600">Total earned: {Math.round(totalEarned).toLocaleString()} DC</div>
      {!items.length ? (
        <div className="text-sm text-gray-500">No sales yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(it => (
            <div key={it.id} className="border rounded-lg overflow-hidden">
              {it.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.thumbnailUrl} alt={it.prompt || 'model'} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No preview</div>
              )}
              <div className="p-3 space-y-2">
                <div className="text-sm line-clamp-2">{it.prompt || '3D Model'}</div>
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span>Last sold: {new Date(it.lastAt).toLocaleDateString()}</span>
                  <span>{it.projectName || 'Project'}</span>
                </div>
                <div className="text-xs text-gray-600">Sales: {it.count} • Earned: {Math.round(it.total)} DC</div>
                <a
                  href={`/${lang}/ai/projects/${slugify(it.projectName || 'project')}/${encodeURIComponent(it.projectId)}`}
                  className="inline-block mt-1 px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                >
                  View project
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
