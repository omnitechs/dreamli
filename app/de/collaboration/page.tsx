'use client';

import { useEffect } from 'react';
import HeaderDE from '../components/HeaderDE';
import FooterDE from '../components/FooterDE';
import CollaborationHeroDE from './CollaborationHeroDE';
import IntroSectionDE from './IntroSectionDE';
import PlatformSectionDE from './PlatformSectionDE';
import BenefitsSectionDE from './BenefitsSectionDE';
import HowItWorksSectionDE from './HowItWorksSectionDE';
import TrustProtectionSectionDE from './TrustProtectionSectionDE';
import CollaborationFAQDE from './CollaborationFAQDE';
import FinalCTADE from './FinalCTADE';

export default function CollaborationPageDE() {
  useEffect(() => {
    document.title = "Mit Dreamli zusammenarbeiten — Bezahlte Projekte für 3D-Designer";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Arbeiten Sie an echten Kinderkunst-Briefings. Modellieren Sie druckfertige Figuren mit klaren Anforderungen, schnellen Genehmigungen und schnellen Auszahlungen.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Arbeiten Sie an echten Kinderkunst-Briefings. Modellieren Sie druckfertige Figuren mit klaren Anforderungen, schnellen Genehmigungen und schnellen Auszahlungen.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <HeaderDE />
      <CollaborationHeroDE />
      <IntroSectionDE />
      <PlatformSectionDE />
      <BenefitsSectionDE />
      <HowItWorksSectionDE />
      <TrustProtectionSectionDE />
      <CollaborationFAQDE />
      <FinalCTADE />
      <FooterDE />
    </div>
  );
}