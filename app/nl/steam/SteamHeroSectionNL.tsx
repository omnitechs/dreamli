'use client';

import { useState, useEffect } from 'react';
import UploadForm from '../../components/UploadForm';
import Link from 'next/link';
import Image from 'next/image';
import SteamScatteredCardGalleryNL from './SteamScatteredCardGalleryNL';

interface SteamHeroSectionNLProps {
  onOpenUploadForm?: () => void;
}

export default function SteamHeroSectionNL({ onOpenUploadForm }: SteamHeroSectionNLProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleOpenUploadForm = () => {
    if (onOpenUploadForm) {
      onOpenUploadForm();
    } else {
      setShowUploadForm(true);
    }
  };

  const closeUploadForm = () => {
    setShowUploadForm(false);
  };

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <h1 className="font-bold leading-tight text-gray-900" style={{ fontSize: '3rem' }}>
                De kindertijd is kort. De herinneringen vormen <span className="text-[#8472DF]">een leven lang</span>.
              </h1>
              
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#8472DF] mb-6 sm:mb-8 font-light leading-relaxed">
                Verander de tekening van je kind in herinneringen die leven in het dagelijks leven—en worden de kernherinneringen die voor altijd blijven.
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed font-normal max-w-xl">
                Deze vroege jaren vormen de overtuigingen, het zelfvertrouwen en de kijk op wat mogelijk is van onze kinderen. De meeste kostbare momenten drijven weg, maar sommige verdienen het om te blijven. Dreamli helpt families de creativiteit van hun kind om te zetten in betekenisvolle herinneringen die onderdeel worden van het dagelijks leven—en kernherinneringen creëren die bepalen wie ze worden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <button 
                  onClick={handleOpenUploadForm}
                  className="bg-[#8472DF] text-white px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#7A66D9] transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-105 text-center w-full sm:w-auto max-w-full break-words whitespace-nowrap"
                >
                  Maak De Tekening Van Mijn Kind Echt
                </button>
              </div>

              {/* Risk-free promise box */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-transparent bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 shadow-lg max-w-xl" style={{backgroundClip: 'padding-box', border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #93C4FF, #ACEEF3)', backgroundOrigin: 'border-box'}}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-fill text-white text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333333] text-lg mb-2">100% Risicovrije Belofte</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Deel een foto van je kind met hun 3D creatie en we betalen je hele bestelling terug. Geen vragen gesteld. Want we weten dat ze het geweldig zullen vinden!
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-fill text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] text-sm">Veilige Materialen</p>
                    <p className="text-gray-500 text-xs">Kindvriendelijke verf</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-truck-fill text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333] text-sm">Snelle Levering</p>
                    <p className="text-gray-500 text-xs">5-10 werkdagen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Scattered Card Gallery (Steam-specific) */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[600px] flex items-center justify-center">
              <SteamScatteredCardGalleryNL 
                className="w-full h-full max-w-lg mx-auto"
              />

              {/* Decorative elements */}
              <div className="hidden sm:block absolute top-1/4 left-1/4 w-6 h-6 bg-[#FFA726] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }}></div>
              <div className="hidden sm:block absolute bottom-1/3 left-1/6 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="hidden sm:block absolute top-1/3 right-1/4 w-5 h-5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }}></div>

              {/* Floating icons */}
              <div className="hidden lg:block absolute top-8 left-1/2 animate-float opacity-40" style={{ animationDelay: '0s' }}>
                <i aria-hidden="true" className="ri-palette-fill text-3xl text-[#FFA726]"></i>
              </div>
              <div className="hidden lg:block absolute bottom-16 left-12 animate-float opacity-40" style={{ animationDelay: '1s' }}>
                <i aria-hidden="true" className="ri-brush-fill text-3xl text-purple-400"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm onClose={closeUploadForm} />
      )}
    </>
  );
}