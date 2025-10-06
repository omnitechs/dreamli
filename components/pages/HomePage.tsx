
// 'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from "@/components/Hero";
import AI from "@/components/AI";
import {CustomizedGifts} from "@/app/components/CustomizedGifts";
import {WhySection} from "@/app/components/WhySection";
import {LanguageCode} from "@/config/i18n";

export default function HomePageComponent({lang}:{lang:LanguageCode}) {
    return (
        <div className="min-h-screen bg-white">

            <Hero lang={lang}/>
            <AI/>
            <CustomizedGifts/>
            <WhySection/>

        </div>
    );
}
