'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { hydrateMe } from '@/app/store/slices/accountUserSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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
        creditsBalance: '0',
        createdAt: new Date().toISOString(),
      } as const;
      (dispatch as AppDispatch)(hydrateMe(payload as any));
    }
    if (status === 'unauthenticated' && me) {
      (dispatch as AppDispatch)(hydrateMe(null));
    }
  }, [status, session, me, dispatch]);

  // Live-sync credits: on mount, focus/visibility change, and custom events
  useEffect(() => {
    if (!me) return;

    let aborted = false;
    async function refreshBalance() {
      try {
        const res = await fetch('/api/credits/balance', { cache: 'no-store' });
        if (!res.ok) return;
        const js = await res.json();
        if (aborted) return;
        const num = Number(js?.balance ?? 0);
        const next = Number.isFinite(num) ? String(Math.round(num)) : '0';
        if (me && next !== me.creditsBalance) {
          (dispatch as AppDispatch)(hydrateMe({ ...me, creditsBalance: next } as any));
        }
      } catch {}
    }

    // Initial fetch
    refreshBalance();

    const onFocus = () => refreshBalance();
    const onVis = () => { if (document.visibilityState === 'visible') refreshBalance(); };
    const onEvent = () => refreshBalance();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('credits-updated', onEvent as EventListener);

    return () => {
      aborted = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('credits-updated', onEvent as EventListener);
    };
  }, [me, dispatch]);

  // Close account dropdown on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('touchstart', onDown, true);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('touchstart', onDown, true);
    };
  }, [open]);

  if (!me) {
    // Not logged in: show sign-in button styled like other nav links
    return (
      <Link
        href={loginHref + (pathname ? `?redirect=${encodeURIComponent(pathname)}` : '')}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700/90 hover:text-purple-700 hover:bg-purple-50 transition-all leading-none"
      >
        <span>Sign in</span>
      </Link>
    );
  }

  const credit = (() => {
    const v = Number(me.creditsBalance ?? '0');
    if (Number.isNaN(v)) return '0';
    return Math.round(v).toLocaleString();
  })();

  // Logged in: avatar button with click-toggled menu
  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-3 h-9 px-3 rounded-xl bg-gray-50 text-gray-700 text-sm leading-none select-none hover:bg-gray-100 transition`}
        aria-label="Account"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Avatar */}
        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-[0.8rem] font-semibold text-gray-800`}
             title={me.name || me.email || 'Account'}>
          {initialsFromName(me.name || me.email || 'User')}
        </div>
        {/* Name only (desktop) */}
        <div className="hidden sm:flex flex-col leading-tight mr-1">
          <span className="text-xs text-gray-600">{me.name || me.email}</span>
        </div>
      </button>

      {/* Menu panel */}
      <div
        className={`absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg ${open ? 'block' : 'hidden'}`}
        role="menu"
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-sm font-semibold text-gray-800`}>
              {initialsFromName(me.name || me.email || 'User')}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900">{me.name || me.email}</div>
              <div className="text-xs text-gray-500">Balance: {credit} DC</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <Link href={accountHref} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700/90 hover:text-purple-700 hover:bg-purple-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-500"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z"/></svg>
            Account
          </Link>
          <Link href={`${base || ''}/credits`} onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700/90 hover:text-purple-700 hover:bg-purple-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-500"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9S3 7.03 3 12s4.03 9 9 9zm-.5-13h1a2.5 2.5 0 110 5h-1a.5.5 0 000 1h2a.5.5 0 010 1h-1v1a.5.5 0 01-1 0v-1h-1a2.5 2.5 0 110-5h1a.5.5 0 000-1h-2a.5.5 0 010-1h1v-1a.5.5 0 011 0v1z"/></svg>
            Buy credits
          </Link>
          <button
            onClick={async () => {
              setOpen(false);
              try {
                // Immediately clear client-side user state so the header updates
                (dispatch as AppDispatch)(hydrateMe(null));
              } catch {}
              // Perform real NextAuth sign out to clear the server session
              await signOut({ callbackUrl: loginHref });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-red-600 hover:bg-red-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
