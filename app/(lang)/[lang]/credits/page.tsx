'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type {LanguageCode} from "@/config/i18n";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';
import { CREDIT_PACKAGES, computePackageDcTotal } from '@/lib/currency';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

function findPackageById(id: string | null | undefined) {
  if (!id) return undefined as undefined | (typeof CREDIT_PACKAGES)[number];
  return CREDIT_PACKAGES.find(p => p.id === id);
}

function fireGa4PurchaseOnce(opts: { sessionId: string; pkgId: string; valueEur: number }) {
  const key = `ga4_purchase_fired:${opts.sessionId}`;
  try {
    const already = sessionStorage.getItem(key);
    if (already === '1') return;
  } catch {}

  const payload: any = {
    transaction_id: opts.sessionId,
    currency: 'EUR',
    value: Number(opts.valueEur.toFixed(2)),
    items: [
      {
        item_id: opts.pkgId,
        item_name: 'Digital Credits',
        price: Number(opts.valueEur.toFixed(2)),
        quantity: 1,
      },
    ],
  };

  let tries = 0;
  const maxTries = 10;
  const attempt = () => {
    try {
      const w = window as any;
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'purchase', payload);
        try { sessionStorage.setItem(key, '1'); } catch {}
        return;
      }
    } catch {}
    tries += 1;
    if (tries < maxTries) {
      setTimeout(attempt, 300);
    }
  };
  attempt();
}

export default function CreditsPage() {
  const { lang } = useParams<{ lang: LanguageCode }>();
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => s.accountUser.me);
  const t = useTranslations('Credits.Page');
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeKind, setNoticeKind] = useState<'info' | 'success' | 'error' | 'warning'>('warning')

  async function refresh() {
    try {
      const res = await fetch('/api/credits/balance', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load balance')
      const js = await res.json()
      const num = Number(js.balance) || 0
      setBalance(num)
      // push into global user state so header updates
      if (me) {
        (dispatch as AppDispatch)(hydrateMe({ ...me, creditsBalance: String(num) } as any))
      }
      try { window.dispatchEvent(new Event('credits-updated')); } catch {}
    } catch {
      setBalance(null)
    }
  }

  useEffect(() => {
    refresh()
    // Handle Stripe return statuses via query params
    try {
      const url = new URL(window.location.href)
      const status = url.searchParams.get('status')
      const sessionId = url.searchParams.get('session_id')
      const pkgIdFromUrl = url.searchParams.get('package_id')
      if (status) {
        if (status === 'success') {
          setNotice(t('notice.success'))
          setNoticeKind('success')
          // refresh immediately and shortly after to catch webhook update
          refresh()
          try { setTimeout(() => { refresh().catch(() => {}) }, 1500) } catch {}

          // Fire GA4 purchase event once with transaction_id = session_id
          try {
            const pkgId = pkgIdFromUrl || sessionStorage.getItem('last_package_id') || undefined
            const pkg = findPackageById(pkgId || undefined)
            if (sessionId && pkg) {
              fireGa4PurchaseOnce({ sessionId, pkgId: pkg.id, valueEur: pkg.eurPrice })
            }
          } catch {}
        } else if (status === 'cancel') {
          setNotice(t('notice.cancel'))
          setNoticeKind('warning')
        } else if (status === 'failed') {
          setNotice(t('notice.failed'))
          setNoticeKind('error')
        }
        url.searchParams.delete('status')
        url.searchParams.delete('session_id')
        url.searchParams.delete('package_id')
        window.history.replaceState({}, '', url.toString())
      }
    } catch {}

    // check if we came from an insufficient credits redirect
    try {
      const msg = sessionStorage.getItem('insufficient_credits_msg')
      if (msg) {
        setNotice(msg)
        setNoticeKind('warning')
        sessionStorage.removeItem('insufficient_credits_msg')
      }
    } catch {}
  }, [])

  async function buyPackage(packageId: string) {
    setLoading(true)
    try {
      try { sessionStorage.setItem('last_package_id', packageId) } catch {}
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      })
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Checkout failed')
      }
      const js = await res.json();
      if (js?.url) {
        window.location.href = js.url as string
        return
      }
      throw new Error('Checkout URL missing')
    } catch (e: any) {
      setNotice(e?.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="text-sm text-gray-600">{t('description')}</p>

      {notice && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            noticeKind === 'success'
              ? 'border border-green-300 bg-green-50 text-green-800'
              : noticeKind === 'error'
              ? 'border border-red-300 bg-red-50 text-red-800'
              : noticeKind === 'info'
              ? 'border border-blue-300 bg-blue-50 text-blue-800'
              : 'border border-amber-300 bg-amber-50 text-amber-800'
          }`}
        >
          {notice}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <div className="text-sm text-gray-500">{t('balanceLabel')}</div>
        <div className="text-3xl font-semibold">{balance === null ? '—' : Math.round(balance)}</div>
      </div>

      <div className="rounded-xl border bg-white p-4 space-y-4">
        <div className="text-sm text-gray-700">{t('packagesLabel')}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CREDIT_PACKAGES.map(pkg => {
            const dc = computePackageDcTotal(pkg);
            return (
              <button
                key={pkg.id}
                onClick={() => buyPackage(pkg.id)}
                disabled={loading}
                className="p-4 rounded-xl border hover:bg-gray-50 text-left disabled:opacity-50"
              >
                <div className="text-lg font-semibold">€{pkg.eurPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{dc.toLocaleString()} DC (+{pkg.bonusPercent}%)</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-sm">
        <Link href={`/${lang}/ai`} className="underline">{t('backToAI')}</Link>
      </div>
    </div>
  )
}
