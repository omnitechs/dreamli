import LithophanesHero from './LithophanesHero';
import HowItWorksSection from './HowItWorksSection';
import GallerySection from './GallerySection';
import StyleComparison from './StyleComparison';
import ExplainerVideo from './ExplainerVideo';
import WhyDreamli from './WhyDreamli';
import FinalCTA from './FinalCTA';
import FAQ from './FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LithophanesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LithophanesHero />
      <HowItWorksSection />
      <GallerySection />
      {/*<StyleComparison />*/}
      <ExplainerVideo />
      <WhyDreamli />
      <FinalCTA />
      <FAQ />
      <Footer />
    </div>
  );
}