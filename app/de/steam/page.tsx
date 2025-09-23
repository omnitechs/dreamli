
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import TopBanner from '../../components/TopBanner';
import SteamHeroSection from '../../steam/SteamHeroSection';
import FoundersCircle from '../../components/FoundersCircle';
import Benefits from '../../components/Benefits';
import ProductIntroSection from '../../components/ProductIntroSection';
import HowItWorks from '../../components/HowItWorks';
import ScientificProof from '../../components/ScientificProof';
import RoadmapSection from '../../components/RoadmapSection';
import Header from '../components/HeaderDE';
import Footer from '../components/FooterDE';
import CollapsibleSection from '../../components/CollapsibleSection';
import UploadFormDE from './UploadFormDE';
import MailchimpSubscriptionCoupon from '../../components/MailchimpSubscriptionCoupon';

export default function SteamPageDE() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const foundersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Individuelle 3D-Figur aus Zeichnung — Bemalbares Kit für Kinder | Dreamli";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Laden Sie die Zeichnung Ihres Kindes hoch—unser Team modelliert in 3D, druckt in 3D und versendet ein fertiges bemalbares Figurenkit. Kindersichere Materialien, einfache Bestellung, schnelle DE/EU-Lieferung.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Laden Sie die Zeichnung Ihres Kindes hoch—unser Team modelliert in 3D, druckt in 3D und versendet ein fertiges bemalbares Figurenkit. Kindersichere Materialien, einfache Bestellung, schnelle DE/EU-Lieferung.';
      document.head.appendChild(meta);
    }
  }, []);

  const openUploadForm = () => setShowUploadForm(true);
  const closeUploadForm = () => setShowUploadForm(false);

  return (
    <div className="min-h-screen">
      <Header />
      <SteamHeroSection onOpenUploadForm={openUploadForm} />
      <Benefits />
      
      {/* Why We Do This Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
                <span className="text-sm font-bold text-purple-800">Die Geschichte hinter Dreamli</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Warum wir glauben, dass jedes Kind 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> unbegrenztes Potenzial hat</span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Kinder werden nicht "begabt" oder "talentiert" geboren. Sie werden durch Übung, Pflege und Glauben erstaunlich.
                </p>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-lightbulb-flash-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Die Entdeckung unseres Gründers</h3>
                      <p className="text-gray-600">
                        "Diese Matheaufgaben am Küchentisch lehrten mich, dass Talent nicht geboren wird—es wird durch Liebe und Übung gefördert."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">Jedes Kind verdient seinen Moment zum Strahlen</span>
                </div>
              </div>
              
              <Link 
                href="/de/warum"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap group"
              >
                <i className="ri-heart-line text-xl mr-3 group-hover:scale-110 transition-transform duration-300"></i>
                Die ganze Geschichte entdecken
                <i className="ri-arrow-right-line ml-3 group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            </div>
            
            {/* Right: Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <img 
                  src="https://readdy.ai/api/search-image?query=Warm%20kitchen%20scene%20with%20parent%20and%20child%20working%20together%20on%20creative%20project%2C%20soft%20morning%20light%20streaming%20through%20window%2C%20educational%20materials%20scattered%20on%20wooden%20table%2C%20nurturing%20family%20moment%2C%20cozy%20home%20atmosphere%2C%20books%20and%20art%20supplies%2C%20caring%20guidance%20during%20learning%2C%20emotional%20bonding%20through%20creativity%2C%20inspiring%20educational%20environment&width=800&height=600&seq=why-dreamli-moment&orientation=landscape"
                  alt="Elternteil und Kind erschaffen zusammen"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-2xl shadow-lg animate-bounce">
                <i className="ri-star-fill text-2xl"></i>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-emerald-400 text-white p-4 rounded-2xl shadow-lg" style={{animation: 'bounce 2s infinite', animationDelay: '1s'}}>
                <i className="ri-magic-line text-2xl"></i>
              </div>
              
              {/* Quote Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <p className="text-sm font-medium text-gray-800 italic">
                  "Jeder große Künstler, Wissenschaftler und Innovator begann mit jemandem, der an ihr Potenzial glaubte."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductIntroSection />
      <HowItWorks />
      <div ref={foundersRef}>
        <FoundersCircle />
      </div>
      
      {/* Lock in the Future at Today's Price Section */}
      <div className="py-12 md:py-24 bg-white relative overflow-hidden min-h-screen flex items-center">
        {/* Reduced animations on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${10 + i * 7}%`,
                top: `${15 + (i * 13) % 80}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            >
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40"></div>
            </div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-left text-gray-900">
              <div className="inline-block bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm font-bold text-gray-900">Zeitlich begrenztes Angebot</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4" style={{color: '#8472DF'}}>
                Sichern Sie sich die Zukunft zum heutigen Preis
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-6 sm:mb-8 font-light leading-relaxed">
                Beginnen Sie mit <span className="font-bold bg-gradient-to-r from-[#F6973E] to-[#C293F6] bg-clip-text text-transparent">3D-Figuren heute</span> → schalten Sie <span className="font-bold bg-gradient-to-r from-[#4190F1] to-[#17E7F7] bg-clip-text text-transparent">KI & Finanzfähigkeiten morgen</span> frei → absolvieren Sie zur <span className="font-bold bg-gradient-to-r from-[#7A5D99] to-[#CB9AFF] bg-clip-text text-transparent">Dreamli Akademie</span>
              </p>

              {/* Pricing Box */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20" style={{background: 'linear-gradient(to bottom right, #DBEAFE, #F3E8FF)'}}>
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl lg:text-3xl text-black line-through">€99/Mo</span>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{color: '#8472DF'}}>€54/Mo</span>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                    <span className="text-sm sm:text-lg font-bold text-gray-900">40% Lebenslanger Rabatt</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">40% Rabatt fürs Leben sichern</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">Jederzeit kündbar</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">Kinder können das Abonnement durch DreamCoins zurückverdienen</span>
                  </div>
                </div>
              </div>

              {/* Urgency Box */}
              <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-blue-200/30">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <i className="ri-time-fill text-[#FFB067] text-lg sm:text-xl"></i>
                  <span className="text-black font-bold text-sm sm:text-lg text-center">Angebot endet vor Phase 2 Start</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={openUploadForm}
                className="w-full sm:w-auto bg-[#8472DF] hover:bg-[#7A6BD1] text-white px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-bold transition-all duration-300 cursor-pointer shadow-2xl transform hover:scale-105 mb-6 sm:mb-8 whitespace-nowrap"
              >
                Die Zukunft meines Kindes mit 40% Rabatt sichern
              </button>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 pt-4 sm:pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-shield-check-fill text-green-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Sichere Materialien</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-truck-fill text-blue-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Schnelle Lieferung</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-money-dollar-circle-fill text-yellow-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Geld-zurück-Garantie</span>
                </div>
              </div>
            </div>

            {/* Right side image */}
            <div className="relative h-full mt-8 lg:mt-0">
              <Image 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a3351fce32ce4e385a382d36625b9750.webp" 
                alt="Kind zeigt stolz seine 3D-Kreation" 
                width={600}
                height={600}
                className="w-full h-64 sm:h-80 lg:h-full lg:min-h-[600px] object-cover object-top rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-white/20"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
              
              {/* 40% OFF Badge - reduced animations on mobile */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full p-2 sm:p-4 shadow-2xl md:animate-pulse">
                <div className="text-center">
                  <div className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">40% RABATT</div>
                  <div className="text-xs font-bold text-gray-900">FÜRS LEBEN</div>
                </div>
              </div>

              {/* Phase indicators */}
              <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 space-y-2 sm:space-y-3">
                <button className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full group-hover:opacity-80 transition-all"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">Phase 1: Erschaffen (Live Jetzt)</span>
                  </div>
                </button>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Phase 2: Lernen & Verdienen (2025)</span>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Phase 3: Akademie (2026)</span>
                  </div>
                </div>
              </div>

              {/* Floating DreamCoins - hidden on mobile for performance */}
              <div className="hidden md:block">
                <div className="absolute top-20 sm:top-32 left-4 sm:left-8 animate-bounce" style={{animationDelay: '0s'}}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center shadow-lg">
                    <i className="ri-coins-fill text-gray-900 text-xs sm:text-sm"></i>
                  </div>
                </div>
                <div className="absolute top-28 sm:top-48 right-8 sm:right-12 animate-bounce" style={{animationDelay: '1s'}}>
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center shadow-lg">
                    <i className="ri-coins-fill text-gray-900 text-xs"></i>
                  </div>
                </div>
                <div className="absolute bottom-20 sm:bottom-32 right-4 sm:right-8 animate-bounce" style={{animationDelay: '2s'}}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center shadow-lg">
                    <i className="ri-coins-fill text-gray-900 text-sm sm:text-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Collapsible Sections Container */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Scientific Proof - Collapsible */}
          <CollapsibleSection
            title="Wissenschaftlicher Beweis"
            subtitle="Forschungsbasierte Vorteile für die kindliche Entwicklung"
            icon="ri-microscope-line"
            color="from-[#93C4FF] to-[#ACEEF3]"
          >
            <ScientificProof />
          </CollapsibleSection>

          {/* Adventure Roadmap - Collapsible */}
          <CollapsibleSection
            title="Unsere Abenteuer-Roadmap"
            subtitle="Die zukünftigen Phasen der Dreamli-Evolution"
            icon="ri-route-line"
            color="from-[#FFB067] to-[#F3E8FF]"
          >
            <RoadmapSection />
          </CollapsibleSection>

        </div>
      </div>
      
      {/* Trust Signals/Dreamli Difference */}
      <section className="py-16 bg-gradient-to-r from-[#333333] via-gray-800 to-[#333333]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8472DF] to-[#7A66D9] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-map-pin-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">In Deutschland hergestellt</div>
                <div className="text-sm text-gray-400">Lokal mit erfahrenen Händen und sicheren Materialien gefertigt</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-shield-check-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Kindersichere Materialien</div>
                <div className="text-sm text-gray-400">Ungiftiges PLA+, entwickelt für die Kleinen</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-truck-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Kostenloser Versand</div>
                <div className="text-sm text-gray-400">Keine versteckten Kosten überall in Europa</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFA726] to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-checkbox-circle-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Einfacher 3-Schritte-Prozess</div>
                <div className="text-sm text-gray-400">Hochladen, bestätigen, erhalten—das war's</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lock-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Private Erinnerungsseite</div>
                <div className="text-sm text-gray-400">Sie kontrollieren, was geteilt wird und mit wem</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-time-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Schnelle Lieferung</div>
                <div className="text-sm text-gray-400">5-10 Werktage von der Bestellung bis zur Haustür</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadFormDE 
          onClose={closeUploadForm}
          type="steam"
          pricingField="steamPrice"
        />
      )}

      {/* Lead Magnet Popup */}
      <MailchimpSubscriptionCoupon />
    </div>
  );
}
