import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';



export async function generateStaticParams() {
    return languageCodes.map((code) => ({ lang: code }));
}

function buildAlternatesFor(lang: LanguageCode) {
    const languagesMap = Object.fromEntries(
        languages.map((l) => [l.code, `/${l.code}`])
    );
    return {
        canonical: `/${lang}`,
        languages: { ...languagesMap, 'x-default': '/en' },
    } as const;
}

// Next 15: params is a Promise here only
export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });
    const alternates = buildAlternatesFor(lang);

    return {
        title: t('meta.title'),
        description: t('meta.description'),
        alternates,
        openGraph: {
            title: t('meta.title'),
            description: t('meta.description'),
            url: `/${lang}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('meta.title'),
            description: t('meta.description'),
        },
    };
}

export default async function LangLayout({
                                             children,
                                             params,
                                         }: {
    children: ReactNode;
    params: { lang: LanguageCode };
}) {
    const { lang } = params; // not a Promise here
    if (!languageCodes.includes(lang)) notFound();

    const messages = await getMessages({ locale: lang });

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Dreamli',
        legalName: 'OmniTechs V.O.F.',
        url: 'https://dreamli.nl',
        logo:
            'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png',
        foundingDate: '2023-01-01',
        founders: [
            {
                '@type': 'Person',
                name: 'Seyed Sina Sadegh Esfahani',
                jobTitle: 'Founder & CEO',
                sameAs: [
                    'https://www.linkedin.com/in/sina-sadegh-esfahani',
                    'https://dreamli.nl',
                ],
            },
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Resedastraat 39',
            postalCode: '9713 TN',
            addressLocality: 'Groningen',
            addressRegion: 'GR',
            addressCountry: 'NL',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+31645559587',
                email: 'info@dreamli.nl',
                contactType: 'Customer Support',
                availableLanguage: ['English', 'Dutch', 'German', 'French', 'Polish'],
                areaServed: 'EU',
            },
        ],
        sameAs: [
            'https://www.instagram.com/dreamli',
            'https://www.linkedin.com/company/dreamli',
            'https://www.facebook.com/dreamli',
        ],
    };

    return (
        <html lang={lang}>
        <head>
            <meta name="google" content="notranslate" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </head>
        <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
            <Header lang={lang} />
            {children}
            <Footer />
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
