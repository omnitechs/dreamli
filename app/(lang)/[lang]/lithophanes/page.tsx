import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

import LithophanesHero from './LithophanesHero';
import HowItWorksSection from './HowItWorksSection';
import GallerySection from './GallerySection';
import ExplainerVideo from './ExplainerVideo';
import WhyDreamli from './WhyDreamli';
import FinalCTA from './FinalCTA';
import FAQ from './FAQ';

export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });
    const path = '/lithosphanes';

    // Build hreflang map manually
    const languagesMap = Object.fromEntries(
        languages.map(l => [l.code, `/${l.code}${path}`])
    );

    const title = t('lithosphanes.meta.title');
    const description = t('lithosphanes.meta.description');
    const ogImage = t('lithosphanes.meta.ogImage');

    return {
        metadataBase: new URL('https://dreamli.nl'),
        title,
        description,
        alternates: {
            canonical: `/${lang}${path}`,
            languages: { ...languagesMap, 'x-default': '/en' },
        },
        openGraph: {
            title,
            description,
            url: `/${lang}${path}`,
            images: [{ url: ogImage }],
            siteName: 'Dreamli',
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        robots: { index: true, follow: true },
    };
}

export default async function LithophanesPage(props: { params: Promise<{ lang: LanguageCode }>}) {
    const { lang } = await props.params;
    return (
        <div className="min-h-screen bg-white">
            <LithophanesHero />
            <HowItWorksSection />
            <GallerySection />
            <ExplainerVideo />
            <WhyDreamli />
            <FinalCTA lang={lang} />
            <FAQ />
        </div>
    );
}
