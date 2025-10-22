'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type {LanguageCode} from "@/config/i18n";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';
import { CREDIT_PACKAGES, computePackageDcTotal } from '@/lib/currency';

export default function CreditsPage(props: { params: { lang: LanguageCode } }) {
  const { lang } = props.params;
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => s.accountUser.me);
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
      if (status) {
        if (status === 'success') {
          setNotice('Payment successful! Your credits will appear shortly.')
          setNoticeKind('success')
          // refresh immediately and shortly after to catch webhook update
          refresh()
          try { setTimeout(() => { refresh().catch(() => {}) }, 1500) } catch {}
        } else if (status === 'cancel') {
          setNotice('Payment canceled. No charges were made.')
          setNoticeKind('warning')
        } else if (status === 'failed') {
          setNotice('Payment failed. Please try again or use a different card.')
          setNoticeKind('error')
        }
        url.searchParams.delete('status')
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
      <h1 className="text-2xl font-semibold">Buy Digital Credits</h1>
      <p className="text-sm text-gray-600">Purchase Digital Credits securely via Stripe. Choose a package below.</p>

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
        <div className="text-sm text-gray-500">Current balance (DC)</div>
        <div className="text-3xl font-semibold">{balance === null ? '—' : Math.round(balance)}</div>
      </div>

      <div className="rounded-xl border bg-white p-4 space-y-4">
        <div className="text-sm text-gray-700">Packages</div>
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
        <Link href={`/${lang}/ai`} className="underline">Back to AI</Link>
      </div>
    </div>
  )
}
