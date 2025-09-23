'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import StepSectionDE from './StepSectionDE';
import FooterCTADE from './FooterCTADE';
import FAQDE from './FAQDE';
import HeaderDE from '../components/HeaderDE';
import FooterDE from '../components/FooterDE';
import UploadFormDE from './UploadFormDE';

export default function HowItWorksPageDE() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    document.title = "Wie es funktioniert: Zeichnung zu 3D-gedruckter, bemalbarer Figur | Dreamli";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Schritt für Schritt: Kunstwerk hochladen (Foto oder Scan), 3D-Modell vorschauen und genehmigen, wir drucken in 3D und liefern Ihre bemalbare Figur mit Pinseln und Farben.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Schritt für Schritt: Kunstwerk hochladen (Foto oder Scan), 3D-Modell vorschauen und genehmigen, wir drucken in 3D und liefern Ihre bemalbare Figur mit Pinseln und Farben.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleStartForFree = () => {
    setShowUploadModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <HeaderDE />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight">
              Wie es funktioniert
            </h1>
            <p className="text-xl md:text-2xl text-[#8472DF] font-semibold mb-8 max-w-2xl mx-auto">
              Einfache 4 Schritte — von der Zeichnung zu einer echten Figur.
            </p>
            <button 
              onClick={handleStartForFree}
              className="inline-block bg-[#8472DF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#7A66D9] transition-colors shadow-lg whitespace-nowrap cursor-pointer"
            >
              Kostenlos starten
            </button>
          </div>
        </div>
      </div>
      
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.textContent?.includes('Kostenlos starten') || target.closest('button')?.textContent?.includes('Kostenlos starten')) {
          e.preventDefault();
          handleStartForFree();
        }
      }}>
        <StepSectionDE
          stepNumber={1}
          title="Zeichnung hochladen"
          blurb="Verwirrung beseitigen; es ist einfach."
          substeps={[
            "Kostenlos starten — Klicken Sie auf einen beliebigen Handlungsaufruf, um zu beginnen.",
            "Zeichnung hochladen — Foto oder Scan ist in Ordnung.",
            "Kind & Kontakt hinzufügen — Name, Alter, E-Mail; Telefon optional.",
            "Sichere Kasse — Sicher bezahlen, um Ihr Projekt zu erstellen."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png"
          imageAlt="Zeichnung hochladen Prozess"
        />
        
        <StepSectionDE
          stepNumber={2}
          title="Vorschau & Bestätigen"
          blurb="Sehen und genehmigen, bevor wir drucken."
          substeps={[
            "Konto / Anmeldung — Passwort aus E-Mail setzen oder Google verwenden.",
            "Bestellungen — Ihr Dashboard listet jede Bestellung auf.",
            "Erinnerungsseite — Eine Live-Zeitleiste von Updates und Dateien.",
            "3D-Vorschau & Revisionen — Modell überprüfen; genehmigen oder bis zu 3 Änderungen anfordern."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5b6120a5cd542ee7eeb0ff23c5c818da.png"
          imageAlt="3D-Vorschau und Dashboard"
          reverse={true}
        />
        
        <StepSectionDE
          stepNumber={3}
          title="Wir erstellen es"
          blurb="Wir bauen mit Sorgfalt und Qualität."
          substeps={[
            "3D-Druck — Nach Genehmigung drucken und qualitätsprüfen wir.",
            "Altersgerechtes Malkit — Pinsel und Farben passend zu Alter und Stil.",
            "Versand & Verfolgung — Sicher verpackt; Updates an Ihre E-Mail gesendet."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5cf087223314587d8aa5957dc16f184b.png"
          imageAlt="3D-Druckprozess"
        />
        
        <StepSectionDE
          stepNumber={4}
          title="Bauen & Malen"
          blurb="Gemeinsam Erinnerungen schaffen, dann teilen."
          substeps={[
            "Bauen, Malen & Teilen — Zu Hause malen; Fotos und Videos auf die Erinnerungsseite hochladen; Link mit Liebsten teilen."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/017119b0ec5f5649c005512454c5aa0a.png"
          imageAlt="Familie baut und malt zusammen"
          reverse={true}
        />
        
        <FAQDE />
        <FooterCTADE />
      </div>
      
      <FooterDE />
      
      {showUploadModal && (
        <UploadFormDE 
          onClose={() => setShowUploadModal(false)} 
          isNL={false}
        />
      )}
    </div>
  );
}