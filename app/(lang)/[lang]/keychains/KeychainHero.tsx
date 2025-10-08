import { getTranslations } from 'next-intl/server';
import type { LanguageCode } from '@/config/i18n';
import Image from 'next/image'
export default async function KeychainHero({lang}: { lang: LanguageCode }) {
    const t = await getTranslations({ locale: lang, namespace: 'Keychains' });

    return (
        <section
            id="hero"
            className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden"
            aria-label={t('aria.hero')}
        >
            hi
            <Image
                src="/keychain-background.avif"
                alt=""
                priority
                fetchPriority="high"
                fill={true}
                className="object-cover object-center z-1" // sits behind content
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                {t('headline')}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                {t('subheadline')}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-gray-200">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                                    <i className="ri-recycle-line text-green-600 text-xl" />
                                </div>
                                <span className="text-sm text-gray-600">{t('badge.material')}</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
                                    <i className="ri-map-pin-line text-blue-600 text-xl" />
                                </div>
                                <span className="text-sm text-gray-600">{t('badge.madeIn')}</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full">
                                    <i className="ri-bank-card-line text-purple-600 text-xl" />
                                </div>
                                <span className="text-sm text-gray-600">{t('badge.payment')}</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full">
                                    <i className="ri-smartphone-line text-orange-600 text-xl" />
                                </div>
                                <span className="text-sm text-gray-600">{t('badge.nfc')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:pl-8">
                        <div className="relative">
                            <Image
                                src="/keychain-all.avif"
                                alt={t('image.alt')}
                                className="w-full rounded-2xl shadow-2xl object-cover"
                                // you must provide width & height (or use "fill" mode)
                                width={100}
                                height={100}
                                // make it high priority so it loads eagerly / isn't lazy-delayed
                                priority={true}
                            />
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-gray-900">
                    {t('image.livePreview')}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
