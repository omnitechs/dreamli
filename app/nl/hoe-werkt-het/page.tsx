
'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import StepSectionNL from './StepSectionNL';
import FooterCTANL from './FooterCTANL';
import FAQNL from './FAQNL';
import Header from '../../components/Header';
import FooterNL from '../../components/FooterNL';
import UploadForm from '../../components/UploadForm';

export default function HoeWerktHetPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    document.title = "Hoe het werkt: van tekening naar 3D-beeldje in 4 stappen | Dreamli";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Uploaden (foto of scan), 3D-modelleren, 3D-printen en schilderen. Jij keurt het 3D-model goed en ontvangt een schilderklare set met penselen en verf.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Uploaden (foto of scan), 3D-modelleren, 3D-printen en schilderen. Jij keurt het 3D-model goed en ontvangt een schilderklare set met penselen en verf.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleStartForFree = () => {
    setShowUploadModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.textContent?.includes('Start Gratis') || target.closest('button')?.textContent?.includes('Start Gratis')) {
          e.preventDefault();
          handleStartForFree();
        }
      }}>
        <StepSectionNL
          stepNumber={1}
          title="Upload Tekening"
          blurb="Verwijder verwarring; het is makkelijk."
          substeps={[
            "Start Gratis — Klik op elke call-to-action om te beginnen.",
            "Upload de tekening — Foto of scan is prima.",
            "Voeg kind & contact toe — Naam, leeftijd, e-mail; telefoon optioneel.",
            "Veilige checkout — Betaal veilig om je project te creëren."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png"
          imageAlt="Upload Tekening Proces"
        />
        
        <StepSectionNL
          stepNumber={2}
          title="Bekijk & Bevestig"
          blurb="Zie en keur goed voordat we printen."
          substeps={[
            "Account / Inloggen — Stel een wachtwoord in via e-mail of gebruik Google.",
            "Bestellingen — Je dashboard toont elke bestelling.",
            "Geheugen Pagina — Een live tijdlijn van updates en bestanden.",
            "3D Voorvertoning & Revisies — Bekijk het model; keur goed of vraag tot 3 wijzigingen aan."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5b6120a5cd542ee7eeb0ff23c5c818da.png"
          imageAlt="3D Voorvertoning en Dashboard"
          reverse={true}
        />
        
        <StepSectionNL
          stepNumber={3}
          title="Wij Maken Het"
          blurb="We bouwen met zorg en kwaliteit."
          substeps={[
            "3D Printen — Na goedkeuring printen we en controleren de kwaliteit.",
            "Leeftijd-Slimme Verfkit — Penselen en verf afgestemd op leeftijd en stijl.",
            "Verzending & Tracking — Veilig verpakt; updates naar je e-mail gestuurd."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5cf087223314587d8aa5957dc16f184b.png"
          imageAlt="3D Print Proces"
        />
        
        <StepSectionNL
          stepNumber={4}
          title="Bouwen & Verven"
          blurb="Maak samen herinneringen, deel ze dan."
          substeps={[
            "Bouwen, Verven & Delen — Verf thuis; upload foto's en video's naar de Geheugen Pagina; deel de link met geliefden."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/017119b0ec5f5649c005512454c5aa0a.png"
          imageAlt="Familie Bouwen en Samen Verven"
          reverse={true}
        />
        
        <FAQNL />
        <FooterCTANL />
      </div>
      
      <FooterNL />
      
      {showUploadModal && (
        <UploadForm 
          onClose={() => setShowUploadModal(false)} 
          isNL={true}
        />
      )}
    </div>
  );
}
