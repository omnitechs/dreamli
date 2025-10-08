// components/ExploreCTA.tsx  (SERVER)
import React from 'react';
import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import type {LanguageCode} from "@/config/i18n";

export default async function ExploreCTA({lang}: { lang: LanguageCode }) {     // e.g., "en" | "nl" | ...
    const t = await getTranslations({locale:lang ,namespace:'home.hero.explore'}); // uses your JSON keys
    const href = `https://shop.dreamli.nl/${lang ==="en" ? "" : lang}`;

    const btn =
        'group inline-flex items-center gap-3 rounded-full px-6 sm:px-8 py-3 sm:py-4 ' +
        'text-white font-semibold shadow-lg bg-gradient-to-r from-[#8472DF] to-[#93C4FF] ' +
        'hover:shadow-xl hover:opacity-95 active:opacity-90 transition';

    return (
        <section className="text-center px-6 pb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2E2E2E]">
                {t('title')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#2E2E2E]/70 max-w-2xl mx-auto">
                {t('subtitle')}
            </p>

            <div className="mt-5 sm:mt-6">
                <Link href={href} className={btn} aria-label={t('label')} prefetch>
                    <i className="ri-search-line text-xl sm:text-2xl" />
                    <span className="text-base sm:text-lg">{t('label')}</span>
                </Link>
            </div>
        </section>
    );
}
