'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { label: string; href: string };

export default function MobileDropdown({ label, items }: { label: string; items: Item[] }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => { setOpen(false); }, [pathname]);

    // Close on Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Close on outside click (anywhere in the document)
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

    return (
        <div className="relative" ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="list-none px-3 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm cursor-pointer select-none hover:bg-gray-100 transition"
                aria-expanded={open}
                aria-haspopup="menu"
            >
                {label}
            </button>

            {/* Optional overlay for UX (very high z to sit above content). Not required for outside-click logic. */}
            {open && (
                <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden />
            )}

            {/* Menu panel */}
            <div
                className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 space-y-1 z-[9999] ${
                    open ? 'block' : 'hidden'
                }`}
                role="menu"
            >
                {items.map(it => (
                    <Link
                        key={it.href}
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-700/90 hover:text-purple-700 hover:bg-purple-50 transition"
                    >
                        {it.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
