// @flow
import * as React from 'react';
import Footer from "@/app/components/Footer";
import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";
import GlbViewer from "@/components/GlbViewer";

type Props = {

};

export default function AI(props: Props) {
    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                            Turn any idea into a <span className="text-[#8472DF]">gift</span>
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                            With the help of AI and our creative team, you can transform almost anything into a physical gift. Share a picture, a child&apos;s drawing, or even a short description — and we&apos;ll bring it to life as a figurine, puzzle, sleep light, or other custom creation. Your imagination becomes a gift they can hold.
                        </p>
                        <Link href="https://ai.dreamli.nl/" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                            <i className="ri-magic-line text-xl w-6 h-6 flex items-center justify-center"></i>
                            Start building your special gift
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <div className="relative">
                            <GlbViewer offMode={"pause"}
                                modelUrl="/untitled2.glb"     // ✅ use modelUrl
                                forceType="glb"             // ✅ optional, but forces STL path
                                className="h-[450px]"  // ✅ controls canvas size
                            />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-80 animate-pulse"></div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <i className="ri-upload-cloud-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Upload &amp; Share</h3>
                                    <p className="text-[#2E2E2E]/70">
                                        Upload your photo, drawing, or idea. Our AI gets to work instantly and starts shaping it into a gift.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <i className="ri-palette-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Design &amp; Refine</h3>
                                    <p className="text-[#2E2E2E]/70">
                                        Some models are created fully by AI — you can interact directly, adjust, and confirm in real time. Others combine AI with our design team. In those cases, you&apos;ll see the preview once it&apos;s finalized, and you can approve or request changes. Either way, you&apos;re always in control.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <i className="ri-gift-2-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Print &amp; Deliver</h3>
                                    <p className="text-[#2E2E2E]/70">
                                        Once you confirm the design, we 3D print it in the Netherlands with high-quality materials and ship it straight to your door.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};