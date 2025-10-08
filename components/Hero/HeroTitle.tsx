// @flow
import * as React from 'react';
import {getTranslations} from "next-intl/server";
import type {LanguageCode} from "@/config/i18n";



async function HeroTitle({lang}: { lang: LanguageCode }) {
    const t =  await getTranslations({locale:lang ,namespace:'home.hero'});
    return (
        <div className="pt-12 pb-8">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight">

                        {t("title")} <span className="text-[#8472DF]">{t("extendedTitle")} </span>
                    </h1>
                    <p className="mt-7 text-xl">
                        {t("subtitle")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HeroTitle;