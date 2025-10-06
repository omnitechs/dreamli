import Hero from "@/components/Hero";
import AI from "@/components/AI";
import {CustomizedGifts} from "@/app/components/CustomizedGifts";
import {WhySection} from "@/app/components/WhySection";


export default function HomePageComponent() {
    return (
        <div className="min-h-screen bg-white">
            <Hero/>
            <AI/>
            <CustomizedGifts/>
            <WhySection/>
        </div>
    );
}
