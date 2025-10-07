import Hero from "@/components/Hero";
import AI from "@/components/AI";
import {CustomizedGifts} from "@/components/CustomizedGifts";
import {WhySection} from "@/components/WhySection";


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
