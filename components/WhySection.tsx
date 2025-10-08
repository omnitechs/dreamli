// components/WhySection.tsx (SERVER)
import * as React from 'react';
import {getTranslations} from 'next-intl/server';
import type {LanguageCode} from "@/config/i18n";

export async function WhySection({lang}: { lang: LanguageCode }) {
    const t = await getTranslations({locale:lang ,namespace:'home.why'});

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                            {t('title')}
                            <span className="text-[#8472DF]">{t('highlight')}</span>
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <i className="ri-gift-line text-2xl text-white w-8 h-8 flex items-center justify-center" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">{t('exclusive.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-center leading-relaxed">{t('exclusive.text')}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <i className="ri-star-line text-2xl text-white w-8 h-8 flex items-center justify-center" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">{t('personalized.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-center leading-relaxed">{t('personalized.text')}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <i className="ri-book-line text-2xl text-white w-8 h-8 flex items-center justify-center" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">{t('catalog.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-center leading-relaxed">{t('catalog.text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
