// components/Hero/AI.tsx  (SERVER)
import React from 'react';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import GlbViewer from '@/components/GlbViewer';

export default async function AI() {
    const t = await getTranslations('home.ai');

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* ---------- Header ---------- */}
                    <div className="text-center mb-16">
                        <h2
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight"
                        >
                            {t('title') } <span className='text-[#8472DF]'>{t('extendedTitle')}</span>
                        </h2>
                        <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                            {t('subtitle')}
                        </p>
                        <Link
                            href="https://ai.dreamli.nl/"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
                        >
                            <i className="ri-magic-line text-xl w-6 h-6 flex items-center justify-center"></i>
                            {t('cta')}
                        </Link>
                    </div>

                    {/* ---------- Content grid ---------- */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: model viewer */}
                        <div className="relative">
                            <GlbViewer
                                offMode="pause"
                                modelUrl="/untitled2.glb"
                                forceType="glb"
                                className="h-[450px]"
                            />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-80 animate-pulse"></div>
                        </div>

                        {/* Right: steps */}
                        <div className="space-y-8">
                            <Step
                                icon="ri-upload-cloud-line"
                                title={t('steps.upload.title')}
                                text={t('steps.upload.text')}
                                colors="from-[#8472DF] to-[#93C4FF]"
                            />
                            <Step
                                icon="ri-palette-line"
                                title={t('steps.design.title')}
                                text={t('steps.design.text')}
                                colors="from-[#93C4FF] to-[#ACEEF3]"
                            />
                            <Step
                                icon="ri-gift-2-line"
                                title={t('steps.print.title')}
                                text={t('steps.print.text')}
                                colors="from-[#ACEEF3] to-[#FFB067]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- Small helper ---------- */
function Step({
                  icon,
                  title,
                  text,
                  colors
              }: {
    icon: string;
    title: string;
    text: string;
    colors: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div
                className={`w-12 h-12 bg-gradient-to-br ${colors} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
                <i className={`${icon} text-white text-xl w-6 h-6 flex items-center justify-center`} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{title}</h3>
                <p className="text-[#2E2E2E]/70">{text}</p>
            </div>
        </div>
    );
}
