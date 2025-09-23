
'use client';

import { useState } from 'react';

const packages = [
  {
    name: "Standard Keepsake Kit",
    price: "€89",
    subtitle: "Perfect for trying us out",
    features: [
      "One 4-color figurine",
      "Made in Netherlands", 
      "Safe materials"
    ],
    buttonText: "Choose Standard",
    popular: false,
    color: "blue"
  },
  {
    name: "Gift Pack", 
    price: "€137",
    subtitle: "Everything you need",
    features: [
      "Everything in Standard",
      "5 tap-to-view keychains",
      "Lithophane nightlight", 
      "Fridge magnet",
      "Paintable option available"
    ],
    buttonText: "Choose Gift Pack",
    popular: true,
    color: "purple"
  },
  {
    name: "STEAM Gift Pack",
    price: "€238", 
    subtitle: "Educational & creative experience",
    features: [
      "Everything in Gift Pack",
      "Extra figurine for sharing",
      "8-color figurines",
      "Extra white figurine with coloring kit",
      "Shop product or gift card choice",
      "Free second shipment with gift card",
      "Personalized time capsule",
      "Share & Earn referral program",
      "Free shipping + premium packaging"
    ],
    buttonText: "Choose STEAM Pack",
    popular: false,
    color: "orange",
    hasTooltips: true
  }
];

interface PackageOptionsProps {
  onUploadFormOpen: (type: string, pricingField: string) => void;
}

export default function PackageOptions({ onUploadFormOpen }: PackageOptionsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getColorClasses = (color: string, isPopular: boolean) => {
    const baseColors = {
      blue: {
        accent: "from-[#93C4FF] to-[#ACEEF3]",
        button: "bg-[#8472DF] hover:bg-[#7A66D9]",
        dot: "bg-[#8472DF]",
        price: "text-[#8472DF]"
      },
      purple: {
        accent: "from-[#8472DF] to-[#C293F6]", 
        button: "bg-gradient-to-r from-[#8472DF] to-[#C293F6] hover:from-[#7A66D9] hover:to-[#B888F5]",
        dot: "bg-[#8472DF]",
        price: "text-[#8472DF]"
      },
      orange: {
        accent: "from-[#FFB067] to-[#F3E8FF]",
        button: "bg-[#FFB067] hover:bg-[#F6973E]",
        dot: "bg-[#FFB067]", 
        price: "text-[#FFB067]"
      }
    };
    return baseColors[color as keyof typeof baseColors];
  };

  const tooltips: { [key: string]: string } = {
    "Extra figurine for sharing": "Get an additional 3D figurine so siblings or grandparents can have their own keepsake",
    "8-color figurines": "This package uses 8-color figurines printed with advanced multi-color 3D printing devices for superior detail and vibrancy",
    "Extra white figurine with coloring kit": "STEAM educational experience - get a white version of the figurine with coloring materials so your child can paint and learn",
    "Shop product or gift card choice": "Choose any item from our Dreamli shop or get a gift card so your child can pick later",
    "Free second shipment with gift card": "When you choose the gift card option, we'll ship it to you for free - no extra shipping costs",
    "Personalized time capsule": "Create a special drawing and message that will be saved and delivered to your child in the future",
    "Share & Earn referral program": "Refer friends and earn credits that can make your purchase completely free"
  };

  const handlePackageSelect = (packageName: string) => {
    if (packageName === "Standard Keepsake Kit") {
      onUploadFormOpen("standard", "standardPrice");
    } else if (packageName === "Gift Pack") {
      onUploadFormOpen("gifts", "giftPackPrice");
    } else if (packageName === "STEAM Gift Pack") {
      onUploadFormOpen("steamgift", "steamGiftPackPrice");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">
            Choose Your Pack
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your child's artwork into lasting memories with our handcrafted keepsakes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Standard Keepsake Kit */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Standard Keepsake Kit</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€89</div>
                <div className="text-gray-500 text-sm">Perfect for trying us out</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">One 4-color figurine</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Made in Netherlands</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Safe materials</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handlePackageSelect("Standard Keepsake Kit")}
              className="w-full bg-[#8472DF] hover:bg-[#7A66D9] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Choose Standard
            </button>
          </div>

          {/* Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-[#8472DF] shadow-2xl lg:scale-105 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-[#8472DF] to-[#C293F6] text-[#333333] px-6 py-2 rounded-full text-sm font-bold border border-white shadow-lg">
                Most Popular
              </div>
            </div>
            
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Gift Pack</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#8472DF]">€137</div>
                <div className="text-gray-500 text-sm">Everything you need</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Everything in Standard</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">5 tap-to-view keychains</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Lithophane nightlight</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Fridge magnet</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Paintable option available</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handlePackageSelect("Gift Pack")}
              className="w-full bg-gradient-to-r from-[#8472DF] to-[#C293F6] hover:from-[#7A66D9] hover:to-[#B888F5] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Choose Gift Pack
            </button>
          </div>

          {/* STEAM Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">STEAM Gift Pack</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€238</div>
                <div className="text-gray-500 text-sm">Educational & creative experience</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Everything in Gift Pack</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra figurine for sharing</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">8-color figurines</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra white figurine with coloring kit</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Shop product or gift card choice</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Free second shipment with gift card</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Personalized time capsule</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Share & Earn referral program</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Free shipping + premium packaging</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handlePackageSelect("STEAM Gift Pack")}
              className="w-full bg-[#FFB067] hover:bg-[#F6973E] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Choose STEAM Pack
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-16 pt-8 border-t border-gray-200">
          <a href="https://blog.dreamli.nl/safe-3d-printing-materials-for-childrens-products-a-complete-parents-guide/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
              <i className="ri-shield-check-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Safe Materials</p>
              <p className="text-gray-500 text-xs">Child-friendly & non-toxic</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center">
              <i className="ri-truck-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Fast Delivery</p>
              <p className="text-gray-500 text-xs">5-10 working days</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
              <i className="ri-money-dollar-circle-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Money-Back Guarantee</p>
              <p className="text-gray-500 text-xs">100% satisfaction promise</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
