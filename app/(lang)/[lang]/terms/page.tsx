// app/(lang)[lang]/terms/page.tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

export async function generateMetadata(
    props: { params: Promise<{ lang: LanguageCode }> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });

    const path = '/terms';

    return {
        metadataBase: new URL('https://dreamli.nl'),
        title: t('Terms.meta.title'),
        description: t('Terms.meta.description'),
        alternates: {
            canonical: `/${lang}${path}`,
            languages: Object.fromEntries(languages.map(l => [l.code, `/${l.code}${path}`])),
        },
        openGraph: {
            title: t('Terms.meta.title'),
            description: t('Terms.meta.description'),
            url: `/${lang}${path}`,
            siteName: 'Dreamli',
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('Terms.meta.title'),
            description: t('Terms.meta.description'),
        },
        robots: { index: true, follow: true },
    };
}

export default async function TermsPage(props: { params: Promise<{ lang: LanguageCode }> }) {
    const { lang } = await props.params; // only if you want to show the locale somewhere
    const t = await getTranslations('Terms');

    return (
        <div className="min-h-screen bg-white">
            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('header.title')}</h1>
                            <p className="text-xl text-gray-600">{t('header.site')}</p>
                            <p className="text-sm text-gray-500 mt-2">{t('header.updated')}</p>
                        </div>

                        <div className="space-y-8">
                            {/* Company Information */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-building-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('company.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('company.body')}</p>
                            </section>

                            {/* Products */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-shopping-cart-fill text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('products.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('products.body')}</p>
                            </section>

                            {/* Orders & Payment */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-shopping-cart-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('orders.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('orders.body')}</p>
                            </section>

                            {/* Delivery & Delay Benefits */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-truck-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('delivery.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('delivery.body')}</p>
                                <ul className="text-gray-700 leading-relaxed list-disc pl-6">
                                    <li>{t('delivery.points.onTime')}</li>
                                    <li>{t('delivery.points.delayed')}</li>
                                </ul>
                            </section>

                            {/* Returns */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-arrow-go-back-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('returns.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('returns.body')}</p>
                            </section>

                            {/* Cashback & Site Credit Policy */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-gift-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('cashback.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('cashback.body')}</p>
                                <ul className="text-gray-700 leading-relaxed list-disc pl-6">
                                    <li>{t('cashback.points.full')}</li>
                                    <li>{t('cashback.points.thirty')}</li>
                                    <li>{t('cashback.points.ten')}</li>
                                    <li>{t('cashback.points.none')}</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">{t('cashback.notice')}</p>
                            </section>

                            {/* AI-Generated Models & Licensing */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-robot-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('ai.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('ai.intro')}</p>
                                <ul className="text-gray-700 leading-relaxed list-disc pl-6">
                                    <li>{t('ai.points.license')}</li>
                                    <li>{t('ai.points.commercial')}</li>
                                    <li>{t('ai.points.rights')}</li>
                                </ul>
                            </section>

                            {/* Liability */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-shield-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('liability.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('liability.body')}</p>
                            </section>

                            {/* Intellectual Property */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-copyright-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('ip.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('ip.body')}</p>
                            </section>

                            {/* Privacy & Cookies */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-lock-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('privacy.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('privacy.body')}</p>
                            </section>

                            {/* Law & Disputes */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-scales-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('law.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('law.body')}</p>
                            </section>

                            {/* Changes */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <i className="ri-refresh-line text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{t('changes.title')}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{t('changes.body')}</p>
                            </section>

                            {/* Contact */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-12">
                                <h3 className="text-lg font-semibold text-purple-900 mb-2">{t('contact.title')}</h3>
                                <div className="text-purple-800 space-y-1">
                                    <p><strong>{t('contact.company')}</strong></p>
                                    <p>{t('contact.kvk')}</p>
                                    <p>{t('contact.address')}</p>
                                    <p>{t('contact.email')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
