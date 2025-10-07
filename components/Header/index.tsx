// app/(lang)[lang]/_components/Header.tsx
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { languages, type LanguageCode, type Language } from '@/config/i18n';
import LangSwitcher from './LangSwitcher';
import MobileDropdown from './MobileDropdown';

export default async function Header({ lang }: { lang: LanguageCode }) {
    // use your actual namespace if you have one, else omit "namespace"
    const t = await getTranslations({ locale: lang, namespace: '' });

    const langMeta = (languages as readonly Language[]).find(l => l.code === lang);
    const base = (langMeta?.prefix ?? `/${lang}`) || ''; // respect '' for default lang

    const navItems = [
        { label: t('nav.shop'),        href: `${base}/shop` },
        { label: t('nav.keychains'),   href: `${base}/keychains` },
        { label: t('nav.lithophanes'), href: `${base}/lithophanes` },
        { label: t('nav.contact'),     href: `${base}/contact` }
    ] as const;

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="h-14 md:h-16 flex items-center gap-4">
                    {/* Logo */}
                    <Link
                        href={base || '/'}
                        aria-label={t('aria.home')}
                        className="inline-flex items-center gap-2 shrink-0"
                    >
                        <img
                            src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png"
                            alt={t('aria.logoAlt')}
                            className="h-9 w-auto md:h-10"
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-1.5">
                            {navItems.map(item => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="px-3 py-2 rounded-xl text-sm text-gray-700/90 hover:text-purple-700 hover:bg-purple-50 transition-all leading-none"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-2">
                        <LangSwitcher lang={lang} languages={languages as readonly Language[]} />
                    </div>

                    {/* Mobile menu */}
                    <nav className="md:hidden">
                        <MobileDropdown
                            label={t('nav.menu')}
                            items={navItems.map(item => ({
                                label: item.label,
                                href: item.href
                            }))}
                        />
                    </nav>
                </div>
            </div>
        </header>
    );
}
