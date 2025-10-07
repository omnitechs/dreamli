// app/components/GallerySectionClient.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function GallerySectionClient() {
    const t = useTranslations("lithosphanes.Gallery");
    const lang = useLocale();

    const galleryItems = [
        { id: 1, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/4c33e1920bd60e8c6dcb009174240ba7.png", title: t("items.neonCat.title"), category: t("items.neonCat.category"), alt: t("items.neonCat.alt") },
        { id: 2, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/6e3e80ecbd26a30954beda04bc7eec6e.png", title: t("items.vintagePortrait.title"), category: t("items.vintagePortrait.category"), alt: t("items.vintagePortrait.alt") },
        { id: 3, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/92d8b3aeda0636e578e2265a0f1efecc.png", title: t("items.vanGogh.title"), category: t("items.vanGogh.category"), alt: t("items.vanGogh.alt") },
        { id: 4, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/73e904a9cb42ef241a08e208b2385c8d.png", title: t("items.familyMemories.title"), category: t("items.familyMemories.category"), alt: t("items.familyMemories.alt") },
        { id: 5, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/6095ebea62015839f51023af09dda776.png", title: t("items.natureAbstract.title"), category: t("items.natureAbstract.category"), alt: t("items.natureAbstract.alt") },
        { id: 6, img: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/8b65eabc470add18be01b4ce38ec00f5.png", title: t("items.petPortrait.title"), category: t("items.petPortrait.category"), alt: t("items.petPortrait.alt") },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
                            {t("title")}
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto mb-4">
                            {t("subtitle1")}
                        </p>
                        <p className="text-lg text-[#2E2E2E]/70">{t("subtitle2")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                            >
                                <div className="relative overflow-hidden">
                                    <Image
                                        src={item.img}
                                        alt={item.alt}
                                        width={800}
                                        height={800}
                                        className="w-full h-80 object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-sm uppercase tracking-wide text-white/80">
                                        {item.category}
                                    </div>
                                    <div className="font-semibold">{item.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href={`https://shop.dreamli.nl${lang === 'en' ? '' : `/${lang}`}/product/lithophane/`}
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap"
                        >
                            <i className="ri-image-line text-xl w-6 h-6 flex items-center justify-center" />
                            {t("cta")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
