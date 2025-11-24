"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const search = searchParams?.toString();
    const url = `${pathname}${search ? `?${search}` : ''}`;

    const send = () => {
      try {
        if (typeof window.clarity === 'function') {
          // Inform Clarity of the virtual page path and emit a navigation event
          window.clarity('set', 'page', url);
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

  return null;
}
