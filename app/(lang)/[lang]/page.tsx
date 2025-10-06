import type { LanguageCode } from '@/config/i18n';
import HomePageComponent from '@/components/pages/HomePage';
import { languageCodes, languages } from '@/config/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';


export async function generateStaticParams() {
    return languages.map((l) => ({ lang: l.code }));
}

/** Per-page metadata (so canonical/hreflang point to the exact page, not just /{lang}) */
export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });

    const url = `/${lang}`; // homepage path; for other pages use the slug path
    const alternates = {
        canonical: url,
        languages: Object.fromEntries(languages.map((l) => [l.code, `/${l.code}`])),
    } as const;

    return {
        title: t('home.title'),           // e.g., 'Welcome to Dreamli'
        description: t('home.description'),
        alternates: { ...alternates, languages: { ...alternates.languages, 'x-default': '/en' } },
        openGraph: { url, title: t('home.title'), description: t('home.description') },
        twitter: { card: 'summary_large_image', title: t('home.title'), description: t('home.description') },
    };
}

export default async function HomePage({ params }: { params: { lang: LanguageCode } }) {
    const { lang } = await params; // DO NOT await here
    if (!languageCodes.includes(lang)) notFound();

    return <HomePageComponent />;
}
