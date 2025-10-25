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
    select: { id: true, delta: true, reason: true, reference: true, createdAt: true },
  });

  const transactions = rows.map((t: any) => {
    const amt = Number(String(t.delta || 0));
    const type = String(t.reason || '').includes('refund') ? 'refund' : (amt >= 0 ? 'earned' : 'spent');
    const desc = String(t.reason || '') || 'Transaction';
    return {
      id: String(t.id),
      type,
      amount: Math.abs(Math.round(amt)),
      description: desc,
      date: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      status: 'completed' as const,
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
