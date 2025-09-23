
import MakeAnythingHero from './MakeAnythingHero';
import StepInterface from './StepInterface';
import PricingSection from './PricingSection';
import PopularIdeasSection from './PopularIdeasSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MakeAnythingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <MakeAnythingHero />
      <StepInterface />
      <PricingSection />
      <PopularIdeasSection />
      <Footer />
    </div>
  );
}
