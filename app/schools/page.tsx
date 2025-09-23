
'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SchoolsTopBanner from './SchoolsTopBanner';
import SchoolsHero from './SchoolsHero';
import WhatYouGetSchools from './WhatYouGetSchools';
import OutcomesSection from './OutcomesSection';
import HowItWorksSchools from './HowItWorksSchools';
import ProgramOptions from './ProgramOptions';
import SafetyPracticalities from './SafetyPracticalities';
import GuaranteeSection from './GuaranteeSection';
import PilotInvitation from './PilotInvitation';
import SchoolsLeadForm from './SchoolsLeadForm';
import SchoolsFAQ from './SchoolsFAQ';

export default function SchoolsPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const pilotRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToPilot = () => {
    pilotRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    document.title = "Dreamli for Schools | Creative Education Programs & 3D Learning Kits";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SchoolsTopBanner onRequestPilot={scrollToForm} />
      <Header />
      <SchoolsHero onRequestPilot={scrollToForm} onBookDemo={scrollToPilot} />
      <WhatYouGetSchools />
      <OutcomesSection />
      <HowItWorksSchools />
      <ProgramOptions onRequestPilot={scrollToForm} />
      <SafetyPracticalities />
      <GuaranteeSection />
      <div ref={pilotRef}>
        <PilotInvitation onRequestPilot={scrollToForm} />
      </div>
      <div ref={formRef}>
        <SchoolsLeadForm />
      </div>
      <SchoolsFAQ />
      <Footer />
    </div>
  );
}
