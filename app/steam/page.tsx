'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import TopBanner from '../components/TopBanner';
import SteamHeroSection from './SteamHeroSection';
import FoundersCircle from '../components/FoundersCircle';
import Benefits from '../components/Benefits';
import ProductIntroSection from '../components/ProductIntroSection';
import HowItWorks from '../components/HowItWorks';
import ScientificProof from '../components/ScientificProof';
import RoadmapSection from '../components/RoadmapSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CollapsibleSection from '../components/CollapsibleSection';
import UploadForm from '../components/UploadForm';
import MailchimpSubscriptionCoupon from '../components/MailchimpSubscriptionCoupon';

export default function SteamPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const foundersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Custom 3D Figure from Drawing — Paintable Kit for Kids | Dreamli";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Upload your child\'s drawing—our team 3D-models, 3D-prints and ships a ready-to-paint custom figure kit. Kid-safe materials, simple ordering, fast NL/EU delivery.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Upload your child\'s drawing—our team 3D-models, 3D-prints and ships a ready-to-paint custom figure kit. Kid-safe materials, simple ordering, fast NL/EU delivery.';
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
                <span className="text-sm font-bold text-purple-800">The Story Behind Dreamli</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Why We Believe Every Child Has 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Unlimited Potential</span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Children aren't born "gifted" or "talented." They become amazing through practice, nurture, and belief.
                </p>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-lightbulb-flash-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Our Founder's Discovery</h3>
                      <p className="text-gray-600">
                        "Those kitchen table math problems taught me that talent isn't born—it's nurtured through love and practice."
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
                  <span className="text-gray-600 text-sm">Every child deserves their moment to shine</span>
                </div>
              </div>
              
              <Link 
                href="/why"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap group"
              >
                <i className="ri-heart-line text-xl mr-3 group-hover:scale-110 transition-transform duration-300"></i>
                Discover the Full Story
                <i className="ri-arrow-right-line ml-3 group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            </div>
            
            {/* Right: Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <img 
                  src="https://readdy.ai/api/search-image?query=Warm%20kitchen%20scene%20with%20parent%20and%20child%20working%20together%20on%20creative%20project%2C%20soft%20morning%20light%20streaming%20through%20window%2C%20educational%20materials%20scattered%20on%20wooden%20table%2C%20nurturing%20family%20moment%2C%20cozy%20home%20atmosphere%2C%20books%20and%20art%20supplies%2C%20caring%20guidance%20during%20learning%2C%20emotional%20bonding%20through%20creativity%2C%20inspiring%20educational%20environment&width=800&height=600&seq=why-dreamli-moment&orientation=landscape"
                  alt="Parent and child creating together"
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
                  "Every great artist, scientist, and innovator started with someone who believed in their potential."
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
                <span className="text-xs sm:text-sm font-bold text-gray-900">Limited Time Offer</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4" style={{color: '#8472DF'}}>
                Lock in the Future at Today's Price
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-6 sm:mb-8 font-light leading-relaxed">
                Start with <span className="font-bold bg-gradient-to-r from-[#F6973E] to-[#C293F6] bg-clip-text text-transparent">3D figures today</span> → unlock <span className="font-bold bg-gradient-to-r from-[#4190F1] to-[#17E7F7] bg-clip-text text-transparent">AI & money skills tomorrow</span> → graduate to <span className="font-bold bg-gradient-to-r from-[#7A5D99] to-[#CB9AFF] bg-clip-text text-transparent">Dreamli Academy</span>
              </p>

              {/* Pricing Box */}
              <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20" style={{background: 'linear-gradient(to bottom right, #DBEAFE, #F3E8FF)'}}>
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mb-3 sm:mb-4">
                    <span className="text-xl sm:text-2xl lg:text-3xl text-black line-through">€99/mo</span>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{color: '#8472DF'}}>€54/mo</span>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                    <span className="text-sm sm:text-lg font-bold text-gray-900">40% Lifetime Discount</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">Secure 40% off for life</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex-shrink-0 mt-0.5">
                      <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                    </div>
                    <span className="text-sm sm:text-base text-black font-medium">Kids can earn back subscription through DreamCoins</span>
                  </div>
                </div>
              </div>

              {/* Urgency Box */}
              <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-blue-200/30">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <i className="ri-time-fill text-[#FFB067] text-lg sm:text-xl"></i>
                  <span className="text-black font-bold text-sm sm:text-lg text-center">Offer ends before Phase 2 launch</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={openUploadForm}
                className="w-full sm:w-auto bg-[#8472DF] hover:bg-[#7A6BD1] text-white px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-bold transition-all duration-300 cursor-pointer shadow-2xl transform hover:scale-105 mb-6 sm:mb-8 whitespace-nowrap"
              >
                Secure My Child's Future at 40% Off
              </button>

              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 pt-4 sm:pt-6 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-shield-check-fill text-green-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Safe Materials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-truck-fill text-blue-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-money-dollar-circle-fill text-yellow-600 text-xs sm:text-sm"></i>
                  </div>
                  <span className="text-xs sm:text-sm !text-black" style={{ color: '#000000 !important' }}>Money-Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right side image */}
            <div className="relative h-full mt-8 lg:mt-0">
              <Image 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a3351fce32ce4e385a382d36625b9750.webp" 
                alt="Child proudly showing their 3D creation" 
                width={600}
                height={600}
                className="w-full h-64 sm:h-80 lg:h-full lg:min-h-[600px] object-cover object-top rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-white/20"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              />
              
              {/* 40% OFF Badge - reduced animations on mobile */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full p-2 sm:p-4 shadow-2xl md:animate-pulse">
                <div className="text-center">
                  <div className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">40% OFF</div>
                  <div className="text-xs font-bold text-gray-900">FOR LIFE</div>
                </div>
              </div>

              {/* Phase indicators */}
              <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 space-y-2 sm:space-y-3">
                <button className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full group-hover:opacity-80 transition-all"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">Phase 1: Create (Live Now)</span>
                  </div>
                </button>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Phase 2: Learn & Earn (2025)</span>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Phase 3: Academy (2026)</span>
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
            title="Scientific Proof"
            subtitle="Research-backed benefits for child development"
            icon="ri-microscope-line"
            color="from-[#93C4FF] to-[#ACEEF3]"
          >
            <ScientificProof />
          </CollapsibleSection>

          {/* Adventure Roadmap - Collapsible */}
          <CollapsibleSection
            title="Our Adventure Roadmap"
            subtitle="The future phases of Dreamli's evolution"
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
                <div className="text-white font-semibold mb-2">Netherlands Made</div>
                <div className="text-sm text-gray-400">Crafted locally with experienced hands and safe materials</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-shield-check-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Child-Safe Materials</div>
                <div className="text-sm text-gray-400">Non-toxic PLA+ that's designed for little ones</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-truck-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Free Shipping</div>
                <div className="text-sm text-gray-400">No hidden costs anywhere in Europe</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFA726] to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-checkbox-circle-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Simple 3-Step Process</div>
                <div className="text-sm text-gray-400">Upload, confirm, receive—that's it</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lock-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Private Memory Page</div>
                <div className="text-sm text-gray-400">You control what's shared and with whom</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-time-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Fast Delivery</div>
                <div className="text-sm text-gray-400">5-10 working days from order to doorstep</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm 
          type="steam"
          pricingField="steamPrice"
          onClose={closeUploadForm}
        />
      )}

      {/* Lead Magnet Popup */}
      <MailchimpSubscriptionCoupon />
    </div>
  );
}