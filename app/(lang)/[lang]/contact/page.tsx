// app/(lang)[lang]/contact/GeneratorPlayground.tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

import ContactHero from './ContactHero';
import ContactInfo from './ContactInfo';
import ContactMap from './ContactMap';
import ContactForm from './ContactForm';

export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });

    return {
        metadataBase: new URL('https://dreamli.nl'),
        title: t('Contact.meta.title'),
        description: t('Contact.meta.description'),
        keywords: t('Contact.meta.keywords', { default: '' })
            ?.split(',')
            .map(s => s.trim())
            .filter(Boolean),
        alternates: {
            canonical: `/${lang}/contact`,
            languages: Object.fromEntries(
                languages.map(l => [l.code, `/${l.code}/contact`])
            ),
        },
        openGraph: {
            title: t('Contact.meta.title'),
            description: t('Contact.meta.description'),
            url: `/${lang}/contact`,
            images: [{ url: t('Contact.meta.ogImage') }],
            siteName: 'Dreamli',
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('Contact.meta.title'),
            description: t('Contact.meta.description'),
            images: [t('Contact.meta.ogImage')],
        },
        robots: { index: true, follow: true },
    };
}

export default async function ContactPage(
    props: { params: Promise<{ lang: LanguageCode }> }
) {
    const { lang } = await props.params;

    return (
        <div className="min-h-screen">
            <ContactHero lang={lang}/>
            <ContactInfo lang={lang}/>
            <ContactMap lang={lang}/>
            <ContactForm/>
        </div>
    );
}
