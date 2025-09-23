
'use client';

import { useState, useEffect } from 'react';

interface WelcomeSectionProps {
  onConfirm: () => void;
  showForm: boolean;
}

export default function WelcomeSection({ onConfirm, showForm }: WelcomeSectionProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setSparkles(newSparkles);
  }, []);

  if (showForm) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto text-center relative">
      {/* Floating sparkles animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: '3s'
            }}
          >
            <div className="w-2 h-2 bg-yellow-300 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Welcome content */}
      <div className="relative z-10 py-16">
        <div className="mb-12">
          <div 
            className="w-80 h-60 mx-auto rounded-3xl shadow-2xl mb-8 bg-cover bg-center bg-no-repeat bg-gradient-to-br from-pink-200 to-green-200"
            style={{
              backgroundImage: 'url(https://readdy.ai/api/search-image?query=cute%20toy%20figurine&width=320&height=240&seq=claim1&orientation=landscape)'
            }}
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Is this your Dreamli?
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          This magical model was made from a child's drawing. Let's make it yours.
        </p>

        {/* Ownership confirmation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-md mx-auto">
          <p className="text-lg text-gray-700 mb-6">
            Are you the person who received this Dreamli?
          </p>
          
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Yes, this is mine</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-heart-line text-lg"></i>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
