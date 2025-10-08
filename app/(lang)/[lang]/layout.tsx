import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MailchimpSubscriptionCoupon from '@/app/components/MailchimpSubscriptionCoupon';
import Script from 'next/script';

export async function generateStaticParams() {
    return languageCodes.map((code) => ({ lang: code }));
}

function buildAlternatesFor(lang: LanguageCode) {
    const languagesMap = Object.fromEntries(languages.map((l) => [l.code, `/${l.code}`]));
    return {
        canonical: `/${lang}`,                          // relative; expanded via metadataBase
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
        // *** KEY FIX: make relative URLs absolute in the final HTML ***
        metadataBase: new URL('https://dreamli.nl'),

        title: t('meta.title'),
        description: t('meta.description'),
        alternates,
        openGraph: {
            title: t('meta.title'),
            description: t('meta.description'),
            url: `/${lang}`,                               // relative; expanded via metadataBase
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
    const { lang } = await params; // not a Promise here
    if (!languageCodes.includes(lang)) notFound();

    setRequestLocale(lang);
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
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </head>
        <body>
        <NextIntlClientProvider key={lang} locale={lang} messages={messages}>
            <MailchimpSubscriptionCoupon />
            <Header lang={lang} />
            {children}
            <Footer />
        </NextIntlClientProvider>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="lazyOnload">
            {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sy5gylxyzn");
          `}
        </Script>

        {/* Google Analytics 4 */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-2Q0BPDFWS4"
            strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2Q0BPDFWS4');
          `}
        </Script>
        </body>
        </html>
    );
}
