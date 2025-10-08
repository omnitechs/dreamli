// app/(lang)[lang]/custom-print/Custom3DPrintSection.tsx
import Link from 'next/link';
import {getLocale, getTranslations} from 'next-intl/server';
import type {LanguageCode} from "@/config/i18n";
import Image from 'next/image';
export default async function Custom3DPrintSection({lang}: { lang: LanguageCode }) {
    const t = await getTranslations({locale:lang ,namespace:'home.Custom3D'});
    const locale = await getLocale();
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/30">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                            {t('title.prefix')} <span className="text-[#8472DF]">{t('title.highlight')}</span>
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <p className="text-lg text-[#2E2E2E]/80 leading-relaxed">
                                    {t('intro')}
                                </p>

                                <div className="bg-white rounded-2xl p-6 border border-[#F3E8FF]">
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">{t('assist.title')}</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">
                                        {t('assist.text')}
                                    </p>
                                </div>

                                <div className="text-center lg:text-left">
                                    <p className="text-lg font-semibold text-[#8472DF] italic">
                                        {t('promise')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href= {locale =="en" ? "https://shop.dreamli.nl/product/custom-3d-print/" : `https://shop.dreamli.nl/${locale}/product/custom-3d-print/`} target="_blank"
                                    className="inline-flex items-center justify-center gap-3 bg-[#8472DF] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8472DF]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer"
                                >
                                    <i className="ri-upload-cloud-line text-xl w-6 h-6 flex items-center justify-center"></i>
                                    {t('cta.upload')}
                                </Link>

                                <Link
                                    href="https://wa.me/31645559587"
                                    className="inline-flex items-center justify-center gap-3 bg-white text-[#8472DF] border-2 border-[#8472DF] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8472DF] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer"
                                >
                                    <i className="ri-pencil-ruler-line text-xl w-6 h-6 flex items-center justify-center"></i>
                                    {t('cta.request')}
                                </Link>
                            </div>
                        </div>

                        <div className="relative">

                            <Image
                                src="/3dmodeling.avif"
                                alt={t('imageAlt')}
                                className="rounded-2xl object-cover shadow-2xl"
                                width={600}
                                height={500}
                                // optional: priority or other props
                            />

                            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center shadow-lg">
                                <i className="ri-printer-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                            </div>

                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FFB067] to-[#ACEEF3] rounded-full opacity-80 animate-pulse"></div>

                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-[#2E2E2E]">{t('status.processing')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-[#2E2E2E]">{t('status.printing')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                        <span className="text-sm font-medium text-[#2E2E2E]/60">{t('status.qc')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <i className="ri-file-code-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                            </div>
                            <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{t('features.files.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-sm">{t('features.files.text')}</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <i className="ri-leaf-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                            </div>
                            <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{t('features.materials.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-sm">{t('features.materials.text')}</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <i className="ri-team-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                            </div>
                            <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">{t('features.team.title')}</h3>
                            <p className="text-[#2E2E2E]/70 text-sm">{t('features.team.text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
