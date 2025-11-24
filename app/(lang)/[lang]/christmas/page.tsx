import HeroSplit from './components/HeroSplit';
import FeatureGrid from './components/FeatureGrid';
import TestimonialSection from './components/TestimonialSection';
import PricingTabs from './components/PricingTabs';
import StepsRow from './components/StepsRow';
import FooterBanner from './components/FooterBanner';

export default function ChristmasLandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <HeroSplit />
      <FeatureGrid />
      <TestimonialSection />
      <PricingTabs />
      <StepsRow />
      <FooterBanner />
    </div>
  );
}
