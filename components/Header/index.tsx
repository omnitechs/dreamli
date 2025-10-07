import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { languages, type LanguageCode, type Language } from '@/config/i18n';
import LangSwitcher from './LangSwitcher';

export default async function Header({ lang }: { lang: LanguageCode }) {
    const t = await getTranslations('Header'); // optional

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

                {/* Only the switcher is client-side to read the live pathname */}
                <LangSwitcher lang={lang} languages={languages as readonly Language[]} />
            </div>
        </header>
    );
}
