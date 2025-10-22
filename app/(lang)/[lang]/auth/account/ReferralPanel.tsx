"use client";
import React, { useMemo, useState } from "react";

export default function ReferralPanel(props: {
  lang: string;
  referralCode: string;
  totalEarned: number; // DC
  referred: Array<{ id: string; name: string | null; email: string | null; createdAt: string; earned: number }>;
}) {
  const { lang, referralCode, totalEarned, referred } = props;
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const path = `/${lang}?ref=${encodeURIComponent(referralCode)}`;
    return origin ? origin + path : path;
  }, [lang, referralCode]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const totalPeople = referred.length;
  const totalDc = Math.round(totalEarned || 0);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Referral program</h2>
        <span className="text-sm text-gray-500">Share and earn</span>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <div className="text-sm text-gray-600">Your referral link</div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            readOnly
            value={link}
            className="flex-1 rounded border px-3 py-2 text-sm bg-white select-all"
          />
          <button onClick={copy} className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow hover:brightness-105 active:brightness-95">
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">Anyone who signs up using your link grants you 6800 DC, plus 10% of every top-up they purchase.</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50">
          <div className="text-xs text-gray-500">Total earned from referrals</div>
          <div className="mt-1 text-2xl font-semibold text-purple-700">{totalDc.toLocaleString()} DC</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Total joined via you</div>
          <div className="mt-1 text-2xl font-semibold">{totalPeople}</div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-gray-900">Referred users</div>
        {referred.length === 0 ? (
          <div className="text-sm text-gray-500">No referred users yet. Share your link to start earning.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">Joined</th>
                  <th className="px-2 py-2 text-right">You earned</th>
                </tr>
              </thead>
              <tbody>
                {referred.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-2 py-2">
                      <div className="font-medium text-gray-900">{u.name || u.email || 'User'}</div>
                      <div className="text-gray-500">{u.email ?? '—'}</div>
                    </td>
                    <td className="px-2 py-2 text-gray-600">{new Date(u.createdAt).toLocaleDateString?.() ?? ''}</td>
                    <td className="px-2 py-2 text-right font-medium">{Math.round(u.earned || 0).toLocaleString()} DC</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
