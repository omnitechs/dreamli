'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type {LanguageCode} from "@/config/i18n";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';

export default function CreditsPage(props: { params: { lang: LanguageCode } }) {
  const { lang } = props.params;
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => s.accountUser.me);
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(100)
  const [notice, setNotice] = useState<string | null>(null)

  async function refresh() {
    try {
      const res = await fetch('/api/credits/balance', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load balance')
      const js = await res.json()
      const num = Number(js.balance) || 0
      setBalance(num)
      // push into global user state so header updates
      if (me) {
        (dispatch as AppDispatch)(hydrateMe({ ...me, creditsBalance: num.toFixed(2) } as any))
      }
      try { window.dispatchEvent(new Event('credits-updated')); } catch {}
    } catch {
      setBalance(null)
    }
  }

  useEffect(() => {
    refresh()
    // check if we came from an insufficient credits redirect
    try {
      const msg = sessionStorage.getItem('insufficient_credits_msg')
      if (msg) {
        setNotice(msg)
        sessionStorage.removeItem('insufficient_credits_msg')
      }
    } catch {}
  }, [])

  async function topUp(a?: number) {
    const add = a ?? amount
    setLoading(true)
    try {
      const res = await fetch('/api/credits/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: add }),
      })
      if (!res.ok) throw new Error('Top-up failed')
      await refresh()
      setNotice(`Added ${add} credits to your balance.`)
    } catch (e: any) {
      setNotice(e?.message || 'Top-up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Buy credits</h1>
      <p className="text-sm text-gray-600">For now, adding credits is instant and free (no payment flow). Click a preset or enter a custom amount.</p>

      {notice && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
          {notice}
        </div>
      )}

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <div className="text-sm text-gray-500">Current balance</div>
        <div className="text-3xl font-semibold">{balance === null ? '—' : balance}</div>
      </div>

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <div className="text-sm text-gray-700">Quick add</div>
        <div className="flex flex-wrap gap-2">
          {[100, 250, 500, 1000].map(v => (
            <button
              key={v}
              onClick={() => topUp(v)}
              disabled={loading}
              className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              +{v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value || '0'))))}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => topUp()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
          >
            {loading ? 'Adding…' : 'Add credits'}
          </button>
        </div>
      </div>

      <div className="text-sm">
        <Link href={`/${lang}/ai`} className="underline">Back to AI</Link>
      </div>
    </div>
  )
}
