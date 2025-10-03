// @flow
import * as React from 'react';
import Link from "next/link";

type Props = {

};

export function CustomizedGifts(props: Props) {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
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
                        <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF]/50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                            <div className="relative mb-8">
                                <img
                                    src="/New-Frame-CMYK.png"
                                    alt="Lithophane lamp showcase"
                                    className="w-full h-[400px] rounded-2xl object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#8472DF]">
                                    Most Popular
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">Lithophanes</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">
                                        Turn your favorite photos into stunning illuminated art pieces. When lit from behind, your image comes to life with beautiful depth and detail.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Multiple sizes and styles available</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Perfect for bedrooms and living spaces</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Warm LED lighting included</span>
                                    </div>
                                </div>

                                <Link href="/lithophanes" className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#8472DF]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                                    <i className="ri-lightbulb-line text-lg w-5 h-5 flex items-center justify-center"></i>
                                    Create Lithophane
                                </Link>
                            </div>
                        </div>

                        {/* Keychains */}
                        <div className="bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE]/30 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                            <div className="relative mb-8">
                                <img
                                    src="/keychain.webp"
                                    alt="Custom keychain collection"
                                    className="w-full h-[400px] rounded-2xl object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#93C4FF]">
                                    Quick & Easy
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-3">Custom Keychains</h3>
                                    <p className="text-[#2E2E2E]/70 leading-relaxed">
                                        Carry your memories everywhere with personalized keychains. Choose from various shapes, colors, and add your own photos or text.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Multiple shapes and colors</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Durable 3D printed materials</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <i className="ri-check-line text-[#93C4FF] text-lg w-5 h-5 flex items-center justify-center"></i>
                                        <span className="text-[#2E2E2E]/80">Perfect for gifts or personal use</span>
                                    </div>
                                </div>

                                <Link href="/keychains" className="inline-flex items-center gap-3 bg-[#93C4FF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                                    <i className="ri-key-line text-lg w-5 h-5 flex items-center justify-center"></i>
                                    Design Keychain
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};