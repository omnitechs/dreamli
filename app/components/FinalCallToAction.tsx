
'use client';

import { useState, useEffect } from 'react';
import UploadForm from './UploadForm';

export default function FinalCallToAction() {
  const [sparkles, setSparkles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Generate stars only on client side to prevent hydration mismatch
  useEffect(() => {
    const generatedSparkles = Array.from({ length:15 }, (_, i) => ({
      left: `${(i * 7 + 10) % 90}%`,
      top: `${(i * 13 + 15) % 85}%`,
      delay: `${(i * 0.4) % 3}s`,
      duration: `${3 + (i % 2)}s`
    }));
    setSparkles(generatedSparkles);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Floating sparkles animation */}
      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning={true}>
        {sparkles.map((sparkle, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration
            }}
          >
            <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="text-left text-white">
            <div className="inline-block bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm font-bold text-gray-900">Limited Time Offer</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 font-[\\\'Nunito\\\']">
              Lock in the Future at Today's Price
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 font-light leading-relaxed">
              Start with <span className="font-bold bg-gradient-to-r from-[#F6973E] to-[#C293F6] bg-clip-text text-transparent">3D figures today</span> → unlock <span className="font-bold bg-gradient-to-r from-[#4190F1] to-[#17E7F7] bg-clip-text text-transparent">AI & money skills tomorrow</span> → graduate to <span className="font-bold bg-gradient-to-r from-[#7A5D99] to-[#CB9AFF] bg-clip-text text-transparent">Dreamli Academy</span>
            </p>

            {/* Pricing Block */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20">
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl lg:text-3xl text-black line-through">€99/mo</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">€54/mo</span>
                </div>
                <div className="inline-block bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <span className="text-sm sm:text-lg font-bold text-gray-900">40% Lifetime Discount</span>
                </div>
              </div>

              {/* Benefits List */}
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
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-check-line text-white text-xs sm:text-sm font-bold"></i>
                  </div>
                  <span className="text-sm sm:text-base text-black font-medium">Kids can earn back subscription through DreamCoins</span>
                </div>
              </div>
            </div>

            {/* Urgency Line */}
            <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 border border-blue-200/30">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <i className="ri-time-fill text-[#FFB067] text-lg sm:text-xl"></i>
                <span className="text-black font-bold text-sm sm:text-lg text-center">Offer ends before Phase 2 launch</span>
              </div>
            </div>

            <button
              onClick={() => setShowUploadForm(true)}
              className="w-full sm:w-auto text-white px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl font-bold transition-all duration-300 cursor-pointer shadow-2xl transform hover:scale-105 mb-6 sm:mb-8 whitespace-nowrap"
              style={{ backgroundColor: '#8472DF !important', borderColor: '#8472DF !important' }}
            >
              Secure My Child's Future at 40% Off
            </button>

            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 pt-4 sm:pt-6 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-fill text-green-600 text-xs sm:text-sm"></i>
                </div>
                <span className="text-xs sm:text-sm" style={{ color: '#000000 !important' }}>Safe Materials</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-truck-fill text-blue-600 text-xs sm:text-sm"></i>
                </div>
                <span className="text-xs sm:text-sm" style={{ color: '#000000 !important' }}>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-money-dollar-circle-fill text-yellow-600 text-xs sm:text-sm"></i>
                </div>
                <span className="text-xs sm:text-sm" style={{ color: '#000000 !important' }}>Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Image Content - Child with Roadmap Path */}
          <div className="relative h-full mt-8 lg:mt-0">
            <img 
              src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a3351fce32ce4e385a382d36625b9750.webp"
              alt="Happy girl holding her mouse drawing with a matching custom 3D printed figurine"
              className="w-full h-64 sm:h-80 lg:h-full lg:min-h-[600px] object-cover object-top rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-white/20"
              width={600}
              height={600}
            />
            
            {/* Floating 40% Off Badge */}
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full p-2 sm:p-4 shadow-2xl animate-pulse">
              <div className="text-center">
                <div className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">40% OFF</div>
                <div className="text-xs font-bold text-gray-900">FOR LIFE</div>
              </div>
            </div>
            
            {/* Phase Indicators */}
            <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 space-y-2 sm:space-y-3">
              <button 
                onClick={() => setShowUploadForm(true)}
                className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg hover:bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full group-hover:opacity-90 transition-all"></div>
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

            {/* Floating Coins */}
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

      {/* Upload Form Modal */}
      {showUploadForm && <UploadForm onClose={() => setShowUploadForm(false)} />}
    </section>
  );
}
