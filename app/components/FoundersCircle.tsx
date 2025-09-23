
'use client';

import { useState } from 'react';
import UploadForm from './UploadForm';

export default function FoundersCircle() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const spotsRemaining = 12;

  const items = [
    { name: "Their very first practice figurine to get excited about the process", value: 20 },
    { name: "Professional painting supplies to bring their creation to life", value: 15 },
    { name: "Their custom 3D figurine from their own drawing", value: 89 },
    { name: "A personal memory page to document this magical moment", value: 20, note: "Share and earn: €1 per like, €2 per comment, €0.5 per view" },
    { name: "5 keychains that connect to your child's memory page - tap any phone and instantly see their drawing, the creation process, and their proud moment holding the final figurine", value: 25 },
    { name: "50% off your next order (because one figurine is never enough)", value: 68.5, note: "For you or your loved ones" },
    { name: "40% lifetime discount for Dreamli Academy + learn and earn", value: 0, note: "Priceless" },
    { name: "The pride of knowing you gave your child this unforgettable experience", value: 0, note: "Priceless" }
  ];

  const totalValue = 237.5;
  const youPay = 137;
  const totalSavings = 100.5;

  return (
    <>
      <section id="founders-circle" className="py-12 md:py-20 bg-gradient-to-br from-[#DBEAFE] to-[#F3E8FF] max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-w-0">
            {/* Content - Now centered */}
            <div className="space-y-6 md:space-y-8 max-w-4xl min-w-0">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-[#F5F5F5] text-[#8472DF] px-3 py-2 md:px-4 rounded-full border border-[#8472DF]/20">
                  <i className="ri-vip-crown-fill text-sm"></i>
                  <span className="font-semibold text-sm md:text-base">Exclusive Founders' Circle</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Help Us Launch Dreamli —{' '}
                <span className="text-[#8472DF]">Make It Free</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center" suppressHydrationWarning={true}>
                Join our first 20 families and get Dreamli's full €137 custom service, free.
                <br />
                <strong>Share your photos, a review, and your Dreamli's on us.</strong>
              </p>

              {/* What's Included - Detailed Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#333333] text-center">What You Get:</h3>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <i className="ri-check-line text-white text-xs md:text-sm"></i>
                            </div>
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium text-sm md:text-base">{item.name}</span>
                              {item.note && (
                                <p className="text-gray-500 text-xs md:text-sm mt-1">{item.note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {item.value > 0 && (
                          <span className="text-black font-bold text-sm md:text-base ml-4 flex-shrink-0">€{item.value}</span>
                        )}
                        {item.value === 0 && (
                          <span className="text-[#8472DF] font-bold text-sm md:text-base ml-4 flex-shrink-0">Priceless</span>
                        )}
                      </div>
                    ))}

                    {/* Total Value */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-bold text-gray-800">Total Value:</span>
                        <span className="text-xl md:text-2xl font-bold text-black">€{totalValue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 border border-green-200">
                  <div className="space-y-4">
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">Your Investment:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-semibold text-black">€{totalValue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">You Pay:</span>
                        <span className="font-semibold text-black">€{youPay}</span>
                      </div>
                      <div className="border-t border-[#8472DF] pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#8472DF]">You Save:</span>
                          <span className="text-xl font-bold text-[#8472DF]">€{totalSavings}</span>
                        </div>
                      </div>
                      <div className="bg-[#EAE7FA] text-gray-800 rounded-xl p-3 text-center">
                        <p className="font-bold text-lg">Plus: 100% Refund After Sharing!</p>
                        <p className="text-sm opacity-90">Get your €137 back when you share your experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Works Section */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                    Why this works for us:
                  </h4>
                  <p className="text-blue-700 text-sm md:text-base">
                    Your child's joy becomes the inspiration that helps other parents discover this magic.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-lg md:text-xl font-bold text-purple-800 mb-3">
                    Why this works for you:
                  </h4>
                  <p className="text-purple-700 text-sm md:text-base">
                    Zero risk, maximum reward, and you're part of something bigger than just buying a toy.
                  </p>
                </div>
              </div>

              {/* Scarcity Indicator */}
              <div className="bg-[#F5F5F5] border border-purple-200 rounded-2xl p-4 md:p-6">
                <div className="flex items-start md:items-center space-x-3 md:space-x-4 justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-fire-fill text-white text-lg md:text-xl"></i>
                  </div>
                  <div className="min-w-0 text-center">
                    <p className="font-bold text-[#8472DF] text-base md:text-lg">
                      Only {spotsRemaining} spots remaining!
                    </p>
                    <p className="text-[#8472DF] text-sm md:text-base break-words">
                      Join now before this exclusive offer expires
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2 md:pt-4 flex justify-center">
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-[#8472DF] text-white px-8 py-5 md:px-12 md:py-6 rounded-full text-lg md:text-xl font-bold hover:bg-[#7562D1] transition-all duration-300 cursor-pointer shadow-2xl transform hover:scale-105 w-full sm:w-auto text-center min-w-fit"
                >
                  🎨 Claim My Spot — 100% Refunded After Sharing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}
