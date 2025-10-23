import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DownloadButton from './DownloadButton';

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

export default async function PurchasedModelsPage({ params }: { params: Promise<{ lang: string }> }) {
  const session = await auth();
  const { lang } = await params;
  if (!session) redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account/models`);
  const userId = (session.user as any)?.id as string;

  // Find all model purchases by this user via CreditLedger
  const charges = await prisma.creditLedger.findMany({
    where: { userId, reason: 'download_charge', reference: { startsWith: 'model_download:' } },
    select: { reference: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  const modelIds = Array.from(new Set(charges.map(c => String(c.reference || '').replace('model_download:', '')).filter(Boolean)));

  // Build a map modelId -> metadata by scanning recent commits
  const items: Array<{ id: string; prompt?: string; thumbnailUrl?: string | null; createdAt: any; projectId: string; projectName?: string | null }>= [];
  if (modelIds.length) {
    const commits = await prisma.commit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2000,
      select: { id: true, projectId: true, createdAt: true, snapshot: true },
    });
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
        items.push({ id, prompt: m.prompt || '', thumbnailUrl: m.thumbnailUrl || m?.imageUrls?.[0] || null, createdAt: c.createdAt, projectId: c.projectId, projectName: proj?.name || null });
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My models</h1>
      {!items.length ? (
        <div className="text-sm text-gray-500">You have not purchased any models yet.</div>
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
                  <span>{new Date(it.createdAt).toLocaleDateString()}</span>
                  <span>{it.projectName || 'Project'}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/${lang}/ai/projects/${slugify(it.projectName || 'project')}/${encodeURIComponent(it.projectId)}`}
                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                  >
                    View project
                  </a>
                  <DownloadButton
                    modelId={it.id}
                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
