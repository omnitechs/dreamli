import type { Metadata } from 'next';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

// Localized metadata for AI section (applies to /[lang]/ai and its subroutes unless overridden)
export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });
    const path = '/ai';

    const languagesMap = Object.fromEntries(
        languages.map(l => [l.code, `/${l.code}${path}`])
    );

    const title = t('AI.meta.title');
    const description = t('AI.meta.description');

    return {
        metadataBase: new URL('https://dreamli.nl'),
        title,
        description,
        alternates: {
            canonical: `/${lang}${path}`,
            languages: { ...languagesMap, 'x-default': '/en' }
        },
        openGraph: {
            title,
            description,
            url: `/${lang}${path}`,
            siteName: 'Dreamli',
            locale: lang,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        },
        robots: { index: true, follow: true }
    };
}

export default function AILayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
