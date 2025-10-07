'use client';

import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';
import type { LanguageCode, Language } from '@/config/i18n';

function stripLangPrefix(pathname: string, currentLangs: string[]) {
    // Remove a leading "/{lang}" if present (only the first segment)
    const re = new RegExp(`^/(?:${currentLangs.join('|')})(?=/|$)`);
    const out = pathname.replace(re, '');
    return out === '' ? '/' : out;
}

function joinLocalePath(prefix: string, pathAfterLang: string) {
    if (!prefix) return pathAfterLang;           // default lang without prefix
    if (pathAfterLang === '/') return prefix;    // locale home
    return `${prefix}${pathAfterLang}`;
}

export default function LangSwitcher({
                                         lang,
                                         languages
                                     }: {
    lang: LanguageCode;
    languages: readonly Language[];
}) {
    const pathname = usePathname() || '/';
    const sp = useSearchParams();

    // Build "?..." back if present
    const qs = sp.toString();
    const q = qs ? `?${qs}` : '';

    const codes = languages.map(l => l.code);
    const pathAfterLang = stripLangPrefix(pathname, codes);

    return (
        <>
            {/* Desktop dropdown */}
            <details className="relative hidden md:block">
                <summary className="list-none cursor-pointer select-none px-3 py-1 text-sm rounded bg-purple-100 text-purple-700">
                    {lang.toUpperCase()}
                </summary>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    {languages.map(l => {
                        const prefix = l.prefix ?? `/${l.code}`;
                        const href = joinLocalePath(prefix, pathAfterLang) + q;
                        const isActive = l.code === lang;
                        return (
                            <Link
                                key={l.code}
                                href={href}
                                className={`block px-4 py-2 text-sm ${
                                    isActive
                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'
                                }`}
                            >
                                {l.label ?? l.code.toUpperCase()}
                            </Link>
                        );
                    })}
                </div>
            </details>

            {/* Mobile inline list */}
            <nav className="md:hidden">
                <ul className="flex gap-2">
                    {languages.map(l => {
                        const prefix = l.prefix ?? `/${l.code}`;
                        const href = joinLocalePath(prefix, pathAfterLang) + q;
                        const isActive = l.code === lang;
                        return (
                            <li key={l.code}>
                                <Link
                                    href={href}
                                    className={`px-2 py-1 text-sm rounded ${
                                        isActive
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {(l.label ?? l.code).toUpperCase()}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
