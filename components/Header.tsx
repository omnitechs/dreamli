// app/(lang)[lang]/_components/Header.tsx  (SERVER component – no "use client")
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {languages, type LanguageCode, Language} from '@/config/i18n';

export default async function Header({ lang }: { lang: LanguageCode }) {
    const t = await getTranslations('Header'); // optional if you have header strings

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href={`/${lang}`} aria-label="Dreamli home">
                    <img
                        src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png"
                        alt="Dreamli Logo"
                        className="h-10 w-auto"
                    />
                </Link>

                {/* No-JS language switcher */}
                <details className="relative hidden md:block">
                    <summary className="list-none cursor-pointer select-none px-3 py-1 text-sm rounded bg-purple-100 text-purple-700">
                        {lang.toUpperCase()}
                    </summary>
                    <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                        {languages.map((l:Language)  => (
                            <Link
                                key={l.code}
                                href={`/${l.code}`}  // goes to locale home
                                className={`block px-4 py-2 text-sm ${
                                    l.code === lang
                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'
                                }`}
                            >
                                {l.label ?? l.code}
                            </Link>
                        ))}
                    </div>
                </details>

                {/* Mobile: simple list (no JS) */}
                <nav className="md:hidden">
                    <ul className="flex gap-2">
                        {languages.map(l => (
                            <li key={l.code}>
                                <Link
                                    href={`/${l.code}`}
                                    className={`px-2 py-1 text-sm rounded ${
                                        l.code === lang ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {l.code.toUpperCase()}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
