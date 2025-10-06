'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languages, defaultLanguage, type LanguageCode } from '@/config/i18n';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const pathname = usePathname() || '/';

    // Ensure hydration safety
    useEffect(() => setIsClient(true), []);

    // Sticky header
    useEffect(() => {
        if (!isClient) return;
        const handleScroll = () => setIsSticky(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isClient]);

    // Find current language by checking longest non-empty prefix first; fallback to defaultLanguage
    const currentLang: LanguageCode = useMemo(() => {
        // Check non-empty prefixes first so '' (English) doesn't swallow everything
        const withPrefix = languages.filter(l => l.prefix);
        const match = withPrefix.find(l => pathname === l.prefix || pathname.startsWith(l.prefix + '/'));
        return (match?.code as LanguageCode) || defaultLanguage;
    }, [pathname]);

    // Build regex for stripping any language prefix from the current path
    const cleanPath = useMemo(() => {
        const codes = languages.map(l => l.code).join('|'); // e.g., "en|nl|de|fr|pl"
        const re = new RegExp(`^/(?:${codes})(?:/|$)`);
        const stripped = pathname.replace(re, '/');
        // Normalize double slashes -> single, and ensure leading slash
        return stripped.replace(/\/+/g, '/');
    }, [pathname]);

    // Build a new URL when switching language
    const getLanguageSwitchUrl = (targetLanguage: LanguageCode) => {
        const target = languages.find(l => l.code === targetLanguage);
        if (!target) return pathname;

        // Default language has no prefix
        if (target.code === defaultLanguage) {
            return cleanPath === '/' ? '/' : cleanPath;
        }
        return cleanPath === '/' ? target.prefix : `${target.prefix}${cleanPath}`;
    };

    // Logo link to the root of the current language
    const currentLangPrefix = languages.find(l => l.code === currentLang)?.prefix ?? '';
    const logoHref = currentLang === defaultLanguage ? '/' : currentLangPrefix || '/';

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

    return (
        <>
            <header
                className={`bg-white shadow-sm transition-all duration-300 ${
                    isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-40'
                }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href={logoHref} className="cursor-pointer">
                        <img
                            src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png"
                            alt="Dreamli Logo"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop language dropdown */}
                    <nav className="hidden md:flex items-center space-x-6 relative">
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className="px-3 py-1 text-sm rounded bg-purple-100 text-purple-700 flex items-center gap-1">
                                {languages.find(l => l.code === currentLang)?.label || 'English'}
                                <i className="ri-arrow-down-s-line text-lg"></i>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-44 z-50">
                                    {languages.map(lang => (
                                        <Link
                                            key={lang.code}
                                            href={getLanguageSwitchUrl(lang.code as LanguageCode)}
                                            className={`block px-4 py-2 text-sm ${
                                                currentLang === lang.code
                                                    ? 'bg-purple-50 text-purple-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'
                                            } transition-colors`}
                                        >
                                            {lang.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
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
                                    href={getLanguageSwitchUrl(lang.code as LanguageCode)}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 text-sm rounded ${
                                        currentLang === lang.code
                                            ? 'bg-purple-100 text-purple-700 font-medium'
                                            : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {lang.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {isSticky && <div className="h-[72px]" />}
        </>
    );
}
