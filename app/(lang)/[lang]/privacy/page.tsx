// app/(lang)[lang]/privacy/test.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { languages, languageCodes, type LanguageCode } from '@/config/i18n';
import { notFound } from 'next/navigation';

type Params = { lang: LanguageCode };

export async function generateMetadata(
    props: { params: Promise<Params> }
): Promise<Metadata> {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();

    const t = await getTranslations({ locale: lang });
    const path = '/privacy';

    // hreflang map
    const languagesMap = Object.fromEntries(
        languages.map(l => [l.code, `/${l.code}${path}`])
    );

    const title = t('privacy.meta.title');
    const description = t('privacy.meta.description');
    // @ts-ignore
    const ogImage = t?.optional?.('privacy.meta.ogImage')?.() || undefined;

    return {
        metadataBase: new URL('https://dreamli.nl'),
        title,
        description,
        alternates: {
            canonical: `/${lang}${path}`,
            languages: { ...languagesMap, 'x-default': `/en${path}` },
        },
        openGraph: {
            title,
            description,
            url: `/${lang}${path}`,
            images: ogImage ? [{ url: ogImage }] : undefined,
            siteName: 'Dreamli',
            locale: lang,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
        robots: { index: true, follow: true },
    };
}

export default async function PrivacyPolicyPage(
    props: { params: Promise<Params> }
) {
    const { lang } = await props.params;
    if (!languageCodes.includes(lang)) notFound();
    const t = await getTranslations('privacy');
    const isEN = lang === 'en';

    return (
        <div className="min-h-screen bg-white">
            {/* Header (keeps same UI) */}


            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('header.title')}</h1>
                    <p className="text-xl text-gray-600 mb-12">{t('header.updated')}</p>

                    {/* Intro */}
                    <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-8 mb-12 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('intro.title')}</h2>
                        <p className="text-gray-700 leading-relaxed">{t('intro.body')}</p>
                    </div>

                    {/* What We Collect */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('collect.title')}</h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                                    <i className="ri-user-line text-purple-600 mr-3"></i>
                                    {t('collect.blocks.provided.title')}
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• {t('collect.blocks.provided.items.0')}</li>
                                    <li>• {t('collect.blocks.provided.items.1')}</li>
                                    <li>• {t('collect.blocks.provided.items.2')}</li>
                                    <li>• {t('collect.blocks.provided.items.3')}</li>
                                    <li>• {t('collect.blocks.provided.items.4')}</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                                    <i className="ri-computer-line text-purple-600 mr-3"></i>
                                    {t('collect.blocks.technical.title')}
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• {t('collect.blocks.technical.items.0')}</li>
                                    <li>• {t('collect.blocks.technical.items.1')}</li>
                                    <li>• {t('collect.blocks.technical.items.2')}</li>
                                    <li>• {t('collect.blocks.technical.items.3')}</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                                    <i className="ri-cookie-line text-purple-600 mr-3"></i>
                                    {t('collect.blocks.cookies.title')}
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• {t('collect.blocks.cookies.items.0')}</li>
                                    <li>• {t('collect.blocks.cookies.items.1')}</li>
                                    <li>• {t('collect.blocks.cookies.items.2')}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('use.title')}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {['orders', 'support', 'legal', 'marketing'].map(key => (
                                <div
                                    key={key}
                                    className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        {t(`use.blocks.${key}.title` as any)}
                                    </h3>
                                    <ul className="space-y-2 text-gray-700 text-sm">
                                        <li>• {t(`use.blocks.${key}.items.0` as any)}</li>
                                        <li>• {t(`use.blocks.${key}.items.1` as any)}</li>
                                        <li>• {t(`use.blocks.${key}.items.2` as any)}</li>
                                        <li>• {t(`use.blocks.${key}.items.3` as any)}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Legal Basis */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('legalBasis.title')}</h2>
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="space-y-4 text-gray-700">
                                <p><strong>{t('legalBasis.items.contract.title')}:</strong> {t('legalBasis.items.contract.body')}</p>
                                <p><strong>{t('legalBasis.items.obligation.title')}:</strong> {t('legalBasis.items.obligation.body')}</p>
                                <p><strong>{t('legalBasis.items.consent.title')}:</strong> {t('legalBasis.items.consent.body')}</p>
                                <p><strong>{t('legalBasis.items.interest.title')}:</strong> {t('legalBasis.items.interest.body')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Retention */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('retention.title')}</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('retention.block.title')}</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• {t('retention.block.items.0')}</li>
                                    <li>• {t('retention.block.items.1')}</li>
                                    <li>• {t('retention.block.items.2')}</li>
                                    <li>• {t('retention.block.items.3')}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Sharing */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('sharing.title')}</h2>
                        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
                            <div className="flex items-start space-x-3">
                                <i className="ri-shield-check-line text-xl text-yellow-600 mt-1"></i>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{t('sharing.neverSell.title')}</h3>
                                    <p className="text-gray-700">{t('sharing.neverSell.body')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">{t('sharing.onlyWith.title')}</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li>• {t('sharing.onlyWith.items.0')}</li>
                                <li>• {t('sharing.onlyWith.items.1')}</li>
                                <li>• {t('sharing.onlyWith.items.2')}</li>
                                <li>• {t('sharing.onlyWith.items.3')}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Rights */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('rights.title')}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {['access','rectify','erase','consent','portability','complaint'].map(key => (
                                <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                        <i className={t(`rights.blocks.${key}.icon`)}></i>
                                        <span className="ml-2">{t(`rights.blocks.${key}.title`)}</span>
                                    </h3>
                                    <p className="text-gray-700 text-sm">{t(`rights.blocks.${key}.body`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('cookies.title')}</h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('cookies.essential.title')}</h3>
                                <p className="text-gray-700 mb-3">{t('cookies.essential.body')}</p>
                                <ul className="space-y-1 text-gray-700 text-sm">
                                    <li>• {t('cookies.essential.items.0')}</li>
                                    <li>• {t('cookies.essential.items.1')}</li>
                                    <li>• {t('cookies.essential.items.2')}</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('cookies.analytics.title')}</h3>
                                <p className="text-gray-700 mb-3">{t('cookies.analytics.body')}</p>
                                <ul className="space-y-1 text-gray-700 text-sm">
                                    <li>• {t('cookies.analytics.items.0')}</li>
                                    <li>• {t('cookies.analytics.items.1')}</li>
                                    <li>• {t('cookies.analytics.items.2')}</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4 italic">{t('cookies.note')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('security.title')}</h2>
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-start space-x-3">
                                <i className="ri-shield-check-line text-2xl text-green-600 mt-1"></i>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('security.how.title')}</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li>• {t('security.how.items.0')}</li>
                                        <li>• {t('security.how.items.1')}</li>
                                        <li>• {t('security.how.items.2')}</li>
                                        <li>• {t('security.how.items.3')}</li>
                                    </ul>
                                    <p className="text-sm text-gray-600 mt-4 italic">{t('security.disclaimer')}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.title')}</h2>
                        <div className="bg-gradient-to-r from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-8 border border-gray-200">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('contact.controller.title')}</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>{t('contact.controller.company')}</strong></p>
                                        <p>{t('contact.controller.kvk')}</p>
                                        <p>{t('contact.controller.addr1')}</p>
                                        <p>{t('contact.controller.addr2')}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('contact.details.title')}</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p className="flex items-center">
                                            <i className="ri-mail-line mr-2 text-purple-600"></i>
                                            {t('contact.details.email')}
                                        </p>
                                        <p className="flex items-center">
                                            <i className="ri-phone-line mr-2 text-purple-600"></i>
                                            {t('contact.details.phone')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Back to home */}
                    <div className="text-center pt-12 border-t border-gray-200">
                        <Link
                            href={`/${lang}`}
                            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                        >
                            <i className="ri-arrow-left-line"></i>
                            <span>{t('ui.backHome')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
