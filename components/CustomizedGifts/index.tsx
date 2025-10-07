// components/CustomizedGifts.tsx (SERVER)
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

export async function CustomizedGifts() {
    const t = await getTranslations('home.personalizedGift');

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                            {t.rich('title', {
                                highlight: (chunks) => <span className="text-[#8472DF]">{chunks}</span>,
                            })}
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Lithophanes */}
                        <div
                            className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-3xl p-8 hover:shadow-lg transition-transform duration-300 flex flex-col"
                            style={{contentVisibility: 'auto' as any}}
                        >
                            {/* Image block */}
                            <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/3]">
                                <Image
                                    src="/New-Frame-CMYK.png"
                                    alt={t('litho.imageAlt')}
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                                    priority={false}
                                    quality={70}
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-[#8472DF] shadow-sm">
                                    {t('litho.badge')}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">{t('litho.title')}</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">{t('litho.desc')}</p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('litho.features.0')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('litho.features.1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('litho.features.2')}</span>
                                    </li>
                                </ul>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link
                                        href="https://shop.dreamli.nl/product/lithophane/"
                                        className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#8472DF]/90 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        aria-label={t('litho.ctaPrimary')}
                                    >
                                        <i className="ri-lightbulb-line text-lg w-5 h-5 flex items-center justify-center" />
                                        {t('litho.ctaPrimary')}
                                    </Link>
                                    <Link
                                        href="/lithophanes#learn-more"
                                        className="inline-flex items-center gap-3 bg-white text-[#8472DF] border-2 border-[#8472DF] px-6 py-3 rounded-full font-bold hover:bg-[#8472DF]/10 transition-colors duration-300"
                                        aria-label={t('litho.ctaSecondary')}
                                    >
                                        <i className="ri-information-line text-lg w-5 h-5 flex items-center justify-center" />
                                        {t('litho.ctaSecondary')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Keychains */}
                        <div
                            className="bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE]/30 rounded-3xl p-8 hover:shadow-lg transition-transform duration-300 flex flex-col"
                            style={{contentVisibility: 'auto' as any}}
                        >
                            <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/3]">
                                <Image
                                    src="/keychain.webp"
                                    alt={t('keys.imageAlt')}
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                                    priority={false}
                                    quality={70}
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-[#93C4FF] shadow-sm">
                                    {t('keys.badge')}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">{t('keys.title')}</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">{t('keys.desc')}</p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('keys.features.0')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('keys.features.1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">{t('keys.features.2')}</span>
                                    </li>
                                </ul>

                                <Link
                                    href="/keychains"
                                    className="inline-flex items-center gap-3 bg-[#93C4FF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#93C4FF]/90 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    aria-label={t('keys.cta')}
                                >
                                    <i className="ri-key-line text-lg w-5 h-5 flex items-center justify-center" />
                                    {t('keys.cta')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
