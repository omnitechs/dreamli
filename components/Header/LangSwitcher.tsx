'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { LanguageCode, Language } from '@/config/i18n';

function stripLangPrefix(pathname: string, currentLangs: string[]) {
    const re = new RegExp(`^/(?:${currentLangs.join('|')})(?=/|$)`);
    const out = pathname.replace(re, '');
    return out === '' ? '/' : out;
}
function joinLocalePath(prefix: string, pathAfterLang: string) {
    if (!prefix) return pathAfterLang;
    if (pathAfterLang === '/') return prefix;
    return `${prefix}${pathAfterLang}`;
}

export default function LangSwitcher({
                                         lang,
                                         languages,
                                         compact = false
                                     }: {
    lang: LanguageCode;
    languages: readonly Language[];
    compact?: boolean;
}) {
    const pathname = usePathname() || '/';
    const sp = useSearchParams();
    const qs = sp.toString();
    const q = qs ? `?${qs}` : '';

    const rootRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const codes = useMemo(() => languages.map(l => l.code), [languages]);
    const pathAfterLang = useMemo(() => stripLangPrefix(pathname, codes), [pathname, codes]);

    // Close on outside click (anywhere on document)
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

    // Close on Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Close on route change
    useEffect(() => { setOpen(false); }, [pathname]);

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={[
                    "list-none cursor-pointer select-none leading-none inline-flex items-center gap-1.5",
                    compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
                    "rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                ].join(' ')}
                aria-expanded={open}
                aria-haspopup="menu"
            >
                <span className="font-medium">{lang.toUpperCase()}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-70">
                    <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>

            {/* Optional overlay for UX only */}
            {open && (
                <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden />
            )}

            <div
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-[9999] ${
                    open ? 'block' : 'hidden'
                }`}
                role="menu"
            >
                {languages.map(l => {
                    const prefix = l.prefix ?? `/${l.code}`;
                    const href = joinLocalePath(prefix, pathAfterLang) + q;
                    const isActive = l.code === lang;
                    return (
                        <Link
                            key={l.code}
                            href={href}
                            className={[
                                "block px-4 py-2 text-sm rounded-lg transition",
                                isActive
                                    ? "bg-purple-50 text-purple-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-purple-700"
                            ].join(' ')}
                            onClick={() => setOpen(false)}
                        >
                            {l.label ?? l.code.toUpperCase()}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
