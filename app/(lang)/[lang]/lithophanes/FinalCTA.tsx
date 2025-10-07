// app/(lang)[lang]/_components/FinalCTA.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { LanguageCode } from "@/config/i18n";

export default async function FinalCTA({ lang }: { lang: LanguageCode }) {
    const t = await getTranslations({ locale: lang, namespace: "lithosphanes.FinalCTA" });

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('https://readdy.ai/api/search-image?query=Cozy%20modern%20living%20room%20with%20beautiful%20glowing%20lithophane%20displayed%20on%20side%20table%2C%20warm%20ambient%20lighting%20creating%20intimate%20atmosphere%2C%20comfortable%20furniture%20and%20soft%20textures%2C%20lithophane%20casting%20gentle%20light%2C%20peaceful%20evening%20setting%2C%20home%20interior%20design&width=1920&height=800&seq=final-cta-bg&orientation=landscape')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#8472DF]/80 to-[#2E2E2E]/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {t("heading.before")}{" "}
                        <span className="text-[#FFB067]">{t("heading.highlight")}</span>{" "}
                        {t("heading.after")}
                    </h2>

                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {t("subheading")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={`/${lang}#upload`}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFB067] to-[#FF8A65] text-white px-10 py-5 rounded-full text-xl font-bold hover:from-[#FFB067]/90 hover:to-[#FF8A65]/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 whitespace-nowrap"
                        >
                            <i className="ri-upload-cloud-line text-2xl w-6 h-6 flex items-center justify-center" />
                            {t("cta")}
                        </Link>

                        <div className="flex items-center gap-2 text-white/80">
                            <i className="ri-shield-check-line text-xl w-6 h-6 flex items-center justify-center" />
                            <span className="text-sm">{t("guarantee")}</span>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                            <i className="ri-truck-line text-3xl text-[#FFB067] mb-3 w-8 h-8 flex items-center justify-center mx-auto" />
                            <h3 className="text-white font-bold mb-2">{t("trust.freeShipping.title")}</h3>
                            <p className="text-white/70 text-sm">
                                {t("trust.freeShipping.desc", { threshold: "€50" })}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                            <i className="ri-customer-service-line text-3xl text-[#93C4FF] mb-3 w-8 h-8 flex items-center justify-center mx-auto" />
                            <h3 className="text-white font-bold mb-2">{t("trust.support.title")}</h3>
                            <p className="text-white/70 text-sm">{t("trust.support.desc")}</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                            <i className="ri-award-line text-3xl text-[#4ADE80] mb-3 w-8 h-8 flex items-center justify-center mx-auto" />
                            <h3 className="text-white font-bold mb-2">{t("trust.quality.title")}</h3>
                            <p className="text-white/70 text-sm">{t("trust.quality.desc")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFB067]/20 rounded-full animate-pulse" />
            <div className="absolute bottom-20 right-16 w-16 h-16 bg-[#93C4FF]/30 rounded-full animate-bounce" />
            <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/20 rounded-full animate-ping" />
        </section>
    );
}
