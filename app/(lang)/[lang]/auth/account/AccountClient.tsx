"use client";
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export type MeProp = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  creditsBalance: string; // stringified Decimal
  createdAt: string; // ISO
} | null;

function initialsFrom(name?: string | null) {
  if (!name) return 'U';
  const p = name.trim().split(/\s+/);
  return (p[0]?.[0] || 'U').toUpperCase() + (p[1]?.[0] || '').toUpperCase();
}

export default function AccountClient({ me, lang }: { me: MeProp; lang: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const my = useSelector((s: RootState) => s.accountUser.me);
  const t = useTranslations('Account');

  useEffect(() => {
    dispatch(hydrateMe(me));
  }, [dispatch, me]);

  const avatarBg = useMemo(() => {
    const key = my?.id || my?.email || 'me';
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const h = hash % 360;
    return `from-[hsl(${h}deg_85%_85%)] to-[hsl(${(h + 40) % 360}deg_85%_75%)]`;
  }, [my?.id, my?.email]);

  if (!my) return null;

  const credits = Number(my.creditsBalance ?? '0') || 0;
  const fallbackName = t('profile.fallbackName');
  const memberSince = new Date(my.createdAt).toLocaleDateString?.(lang as any) ?? '—';
  const roleStr = String(my.role).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center text-lg font-semibold text-gray-800`}>
            {initialsFrom(my.name || my.email || fallbackName)}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate">{my.name || my.email || fallbackName}</div>
            <div className="text-sm text-gray-500 truncate">{my.email ?? '—'}</div>
            <div className="text-xs text-gray-400">{t('profile.memberSince', { date: memberSince })} • {t('profile.role', { role: roleStr })}</div>
          </div>
        </div>
      </div>

      {/* Sign out action */}
      <div className="flex justify-end">
        <button
          onClick={async () => {
            try { (dispatch as AppDispatch)(hydrateMe(null)); } catch {}
            await signOut({ callbackUrl: `/${lang}` });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
        >
          {t('signOut')}
        </button>
      </div>

      {/* Balance and actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{t('balance.current')}</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-purple-700">{Math.round(credits).toLocaleString(lang as any)} DC</div>
            </div>
            <a href={`/${lang}/credits`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:brightness-105 active:brightness-95">
              {t('balance.add')}
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 p-5 shadow-sm">
          <div className="text-sm text-gray-600">{t('quick.title')}</div>
          <div className="mt-3 flex flex-col gap-2">
            <a href={`/${lang}/settings`} className="text-sm text-purple-700 hover:underline">{t('quick.manageProfile')}</a>
            <a href={`/${lang}/orders`} className="text-sm text-purple-700 hover:underline">{t('quick.orderHistory')}</a>
          </div>
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-2 text-sm font-medium text-gray-900">{t('activity.title')}</div>
        <div className="text-sm text-gray-500">{t('activity.empty')}</div>
      </div>
    </div>
  );
}
