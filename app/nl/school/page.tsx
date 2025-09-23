
'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import FooterNL from '../../components/FooterNL';
import SchoolsTopBannerNL from './SchoolsTopBannerNL';
import SchoolsHeroNL from './SchoolsHeroNL';
import WhatYouGetSchoolsNL from './WhatYouGetSchoolsNL';
import OutcomesSectionNL from './OutcomesSectionNL';
import HowItWorksSchoolsNL from './HowItWorksSchoolsNL';
import ProgramOptionsNL from './ProgramOptionsNL';
import SafetyPracticalitiesNL from './SafetyPracticalitiesNL';
import GuaranteeSectionNL from './GuaranteeSectionNL';
import PilotInvitationNL from './PilotInvitationNL';
import SchoolsLeadFormNL from './SchoolsLeadFormNL';
import SchoolsFAQNL from './SchoolsFAQNL';

export default function SchoolsPageNL() {
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
    document.title = "Dreamli voor Scholen | Creatieve Onderwijsprogramma's & 3D Leerkits";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <SchoolsTopBannerNL onRequestPilot={scrollToForm} />
      <Header />
      <SchoolsHeroNL onRequestPilot={scrollToForm} onBookDemo={scrollToPilot} />
      <WhatYouGetSchoolsNL />
      <OutcomesSectionNL />
      <HowItWorksSchoolsNL />
      <ProgramOptionsNL onRequestPilot={scrollToForm} />
      <SafetyPracticalitiesNL />
      <GuaranteeSectionNL />
      <div ref={pilotRef}>
        <PilotInvitationNL onRequestPilot={scrollToForm} />
      </div>
      <div ref={formRef}>
        <SchoolsLeadFormNL />
      </div>
      <SchoolsFAQNL />
      <FooterNL />
    </div>
  );
}
