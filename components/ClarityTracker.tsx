"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Tracks client-side route changes for Microsoft Clarity in a Next.js App Router SPA.
 * Without this, Clarity may not register virtual page views correctly on navigation.
 */
export default function ClarityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const search = searchParams?.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;

    const send = () => {
      try {
        if (typeof window.clarity === 'function') {
          // Inform Clarity of the virtual page path and emit a navigation event
          window.clarity('set', 'page', url);
          // Clarity SPA recommendation: emit a navigation event
          // If your Clarity project uses a different convention for SPA, adjust the event name if needed.
          window.clarity('event', 'page_change');
        }
      } catch {
        // no-op
      }
    };

    // Try immediately; if Clarity hasn't loaded yet, try once after a short delay
    if (typeof window.clarity === 'function') {
      send();
      return;
    }

    const id = window.setTimeout(send, 800);
    return () => window.clearTimeout(id);
  }, [pathname, searchParams]);

  // Identify/stitch the same visitor across pages and sessions where possible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prefer an authenticated user id if available; otherwise use a stable anon id in localStorage
    const getOrCreateAnonId = () => {
      try {
        const key = 'clarity_anon_id';
        let v = localStorage.getItem(key);
        if (!v) {
          // generate a short, URL-safe random id (not cryptographically strong, but sufficient for stitching)
          v = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
          localStorage.setItem(key, v);
        }
        return v;
      } catch {
        return null;
      }
    };

    const uid = (session?.user as any)?.id || getOrCreateAnonId();

    const setRefPropertyIfAny = () => {
      try {
        const m = document.cookie.match(/(?:^|; )ref=([^;]+)/);
        const ref = m ? decodeURIComponent(m[1]) : undefined;
        if (ref && typeof window.clarity === 'function') {
          window.clarity('set', 'ref', ref);
        }
      } catch {
        // ignore
      }
    };

    const identify = () => {
      try {
        if (!uid) return;
        if (identifiedRef.current === uid) return; // avoid re-identifying with same id
        if (typeof window.clarity === 'function') {
          // Use Clarity identify API if available; fall back to setting a user_id property
          try {
            // @ts-expect-error - identify may exist at runtime even if not in types
            window.clarity('identify', uid);
          } catch {
            window.clarity('set', 'user_id', uid);
          }
          identifiedRef.current = uid;
          setRefPropertyIfAny();
        }
      } catch {
        // no-op
      }
    };

    // Try now; otherwise schedule a short retry if the script hasn't loaded yet
    if (typeof window.clarity === 'function') {
      identify();
      return;
    }

    const id = window.setTimeout(identify, 800);
    return () => window.clearTimeout(id);
  }, [session]);

  return null;
}
