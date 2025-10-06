'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    languages,
    defaultLanguage,
    type LanguageCode,
    type Language,
} from '@/config/i18n';

function getLangLabel(lang: Language, uiLangCode: LanguageCode): string {
    // 1) explicit override from config
    const override = lang.names?.[uiLangCode];
    if (override) return override;

    // 2) Intl.DisplayNames fallback (auto-localized name)
    try {
        const uiLocale =
            languages.find(l => l.code === uiLangCode)?.locale || uiLangCode;
        const langLocale = lang.locale || lang.code;
        // @ts-ignore: some TS dom libs miss DisplayNames
        const display = new Intl.DisplayNames([uiLocale], { type: 'language' });
        const localized = display.of(langLocale);
        if (localized && typeof localized === 'string') return localized;
    } catch {
        // ignore and fall through
    }

    // 3) legacy label or code
    return lang.label || lang.code;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [headerH, setHeaderH] = useState(0);

    const pathname = usePathname() || '/';
    const headerRef = useRef<HTMLElement | null>(null);

    // hover close delay
    const closeTimerRef = useRef<number | null>(null);
    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };
    const scheduleClose = (ms = 180) => {
        clearCloseTimer();
        closeTimerRef.current = window.setTimeout(() => {
            setIsDropdownOpen(false);
        }, ms);
    };

    // Hydration safety
    useEffect(() => setIsClient(true), []);

    // Sticky header
    useEffect(() => {
        if (!isClient) return;
        const onScroll = () => setIsSticky(window.scrollY > 0);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [isClient]);

    // Measure actual header height for spacer
    useEffect(() => {
        if (!isClient || !headerRef.current) return;
        const ro = new ResizeObserver(() => {
            if (headerRef.current)
                setHeaderH(headerRef.current.getBoundingClientRect().height);
        });
        ro.observe(headerRef.current);
        return () => ro.disconnect();
    }, [isClient]);

    // Known prefixes sorted longest-first
    const prefixes = useMemo(
        () =>
            [...languages]
                .map(l => l.prefix)
                .filter(Boolean)
                .sort((a, b) => b.length - a.length),
        []
    );

    // Determine current lang by prefix match
    const currentLang: LanguageCode = useMemo(() => {
        const match = languages.find(l => {
            const p = l.prefix || '';
            if (!p) {
                // support no-prefix language if ever used
                return !prefixes.some(px => pathname === px || pathname.startsWith(px + '/'));
            }
            return pathname === p || pathname.startsWith(p + '/');
        });
        return (match?.code as LanguageCode) || defaultLanguage;
    }, [pathname, prefixes]);

    // Remove any known prefix to get the "clean" path
    const cleanPath = useMemo(() => {
        for (const p of prefixes) {
            if (pathname === p) return '/';
            if (pathname.startsWith(p + '/')) return pathname.slice(p.length) || '/';
        }
        return pathname; // no prefix detected
    }, [pathname, prefixes]);

    // Build URL when switching language
    const getLanguageSwitchUrl = (target: LanguageCode) => {
        const defless = cleanPath === '/' ? '/' : cleanPath;
        const targetLang = languages.find(l => l.code === target);
        if (!targetLang) return pathname;
        const pref = targetLang.prefix || '';
        if (!pref) return defless;
        return defless === '/' ? pref : `${pref}${defless}`;
    };

    // Logo href: root of current language
    const currentPrefix = languages.find(l => l.code === currentLang)?.prefix || '';
    const logoHref = currentPrefix || '/';

    // SSR skeleton
    if (!isClient) {
        return (
            <header className="bg-white shadow-sm py-4 px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="h-10 w-24 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-100 rounded animate-pulse"></div>
                </div>
            </header>
        );
    }

    const dropdownId = 'lang-menu';

    return (
        <>
            <header
                ref={headerRef}
                className={`bg-white shadow-sm transition-all duration-300 ${
                    isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-40'
                }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href={logoHref} className="cursor-pointer" aria-label="Dreamli home">
                        <img
                            src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png"
                            alt="Dreamli Logo"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop language dropdown */}
                    <nav className="hidden md:flex items-center space-x-6 relative">
                        <div
                            className="relative pt-2"
                            onMouseEnter={() => {
                                clearCloseTimer();
                                setIsDropdownOpen(true);
                            }}
                            onMouseLeave={() => scheduleClose(180)}
                            onFocus={() => {
                                clearCloseTimer();
                                setIsDropdownOpen(true);
                            }}
                            onBlur={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                    scheduleClose(0);
                                }
                            }}
                        >
                            <button
                                type="button"
                                className="px-3 py-1 text-sm rounded bg-purple-100 text-purple-700 flex items-center gap-1"
                                aria-haspopup="menu"
                                aria-expanded={isDropdownOpen}
                                aria-controls={dropdownId}
                                onClick={() => setIsDropdownOpen(v => !v)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                    }
                                }}
                            >
                                {getLangLabel(
                                    languages.find(l => l.code === currentLang)!,
                                    currentLang
                                )}
                                <i className="ri-arrow-down-s-line text-lg" />
                            </button>

                            <div className="absolute left-0 top-full w-44">
                                {isDropdownOpen && (
                                    <div
                                        id={dropdownId}
                                        role="menu"
                                        className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                                    >
                                        {languages.map(lang => (
                                            <Link
                                                key={lang.code}
                                                href={getLanguageSwitchUrl(lang.code)}
                                                role="menuitem"
                                                className={`block px-4 py-2 text-sm ${
                                                    currentLang === lang.code
                                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'
                                                } transition-colors`}
                                                onClick={() => setIsDropdownOpen(false)}
                                                onMouseEnter={clearCloseTimer}
                                                onMouseLeave={() => scheduleClose(250)}
                                            >
                                                {getLangLabel(lang, currentLang)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(v => !v)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`} />
                    </button>
                </div>

                {/* Mobile dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
                        <nav className="space-y-2">
                            {languages.map(lang => (
                                <Link
                                    key={lang.code}
                                    href={getLanguageSwitchUrl(lang.code)}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 text-sm rounded ${
                                        languages.find(l => l.code === currentLang)?.code === lang.code
                                            ? 'bg-purple-100 text-purple-700 font-medium'
                                            : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {getLangLabel(lang, currentLang)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Spacer exactly matches header height when sticky */}
            {isSticky && <div style={{ height: headerH }} />}
        </>
    );
}
