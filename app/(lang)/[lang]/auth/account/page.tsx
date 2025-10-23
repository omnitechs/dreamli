// app/account/page.tsx
import type {LanguageCode} from "@/config/i18n";

export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import AdminUsersManager from "./AdminUsersManager";
import AccountClient from "./AccountClient";
import ReferralPanel from "./ReferralPanel";
import { cookies } from "next/headers";
import { addCredits } from "@/lib/credits";
import { REFERRAL_BONUS_DC } from "@/lib/currency";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AccountPage(props: { params: Promise<{ lang: LanguageCode }> }) {
  const session = await auth();
  const { lang } = await props.params;
  if (!session) {
    redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account`);
  }

  const t = await getTranslations('Account');

  // Load full user info including credits (defensive: prefer id, fallback to email)
  const userId = (session!.user as any)?.id as string | undefined;
  const userEmail = session.user?.email as string | undefined;

  let hasReferral = true;
  let me = null as null | { id: string; name: string | null; email: string | null; createdAt: Date; role: any; creditsBalance: any; referralCode?: string; referredById: string | null };
  const baseSelect = { id: true, name: true, email: true, createdAt: true, role: true, creditsBalance: true, referredById: true } as const;

  async function loadMeWithReferralById(id?: string, email?: string) {
    if (!id && !email) return null;
    try {
      if (id) {
        return await prisma.user.findUnique({ where: { id }, select: { ...baseSelect, referralCode: true } as any }) as any;
      } else {
        return await prisma.user.findUnique({ where: { email: email! }, select: { ...baseSelect, referralCode: true } as any }) as any;
      }
    } catch (e: any) {
      // PrismaClientValidationError when unknown field referralCode exists in select
      hasReferral = false;
      console.warn('Referral column not available; proceeding without referral fields. Consider running Prisma migrations.', e?.message || e);
      if (id) {
        return await prisma.user.findUnique({ where: { id }, select: baseSelect as any }) as any;
      } else {
        return await prisma.user.findUnique({ where: { email: email! }, select: baseSelect as any }) as any;
      }
    }
  }

  me = await loadMeWithReferralById(userId, userEmail);

  // Server-side referral claim for users created via OAuth or other flows
  if (hasReferral && me && !me.referredById) {
    try {
      const cookieStore = await cookies();
      const refCookie = cookieStore.get('ref')?.value || cookieStore.get('referral')?.value || null;
      if (refCookie) {
        const inviter = await prisma.user.findUnique({ where: { referralCode: refCookie as any }, select: { id: true } as any });
        if (inviter && inviter.id !== me.id) {
          await prisma.user.update({ where: { id: me.id }, data: { referredById: inviter.id } });
          me.referredById = inviter.id;
          try {
            await addCredits({
              userId: inviter.id,
              amount: REFERRAL_BONUS_DC,
              reason: 'referral_bonus',
              idempotencyKey: `referral_bonus:${me.id}`,
              reference: `referral:${me.id}`,
            });
          } catch (e) {
            console.error('Failed to award referral bonus on account page claim', e);
          }
          try {
            cookieStore.set('ref', '', { path: '/', maxAge: 0 });
          } catch {}
        }
      }
    } catch (e) {
      console.error('Referral claim check failed', e);
    }
  }

  const clientMe = me ? {
    id: me.id,
    name: me.name,
    email: me.email,
    role: String(me.role),
    creditsBalance: String(me.creditsBalance ?? '0.00'),
    createdAt: me.createdAt instanceof Date ? me.createdAt.toISOString() : String(me.createdAt),
  } : null;

  // Referral data
  let referredUsers: { id: string; name: string | null; email: string | null; createdAt: string; earned: number }[] = [];
  let totalReferralEarned = 0;
  let invoices: { id: string; createdAt: string; amountEur: number; creditsGranted: number; receiptUrl: string | null }[] = [];
  if (me) {
    const rawReferred = await prisma.user.findMany({
      where: { referredById: me.id },
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    const entries = await prisma.creditLedger.findMany({
      where: { userId: me.id, reason: { in: ['referral_bonus', 'referral_revenue'] } },
      select: { reference: true, delta: true, reason: true },
    });
    const perInvitee = new Map<string, number>();
    for (const e of entries as any[]) {
      const ref: string = e.reference ?? '';
      const m1 = /^referral:(.+)$/.exec(String(ref));
      const m2 = /^referral_purchase:(.+)$/.exec(String(ref));
      const invitee = (m1 && m1[1]) || (m2 && m2[1]) || null;
      const dc = Number(String(e.delta));
      if (invitee && !Number.isNaN(dc)) {
        perInvitee.set(invitee, (perInvitee.get(invitee) || 0) + dc);
        totalReferralEarned += dc;
      }
    }
    referredUsers = rawReferred.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: (u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt)),
      earned: perInvitee.get(u.id) || 0,
    }));

    // Invoices list
    const rows = await prisma.invoice.findMany({
      where: { userId: me.id },
      select: { id: true, createdAt: true, amountEur: true, creditsGranted: true, receiptUrl: true },
      orderBy: { createdAt: 'desc' },
    });
    invoices = (rows as any[]).map(r => ({
      id: r.id,
      createdAt: (r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt)),
      amountEur: Number(String(r.amountEur || 0)),
      creditsGranted: Number(String(r.creditsGranted || 0)),
      receiptUrl: (r as any).receiptUrl ?? null,
    }));
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-8 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <AccountClient me={clientMe} lang={lang} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Marketplace</h2>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${lang}/auth/account/models`} className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50">
            Purchased models
          </Link>
          <Link href={`/${lang}/auth/account/sales`} className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50">
            Sold models
          </Link>
        </div>
      </section>

      {hasReferral && me && me.referralCode && (
        <ReferralPanel
          lang={lang}
          referralCode={me.referralCode}
          totalEarned={totalReferralEarned}
          referred={referredUsers}
          referralBonusDc={Number(REFERRAL_BONUS_DC)}
        />
      )}

      {me && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">{t('invoices.title')}</h2>
          {invoices.length === 0 ? (
            <div className="text-sm text-gray-500">{t('invoices.none')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-2 py-2">{t('invoices.date')}</th>
                    <th className="px-2 py-2">{t('invoices.amount')}</th>
                    <th className="px-2 py-2">{t('invoices.credits')}</th>
                    <th className="px-2 py-2">{t('invoices.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-t">
                      <td className="px-2 py-2 text-gray-700">{new Date(inv.createdAt).toLocaleDateString?.(lang as any) ?? ''}</td>
                      <td className="px-2 py-2">€{inv.amountEur.toFixed(2)}</td>
                      <td className="px-2 py-2">{Math.round(inv.creditsGranted).toLocaleString(lang as any)} DC</td>
                      <td className="px-2 py-2">
                        <div className="flex gap-2">
                          <a href={`/api/invoices/${inv.id}/pdf`} target="_blank" className="text-purple-700 hover:underline">{t('invoices.downloadPdf')}</a>
                          {inv.receiptUrl && <a href={inv.receiptUrl} target="_blank" className="text-gray-600 hover:underline">{t('invoices.viewReceipt')}</a>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {((session.user as any)?.role === "admin") && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">{t('admin.title')}</h2>
          <AdminUsersManager />
        </section>
      )}
    </main>
  );
}
