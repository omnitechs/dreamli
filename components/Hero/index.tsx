import React from "react";
import ExploreCTA from "@/components/Hero/ExploreCTA";
import ChatBox from "@/components/Hero/ChatBox";
import HeroTitle from "@/components/Hero/HeroTitle";

export default function Hero() {
    return (
        <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20">
            <HeroTitle/>
            <ChatBox />
            <ExploreCTA/>
        </section>
    );
}
