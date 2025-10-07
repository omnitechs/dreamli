import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

import KeychainHero from './KeychainHero';
import KeychainBuilder from '@/components/KeychainMaker';

export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });
    const path = '/keychains';

    // Build alternates hreflang map without helpers
    const languagesMap = Object.fromEntries(
        languages.map(l => [l.code, `/${l.code}${path}`])
    );

    const title = t('Keychains.meta.title');
    const description = t('Keychains.meta.description');
    const ogImage = t('Keychains.meta.ogImage');

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
            images: [{ url: ogImage }],
            siteName: 'Dreamli',
            locale: lang,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage]
        },
        robots: { index: true, follow: true }
    };
}

export default async function KeychainsPage(props: { params: Promise<{ lang: LanguageCode }>}) {
    const { lang } = await props.params;
    return (
        <div className="min-h-screen">
            <KeychainHero lang={lang} />
            <KeychainBuilder
                woocommerceConfig={{
                    productId: 50361,
                    apiUrl: 'https://shop.dreamli.nl/wp-json/custom/v1/add-to-cart'
                }}
            />
        </div>
    );
}
