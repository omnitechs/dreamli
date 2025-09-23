'use client';

import { useState } from 'react';

interface PackageOptionsNLProps {
  onOpenUploadForm?: (type: string, pricingField: string) => void;
}

const packages = [
  {
    name: "Standaard Herinnering Kit",
    price: "€89",
    subtitle: "Perfect om ons uit te proberen",
    features: [
      "Één 4-kleuren beeldje",
      "Gemaakt in Nederland", 
      "Veilige materialen"
    ],
    buttonText: "Kies Standaard",
    popular: false,
    color: "blue"
  },
  {
    name: "Cadeaupakket", 
    price: "€137",
    subtitle: "Alles wat je nodig hebt",
    features: [
      "Alles van Standaard",
      "5 tap-to-view sleutelhangers",
      "Lithofaan nachtlampje", 
      "Koelkastmagneet",
      "Schilderbare optie beschikbaar"
    ],
    buttonText: "Kies Cadeaupakket",
    popular: true,
    color: "purple"
  },
  {
    name: "STEAM Cadeaupakket",
    price: "€238", 
    subtitle: "Educatieve & creatieve ervaring",
    features: [
      "Alles van Cadeaupakket",
      "Extra beeldje om te delen",
      "8-kleuren beeldjes",
      "Extra wit beeldje met kleurset",
      "Winkelproduct of cadeaubon keuze",
      "Gratis tweede verzending met cadeaubon",
      "Gepersonaliseerde tijdcapsule",
      "Deel & Verdien doorverwijsprogramma",
      "Gratis verzending + premium verpakking"
    ],
    buttonText: "Kies STEAM Pakket",
    popular: false,
    color: "orange",
    hasTooltips: true
  }
];

export default function PackageOptionsNL({ onOpenUploadForm }: PackageOptionsNLProps) {
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
    "Extra beeldje om te delen": "Krijg een extra 3D beeldje zodat broers/zussen of grootouders hun eigen herinnering kunnen hebben",
    "8-kleuren beeldjes": "Dit pakket gebruikt 8-kleuren beeldjes geprint met geavanceerde meerkleurige 3D printapparaten voor superieure detail en levendigheid",
    "Extra wit beeldje met kleurset": "STEAM educatieve ervaring - krijg een witte versie van het beeldje met kleurmaterialen zodat je kind kan schilderen en leren",
    "Winkelproduct of cadeaubon keuze": "Kies elk item uit onze Dreamli winkel of krijg een cadeaubon zodat je kind later kan kiezen",
    "Gratis tweede verzending met cadeaubon": "Wanneer je de cadeaubon optie kiest, verzenden we het gratis naar je - geen extra verzendkosten",
    "Gepersonaliseerde tijdcapsule": "Creëer een speciale tekening en bericht dat bewaard wordt en in de toekomst aan je kind geleverd wordt",
    "Deel & Verdien doorverwijsprogramma": "Verwijs vrienden door en verdien credits die je aankoop volledig gratis kunnen maken"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">
            Kies je Pakket
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transformeer je kind's artwork in blijvende herinneringen met onze handgemaakte keepsakes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Standard Keepsake Kit */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Standaard Herinnering Kit</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€89</div>
                <div className="text-gray-500 text-sm">Perfect om ons uit te proberen</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Één 4-kleuren beeldje</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Gemaakt in Nederland</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Veilige materialen</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('standard', 'standardPrice')}
              className="w-full bg-[#8472DF] hover:bg-[#7A66D9] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Kies Standaard
            </button>
          </div>

          {/* Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-[#8472DF] shadow-2xl lg:scale-105 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-[#8472DF] to-[#C293F6] text-[#333333] px-6 py-2 rounded-full text-sm font-bold border border-white shadow-lg">
                Meest Populair
              </div>
            </div>
            
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Cadeaupakket</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#8472DF]">€137</div>
                <div className="text-gray-500 text-sm">Alles wat je nodig hebt</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Alles van Standaard</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">5 tap-to-view sleutelhangers</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Lithofaan nachtlampje</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Koelkastmagneet</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Schilderbare optie beschikbaar</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('gifts', 'giftPackPrice')}
              className="w-full bg-gradient-to-r from-[#8472DF] to-[#C293F6] hover:from-[#7A66D9] hover:to-[#B888F5] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Kies Cadeaupakket
            </button>
          </div>

          {/* STEAM Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">STEAM Cadeaupakket</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€238</div>
                <div className="text-gray-500 text-sm">Educatieve & creatieve ervaring</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Alles van Cadeaupakket</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra beeldje om te delen</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">8-kleuren beeldjes</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra wit beeldje met kleurset</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Winkelproduct of cadeaubon keuze</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Gratis tweede verzending met cadeaubon</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Gepersonaliseerde tijdcapsule</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Deel & Verdien doorverwijsprogramma</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Gratis verzending + premium verpakking</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('steamgift', 'steamGiftPackPrice')}
              className="w-full bg-[#FFB067] hover:bg-[#F6973E] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Kies STEAM Pakket
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
              <p className="font-semibold text-[#333333] text-sm">Veilige Materialen</p>
              <p className="text-gray-500 text-xs">Kindvriendelijk & niet-giftig</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center">
              <i className="ri-truck-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Snelle Levering</p>
              <p className="text-gray-500 text-xs">5-10 werkdagen</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
              <i className="ri-money-dollar-circle-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Geld-Terug Garantie</p>
              <p className="text-gray-500 text-xs">100% tevredenheidsbelofte</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}