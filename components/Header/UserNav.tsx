"use client";

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';

type Props = {
  base: string; // e.g. /en or '' for default
};

function initialsFromName(name: string | null | undefined) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const letters = parts.map(p => p[0]?.toUpperCase()).join('');
  return letters || name.slice(0, 1).toUpperCase();
}

export default function UserNav({ base }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const me = useSelector((s: RootState) => s.accountUser.me);
  const pathname = usePathname();

  const accountHref = `${base || ''}/auth/account`;
  const loginHref = `${base || ''}/auth/login`;

  const avatarColor = useMemo(() => {
    // deterministic pastel based on user id or email
    const key = me?.id || me?.email || 'guest';
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    const hue = hash % 360;
    return `from-[hsl(${hue}deg_85%_85%)] to-[hsl(${(hue + 40) % 360}deg_85%_75%)]`;
  }, [me?.id, me?.email]);

  // Keep Redux user in sync with NextAuth session
  const { data: session, status } = useSession();
  useEffect(() => {
    const user: any = session?.user;
    if (status === 'authenticated' && user && !me) {
      const id = (user.id as string) || (user.email as string) || 'unknown';
      const payload = {
        id,
        name: (user.name as string) ?? null,
        email: (user.email as string) ?? null,
        role: (user.role as string) ?? 'user',
        creditsBalance: '0.00',
        createdAt: new Date().toISOString(),
      } as const;
      (dispatch as AppDispatch)(hydrateMe(payload as any));
    }
    if (status === 'unauthenticated' && me) {
      (dispatch as AppDispatch)(hydrateMe(null));
    }
  }, [status, session, me, dispatch]);

  if (!me) {
    // Not logged in: show sign-in button
    return (
      <Link
        href={loginHref + (pathname ? `?redirect=${encodeURIComponent(pathname)}` : '')}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white px-4 py-2 text-sm font-medium shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:brightness-105 active:brightness-95 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2a7 7 0 00-7 7v1a3 3 0 01-3 3h4v6a3 3 0 003 3h6a3 3 0 003-3v-6h4a3 3 0 01-3-3V9a7 7 0 00-7-7z"/>
        </svg>
        <span>Sign in</span>
      </Link>
    );
  }

  const credit = (() => {
    const v = Number(me.creditsBalance ?? '0');
    if (Number.isNaN(v)) return '0.00';
    return v.toFixed(2);
  })();

  // Logged in: avatar button with hover card
  return (
    <div className="relative group">
      <Link
        href={accountHref}
        className={`flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm hover:shadow-md transition-all`}
        aria-label="Account"
      >
        {/* Avatar */}
        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-[0.8rem] font-semibold text-gray-800`}
             title={me.name || me.email || 'Account'}>
          {initialsFromName(me.name || me.email || 'User')}
        </div>
        {/* Name + credit (desktop) */}
        <div className="hidden sm:flex flex-col leading-tight mr-1">
          <span className="text-xs text-gray-600">{me.name || me.email}</span>
          <span className="text-[11px] text-purple-700 font-medium">€ {credit}</span>
        </div>
      </Link>

      {/* Hover card */}
      <div className="pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 transition-opacity">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-sm font-semibold text-gray-800`}>
              {initialsFromName(me.name || me.email || 'User')}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900">{me.name || me.email}</div>
              <div className="text-xs text-gray-500">Balance: € {credit}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <Link href={accountHref} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-500"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z"/></svg>
            Account
          </Link>
          <button
            onClick={async () => {
              try {
                // Immediately clear client-side user state so the header updates
                (dispatch as AppDispatch)(hydrateMe(null));
              } catch {}
              // Perform real NextAuth sign out to clear the server session
              await signOut({ callbackUrl: loginHref });
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
