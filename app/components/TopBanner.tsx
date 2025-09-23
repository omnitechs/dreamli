
'use client';

import { useState } from 'react';

interface TopBannerProps {
  onLearnMoreClick: () => void;
}

export default function TopBanner({ onLearnMoreClick }: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToFoundersCircle = () => {
    const foundersSection = document.getElementById('founders-circle');
    if (foundersSection) {
      foundersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#DBEAFE] text-black py-3 px-4 relative" data-top-banner>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <p className="text-lg md:text-xl font-bold cursor-pointer hover:underline" onClick={scrollToFoundersCircle}>
              🎨 Founders Circle — First 20 families get our €137 custom 3D figure service FREE in exchange for photos & feedback.
              <span className="ml-2 inline-flex items-center">
                Learn More →
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black/80 hover:text-black w-6 h-6 flex items-center justify-center cursor-pointer"
      >
        <i className="ri-close-line text-lg"></i>
      </button>
    </div>
  );
}
