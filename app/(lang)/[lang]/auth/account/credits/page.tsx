import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TransactionHistory from '@/model/profile/TransactionHistory';

export const dynamic = 'force-dynamic';

export default async function CreditsLedgerPage({ params }: { params: Promise<{ lang: string }> }) {
  const session = await auth();
  const { lang } = await params;
  if (!session) redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account/credits`);

  const userId = (session.user as any)?.id as string;

  // Load all ledger entries for this user, newest first
  const rows = await prisma.creditLedger.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, delta: true, reason: true, reference: true, createdAt: true, details: true },
  });

  // Collect image jobIds to fetch preview thumbnails
  const jobIds = rows
    .map((r: any) => (r?.details as any)?.jobId)
    .filter((x: any) => typeof x === 'string');

  let firstImageByJob: Record<string, string> = {};
  if (jobIds.length) {
    const chunks = await prisma.imageChunk.findMany({
      where: { jobId: { in: Array.from(new Set(jobIds)) } },
      orderBy: [{ jobId: 'asc' }, { index: 'asc' }],
      select: { jobId: true, url: true, base64: true, index: true },
    });
    for (const c of chunks) {
      if (firstImageByJob[c.jobId]) continue;
      const url = c.url || (c.base64 ? `data:image/png;base64,${c.base64}` : undefined);
      if (url) firstImageByJob[c.jobId] = url;
    }
  }

  const transactions = rows.map((t: any) => {
    const amt = Number(String(t.delta || 0));
    const type = String(t.reason || '').includes('refund') ? 'refund' : (amt >= 0 ? 'earned' : 'spent');
    const d: any = (t as any).details || {};

    let description = String(t.reason || '') || 'Transaction';
    let linkHref: string | undefined = undefined;
    let thumbnailUrl: string | undefined = undefined;

    if (d?.kind === 'model_download' || t.reason === 'download_charge') {
      const fmt = d?.format ? String(d.format).toUpperCase() : undefined;
      description = `Model download${fmt ? ` (${fmt})` : ''}`;
      linkHref = d?.viewPath || d?.url || (d?.projectId ? `/en/ai/projects/project/${encodeURIComponent(d.projectId)}` : undefined);
    }

    if (d?.kind === 'model_download_revenue' || t.reason === 'download_revenue_share') {
      description = 'Model sale revenue';
      linkHref = d?.viewPath || (d?.projectId ? `/en/ai/projects/project/${encodeURIComponent(d.projectId)}` : undefined);
    }

    if ((t.reason || '').startsWith('openai:image:') || (d?.kind || '').startsWith('image_')) {
      description = d?.prompt ? `AI image: ${String(d.prompt).slice(0, 64)}` : 'AI image generation';
      const jobId = d?.jobId;
      if (jobId && firstImageByJob[jobId]) thumbnailUrl = firstImageByJob[jobId];
      linkHref = thumbnailUrl || undefined;
    }

    return {
      id: String(t.id),
      type,
      amount: Math.abs(Math.round(amt)),
      description,
      date: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      status: 'completed' as const,
      linkHref,
      thumbnailUrl,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credits ledger</h1>
          <p className="text-sm text-gray-600 mt-1">All transactions are shown in DC (Dreamli Credits).</p>
        </div>
        <TransactionHistory transactions={transactions as any} />
      </div>
    </div>
  );
}
