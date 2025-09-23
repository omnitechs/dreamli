'use client';

import { useState } from 'react';

interface SchoolsTopBannerDEProps {
  onRequestPilot: () => void;
}

export default function SchoolsTopBannerDE({ onRequestPilot }: SchoolsTopBannerDEProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#FFA726] text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-lg font-bold">
              Testplätze für Semesterbeginn offen — Risikofreier Pilot für Groninger Schulen & BSO. Begrenzte Plätze.
            </p>
          </div>
          
          <button
            onClick={onRequestPilot}
            className="text-white hover:text-white/80 font-semibold flex items-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            <span>Pilotprojekt anfordern</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/80 hover:text-white w-6 h-6 flex items-center justify-center cursor-pointer"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
}