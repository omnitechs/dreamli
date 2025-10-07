// app/(lang)[lang]/_components/WhyDreamli.tsx
import { getTranslations } from "next-intl/server";
import type { LanguageCode } from "@/config/i18n";

export default async function WhyDreamli({lang}: { lang: LanguageCode }) {
    const t = await getTranslations({locale:lang ,namespace:"lithosphanes.WhyDreamli"});

    const features = [
        {
            icon: "ri-printer-line",
            title: t("features.print.title"),
            description: t("features.print.desc"),
            gradient: "from-[#8472DF] to-[#93C4FF]",
        },
        {
            icon: "ri-lightbulb-line",
            title: t("features.led.title"),
            description: t("features.led.desc"),
            gradient: "from-[#93C4FF] to-[#ACEEF3]",
        },
        {
            icon: "ri-heart-line",
            title: t("features.gift.title"),
            description: t("features.gift.desc"),
            gradient: "from-[#ACEEF3] to-[#FFB067]",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
                            {t("title")}
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}
                                >
                                    <i className={`${feature.icon} text-2xl text-white w-8 h-8 flex items-center justify-center`} />
                                </div>

                                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-[#2E2E2E]/70 leading-relaxed text-center">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-16 bg-white rounded-3xl p-12 shadow-xl">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-[#93C4FF] mb-2">5–7</div>
                                <div className="text-[#2E2E2E]/70">{t("stats.delivery")}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#ACEEF3] mb-2">4.9★</div>
                                <div className="text-[#2E2E2E]/70">{t("stats.rating")}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#FFB067] mb-2">100%</div>
                                <div className="text-[#2E2E2E]/70">{t("stats.guarantee")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
