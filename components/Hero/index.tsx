
import React from "react";
import { useChatController } from "@/app/components/Hero/useChatController";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ExploreCTA from "@/app/components/Hero/ExploreCTA";

import {LanguageCode} from "@/config/i18n";
import { getDictionary } from "@/libraries/language";
import dynamic from "next/dynamic";
import ChatBox from "@/components/Hero/ChatBox";
// const ChatBox = dynamic(() => import('@/components/Hero/ChatBox'), { ssr: false });





/* ---------- Page Section ---------- */

function HeroTitle({lang}:{lang:LanguageCode}) {

    return (
        <div className="pt-12 pb-8">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight">
                        Find the perfect gift <span className="text-[#8472DF]">your way</span>
                    </h1>
                    <p className="mt-7 text-xl">
                        Not sure what to choose? With Dreamli you can find gifts in two ways
                    </p>
                </div>
            </div>
        </div>
    );
}





export default function Hero({lang}:{lang:LanguageCode}) {
    // Keep page scrollable; the chat card is capped internally.
    return (
        <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20">
            <HeroTitle lang={lang}/>
            <ChatBox />
            <ExploreCTA href="/gifts" />
        </section>
    );
}
