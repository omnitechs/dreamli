// Server component (no "use client")
import { getTranslations } from "next-intl/server";
import type {LanguageCode} from "@/config/i18n";


export default async function FAQ({lang}: { lang: LanguageCode }) {
    const t = await getTranslations({locale:lang ,namespace:"lithosphanes.FAQ"} );

    // Keep IDs stable and fetch strings from i18n
    const items = [
        "bestPhotos",
        "leadTime",
        "sizes",
        "preview",
        "monoVsCmyk",
        "ledIncluded",
        "satisfaction",
        "multiOrder",
    ] as const;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
                            {t("title")}
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80">
                            {t("subtitle")}
                        </p>
                    </div>

                    {/* Accordion */}
                    <div className="space-y-4">
                        {items.map((k) => (
                            <details
                                key={k}
                                className="group bg-gradient-to-r from-[#F8F9FF] to-[#F3E8FF]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <summary className="list-none w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 cursor-pointer">
                                    <h3 className="text-lg font-bold text-[#2E2E2E] pr-4">
                                        {t(`items.${k}.q`)}
                                    </h3>
                                    <div className="w-8 h-8 grid place-items-center rounded-full bg-[#8472DF] text-white transition-transform group-open:rotate-180">
                                        <i className="ri-arrow-down-s-line text-lg" />
                                    </div>
                                </summary>

                                <div className="px-8 pb-6 text-[#2E2E2E]/70 leading-relaxed">
                                    {t(`items.${k}.a`)}
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Contact support */}
                    <div className="mt-12 text-center">
                        <div className="bg-gradient-to-r from-[#8472DF]/10 to-[#93C4FF]/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
                                {t("contact.title")}
                            </h3>
                            <p className="text-[#2E2E2E]/70 mb-6">
                                {t("contact.blurb")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:support@dreamli.nl"
                                    className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#8472DF]/90"
                                >
                                    <i className="ri-mail-line text-lg" />
                                    {t("contact.email")}
                                </a>
                                <a
                                    href="https://wa.me/31645559587"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#25D366]/90"
                                >
                                    <i className="ri-whatsapp-line text-lg" />
                                    {t("contact.whatsapp")}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* End contact */}
                </div>
            </div>
        </section>
    );
}
