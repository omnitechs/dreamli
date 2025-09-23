'use client';

import { useState, useRef, useEffect } from 'react';
import HeaderDE from '../components/HeaderDE';
import FooterDE from '../components/FooterDE';
import SchoolsTopBannerDE from './SchoolsTopBannerDE';
import SchoolsHeroDE from './SchoolsHeroDE';
import WhatYouGetSchoolsDE from './WhatYouGetSchoolsDE';
import OutcomesSectionDE from './OutcomesSectionDE';
import HowItWorksSchoolsDE from './HowItWorksSchoolsDE';
import ProgramOptionsDE from './ProgramOptionsDE';
import SafetyPracticalitiesDE from './SafetyPracticalitiesDE';
import GuaranteeSectionDE from './GuaranteeSectionDE';
import PilotInvitationDE from './PilotInvitationDE';
import SchoolsLeadFormDE from './SchoolsLeadFormDE';
import SchoolsFAQDE from './SchoolsFAQDE';

export default function SchoolsPageDE() {
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
    document.title = "Dreamli für Schulen | Kreative Bildungsprogramme & 3D-Lernkits";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SchoolsTopBannerDE onRequestPilot={scrollToForm} />
      <HeaderDE />
      <SchoolsHeroDE onRequestPilot={scrollToForm} onBookDemo={scrollToPilot} />
      <WhatYouGetSchoolsDE />
      <OutcomesSectionDE />
      <HowItWorksSchoolsDE />
      <ProgramOptionsDE onRequestPilot={scrollToForm} />
      <SafetyPracticalitiesDE />
      <GuaranteeSectionDE />
      <div ref={pilotRef}>
        <PilotInvitationDE onRequestPilot={scrollToForm} />
      </div>
      <div ref={formRef}>
        <SchoolsLeadFormDE />
      </div>
      <SchoolsFAQDE />
      <FooterDE />
    </div>
  );
}