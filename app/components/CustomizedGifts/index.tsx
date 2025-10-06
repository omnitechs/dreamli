// app/components/CustomizedGifts.tsx
'use client';
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export function CustomizedGifts() {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                            Customized <span className="text-[#8472DF]">Gifts</span>
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed">
                            Transform your memories into beautiful, personalized gifts that tell your unique story
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Lithophanes */}
                        <div
                            className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-3xl p-8 hover:shadow-lg transition-transform duration-300 flex flex-col"
                            style={{ contentVisibility: "auto" as any }}
                        >
                            {/* Image block with fixed ratio */}
                            <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/3]">
                                <Image
                                    src="/New-Frame-CMYK.png"
                                    alt="Lithophane lamp showcase"
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                                    priority={false}
                                    quality={70}
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-[#8472DF] shadow-sm">
                                    Most Popular
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">Lithophanes</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">
                                        Turn your favorite photos into stunning illuminated art pieces. When lit from behind,
                                        your image comes to life with beautiful depth and detail.
                                    </p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Multiple sizes and styles available</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Perfect for bedrooms and living spaces</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Warm LED lighting included</span>
                                    </li>
                                </ul>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link
                                        href="https://shop.dreamli.nl/product/lithophane/"
                                        className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#8472DF]/90 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <i className="ri-lightbulb-line text-lg w-5 h-5 flex items-center justify-center" />
                                        Create Lithophane
                                    </Link>
                                    <Link
                                        href="/lithophanes#learn-more"
                                        className="inline-flex items-center gap-3 bg-white text-[#8472DF] border-2 border-[#8472DF] px-6 py-3 rounded-full font-bold hover:bg-[#8472DF]/10 transition-colors duration-300"
                                    >
                                        <i className="ri-information-line text-lg w-5 h-5 flex items-center justify-center" />
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Keychains */}
                        <div
                            className="bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE]/30 rounded-3xl p-8 hover:shadow-lg transition-transform duration-300 flex flex-col"
                            style={{ contentVisibility: "auto" as any }}
                        >
                            <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/3]">
                                <Image
                                    src="/keychain.webp"
                                    alt="Custom keychain collection"
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                                    priority={false}
                                    quality={70}
                                />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-[#93C4FF] shadow-sm">
                                    Quick &amp; Easy
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">Custom Keychains</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">
                                        Carry your memories everywhere with personalized keychains. Choose from various shapes,
                                        colors, and add your own photos or text.
                                    </p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Multiple shapes and colors</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Durable 3D printed materials</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center" />
                                        <span className="text-[#2E2E2E]/80">Perfect for gifts or personal use</span>
                                    </li>
                                </ul>

                                <Link
                                    href="/keychains"
                                    className="inline-flex items-center gap-3 bg-[#93C4FF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#93C4FF]/90 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <i className="ri-key-line text-lg w-5 h-5 flex items-center justify-center" />
                                    Design Keychain
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
