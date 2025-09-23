
'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CollaborationHero from './CollaborationHero';
import IntroSection from './IntroSection';
import PlatformSection from './PlatformSection';
import BenefitsSection from './BenefitsSection';
import HowItWorksSection from './HowItWorksSection';
import TrustProtectionSection from './TrustProtectionSection';
import CollaborationFAQ from './CollaborationFAQ';
import FinalCTA from './FinalCTA';

export default function CollaborationPage() {
  useEffect(() => {
    document.title = "Collaborate with Dreamli — Paid Projects for 3D Designers";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Work on real kids\' art briefs. Model print-ready figures with clear requirements, quick approvals, and fast payouts.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Work on real kids\' art briefs. Model print-ready figures with clear requirements, quick approvals, and fast payouts.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <CollaborationHero />
      <IntroSection />
      <PlatformSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TrustProtectionSection />
      <CollaborationFAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
