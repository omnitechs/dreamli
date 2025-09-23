
import Header from '../../components/Header';
import FooterNL from '../../components/FooterNL';
import CollaborationHeroNL from './CollaborationHeroNL';
import IntroSectionNL from './IntroSectionNL';
import PlatformSectionNL from './PlatformSectionNL';
import BenefitsSectionNL from './BenefitsSectionNL';
import HowItWorksSectionNL from './HowItWorksSectionNL';
import TrustProtectionSectionNL from './TrustProtectionSectionNL';
import CollaborationFAQNL from './CollaborationFAQNL';
import FinalCTANL from './FinalCTANL';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner met Dreamli | Samenwerkingshub voor Creatieve Bedrijven',
  description: 'Word lid van Dreamli\'s Samenwerkingshub. Partner met ons als fabrikanten, verkopers of ontwerpers om innovatieve educatieve producten voor kinderen te maken.',
  keywords: 'dreamli partnerschap, samenwerking, fabrikanten, creatief onderwijs, zakelijke partners, educatieve producten',
  openGraph: {
    title: 'Partner met Dreamli | Samenwerkingshub voor Creatieve Bedrijven',
    description: 'Word lid van Dreamli\'s Samenwerkingshub. Partner met ons om innovatieve educatieve producten voor kinderen te maken.',
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function CollaborationPageNL() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <CollaborationHeroNL />
      <IntroSectionNL />
      <PlatformSectionNL />
      <BenefitsSectionNL />
      <HowItWorksSectionNL />
      <TrustProtectionSectionNL />
      <CollaborationFAQNL />
      <FinalCTANL />
      <FooterNL />
    </div>
  );
}
