import React from "react";
import ExploreCTA from "@/components/Hero/ExploreCTA";
import ChatBox from "@/components/Hero/ChatBox";
import HeroTitle from "@/components/Hero/HeroTitle";
import type {LanguageCode} from "@/config/i18n";

export default function Hero({lang}: { lang: LanguageCode }) {
    return (
        <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20">
            <HeroTitle lang={lang} />
            <ChatBox />
            <ExploreCTA lang={lang}/>
        </section>
    );
}
