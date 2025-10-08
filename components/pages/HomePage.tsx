import Hero from "@/components/Hero";
import AI from "@/components/AI";
import {CustomizedGifts} from "@/components/CustomizedGifts";
import {WhySection} from "@/components/WhySection";
import Custom3DPrintSection from "@/components/Custom3DPrintSection";
import type {LanguageCode} from "@/config/i18n";


export default async function HomePageComponent({lang}: { lang: LanguageCode }) {

    return (
        <div className="min-h-screen bg-white">
            <Hero lang={lang}/>
            <AI lang={lang}/>
            <CustomizedGifts lang={lang}/>
            <WhySection lang={lang}/>
            <Custom3DPrintSection lang={lang}/>
        </div>
    );
}
