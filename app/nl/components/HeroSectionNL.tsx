
'use client';

import { useState, useEffect } from 'react';
import UploadForm from '../../components/UploadForm';
import Link from 'next/link';

interface HeroSectionNLProps {
  onOpenUploadForm?: () => void;
}

export default function HeroSectionNL({ onOpenUploadForm }: HeroSectionNLProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setImagesLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render animations until client-side
  if (!isClient) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#333333] leading-tight">
                Eindelijk Komen Hun Tekeningen
                <span className="text-[#8472DF] block">Tot Leven</span>
              </h1>
              
              <h2 className="text-xl lg:text-2xl text-[#8472DF] font-semibold leading-relaxed max-w-xl">
                Zie de ogen van je kind stralen wanneer ze hun eigen gepersonaliseerde 3D-speelgoed vasthouden, gemaakt van hun tekening
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-normal max-w-xl">
                Transformeer de tekeningen van je kind in op maat gemaakte 3D-figuren met onze creatieve kits. Deze educatieve STEAM-speelgoed zetten verbeelding om in gepersonaliseerde 3D-speelgoed en ontwikkelen ruimtelijk denken en probleemoplossingsvaardigheden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <button 
                  onClick={handleOpenUploadForm}
                  className="bg-[#8472DF] text-white px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#7A66D9] transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-105 text-center w-full sm:w-auto max-w-full break-words leading-tight"
                >
                  <span className="block sm:hidden">Maak Tekening<br />Werkelijkheid</span>
                  <span className="hidden sm:block">Maak De Tekening Van Mijn Kind Werkelijkheid</span>
                </button>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border-2 border-transparent bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 shadow-lg max-w-xl" style={{backgroundClip: 'padding-box', border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #93C4FF, #ACEEF3)', backgroundOrigin: 'border-box'}}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-fill text-white text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333333] text-lg mb-2">100% Risicovrije Belofte</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Deel een foto van je kind met hun 3D-creatie en we storten je volledige bestelling terug. Geen vragen gesteld. Zo zeker zijn we ervan dat ze het geweldig zullen vinden!
                    </p>
                  </div>
                </div>
              </div>

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
                    <p className="text-gray-500 text-xs">3-10 werkdagen</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[600px] flex items-start justify-center overflow-hidden">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/618d433982e6a541bbed58f40346d0ad.webp" 
                  alt="Lachend meisje houdt haar tekening en een 3D-geprinte figuur ervan vast" 
                  className="w-64 sm:w-80 h-80 sm:h-96 object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-20 lg:py-24 overflow-hidden" suppressHydrationWarning>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#333333] leading-tight">
                Eindelijk Komen Hun Tekeningen
                <span className="text-[#8472DF] block">Tot Leven</span>
              </h1>
              
              <h2 className="text-xl lg:text-2xl text-[#8472DF] font-semibold leading-relaxed max-w-xl">
                Zie de ogen van je kind stralen wanneer ze hun eigen gepersonaliseerde 3D-speelgoed vasthouden, gemaakt van hun tekening
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-normal max-w-xl">
                Transformeer de tekeningen van je kind in op maat gemaakte 3D-figuren met onze creatieve kits. Deze educatieve STEAM-speelgoed zetten verbeelding om in gepersonaliseerde 3D-speelgoed en ontwikkelen ruimtelijk denken en probleemoplossingsvaardigheden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <button 
                  onClick={handleOpenUploadForm}
                  className="bg-[#8472DF] text-white px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#7A66D9] transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-105 text-center w-full sm:w-auto max-w-full break-words leading-tight"
                >
                  <span className="block sm:hidden">Maak Tekening<br />Werkelijkheid</span>
                  <span className="hidden sm:block">Maak De Tekening Van Mijn Kind Werkelijkheid</span>
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
                      Deel een foto van je kind met hun 3D-creatie en we storten je volledige bestelling terug. Geen vragen gesteld. Zo zeker zijn we ervan dat ze het geweldig zullen vinden!
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
                    <p className="text-gray-500 text-xs">3-10 werkdagen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Optimized image cluster */}
            <div className="relative lg:h-[600px] flex items-start justify-center overflow-hidden">
              {/* Main central image - prioritized loading */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/618d433982e6a541bbed58f40346d0ad.webp" 
                  alt="Lachend meisje houdt haar tekening en een 3D-geprinte figuur ervan vast" 
                  className="w-64 sm:w-80 h-80 sm:h-96 object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Lazy load floating images only after main image */}
              {imagesLoaded && (
                <>
                  {/* Top-left floating image */}
                  <div className="absolute top-8 left-4 w-24 sm:w-32 h-24 sm:h-32 rounded-2xl overflow-hidden shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300 z-5">
                    <img 
                      src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d1b9f2c73d16581a1d3d8e47828f4689.webp" 
                      alt="Lachend meisje houdt een tekening van een olifant en een bijpassende 3D-geprinte figuur vast" 
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  {/* Top-right floating image */}
                  <div className="absolute top-8 right-8 w-20 sm:w-28 h-28 sm:h-36 rounded-2xl overflow-hidden shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300 z-5">
                    <img 
                      src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/e9e64d632489530d3d9873d5ab3b0063.webp" 
                      alt="Jonge jongen toont zijn robot tekening en een op maat gemaakt 3D-geprint speelgoed ervan" 
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom-right floating image */}
                  <div className="absolute bottom-12 right-4 w-28 sm:w-36 h-20 sm:h-28 rounded-2xl overflow-hidden shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300 z-5">
                    <img 
                      src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a56ecd490581a2e2b26e74b7fbb1e085.webp" 
                      alt="Lachende jongen houdt zijn groene robot tekening naast een gepersonaliseerd 3D-geprint model" 
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </>
              )}

              {/* Simplified decorative elements - fewer animations on mobile */}
              <div className="hidden sm:block absolute top-1/4 left-1/4 w-6 h-6 bg-[#FFA726] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }}></div>
              <div className="hidden sm:block absolute bottom-1/3 left-1/6 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="hidden sm:block absolute top-1/3 right-1/4 w-5 h-5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2s' }}></div>

              {/* Floating icons - hidden on mobile */}
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
        <UploadForm onClose={closeUploadForm} isNL={true} />
      )}
    </>
  );
}
