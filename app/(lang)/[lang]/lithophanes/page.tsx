import LithophanesHero from './LithophanesHero';
import HowItWorksSection from './HowItWorksSection';
import GallerySection from './GallerySection';
import ExplainerVideo from './ExplainerVideo';
import WhyDreamli from './WhyDreamli';
import FinalCTA from './FinalCTA';
import FAQ from './FAQ';
import {LanguageCode} from "@/config/i18n";

export default async function LithophanesPage(props: { params: Promise<{ lang: LanguageCode }>}) {
    const {lang} = await props.params;
  return (
    <div className="min-h-screen bg-white">
      <LithophanesHero />
      <HowItWorksSection />
      <GallerySection />
      {/*<StyleComparison />*/}
      <ExplainerVideo />
      <WhyDreamli />
      <FinalCTA  lang={lang}/>
      <FAQ />
    </div>
  );
}