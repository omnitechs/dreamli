'use client';

import { useState } from 'react';

interface PackageOptionsDEProps {
  onOpenUploadForm?: (type: string, pricingField: string) => void;
}

const packages = [
  {
    name: "Standard Andenken-Set",
    price: "€89",
    subtitle: "Perfekt zum Ausprobieren",
    features: [
      "Eine 4-Farben-Figur",
      "Hergestellt in den Niederlanden", 
      "Sichere Materialien"
    ],
    buttonText: "Standard Wählen",
    popular: false,
    color: "blue"
  },
  {
    name: "Geschenkpaket", 
    price: "€137",
    subtitle: "Alles was Sie brauchen",
    features: [
      "Alles aus Standard",
      "5 Tap-to-View Schlüsselanhänger",
      "Lithophane-Nachtlicht", 
      "Kühlschrankmagnet",
      "Bemalbare Option verfügbar"
    ],
    buttonText: "Geschenkpaket Wählen",
    popular: true,
    color: "purple"
  },
  {
    name: "STEAM Geschenkpaket",
    price: "€238", 
    subtitle: "Lehrreiches & kreatives Erlebnis",
    features: [
      "Alles aus Geschenkpaket",
      "Extra Figur zum Teilen",
      "8-Farben-Figuren",
      "Extra weiße Figur mit Mal-Set",
      "Shop-Produkt oder Geschenkkarte zur Auswahl",
      "Kostenlose zweite Sendung mit Geschenkkarte",
      "Personalisierte Zeitkapsel",
      "Share & Earn Empfehlungsprogramm",
      "Kostenloser Versand + Premium-Verpackung"
    ],
    buttonText: "STEAM Paket Wählen",
    popular: false,
    color: "orange",
    hasTooltips: true
  }
];

export default function PackageOptionsDE({ onOpenUploadForm }: PackageOptionsDEProps) {
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
    "Extra Figur zum Teilen": "Erhalten Sie eine zusätzliche 3D-Figur, damit Geschwister oder Großeltern ihr eigenes Andenken haben können",
    "8-Farben-Figuren": "Dieses Paket verwendet 8-Farben-Figuren, die mit fortschrittlichen mehrfarbigen 3D-Druckgeräten für überlegene Details und Lebendigkeit gedruckt werden",
    "Extra weiße Figur mit Mal-Set": "STEAM-Lernerfahrung - erhalten Sie eine weiße Version der Figur mit Malmaterialien, damit Ihr Kind malen und lernen kann",
    "Shop-Produkt oder Geschenkkarte zur Auswahl": "Wählen Sie einen beliebigen Artikel aus unserem Dreamli-Shop oder erhalten Sie eine Geschenkkarte, damit Ihr Kind später wählen kann",
    "Kostenlose zweite Sendung mit Geschenkkarte": "Wenn Sie die Geschenkkarten-Option wählen, versenden wir sie kostenlos an Sie - keine zusätzlichen Versandkosten",
    "Personalisierte Zeitkapsel": "Erstellen Sie eine besondere Zeichnung und Nachricht, die gespeichert und Ihrem Kind in der Zukunft zugestellt wird",
    "Share & Earn Empfehlungsprogramm": "Empfehlen Sie Freunde und verdienen Sie Credits, die Ihren Kauf völlig kostenlos machen können"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">
            Wählen Sie Ihr Paket
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verwandeln Sie die Kunstwerke Ihres Kindes in bleibende Erinnerungen mit unseren handgefertigten Andenken
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Standard Keepsake Kit */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Standard Andenken-Set</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€89</div>
                <div className="text-gray-500 text-sm">Perfekt zum Ausprobieren</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Eine 4-Farben-Figur</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Hergestellt in den Niederlanden</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Sichere Materialien</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('standard', 'standardPrice')}
              className="w-full bg-[#8472DF] hover:bg-[#7A66D9] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Standard Wählen
            </button>
          </div>

          {/* Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-[#8472DF] shadow-2xl lg:scale-105 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-[#8472DF] to-[#C293F6] text-[#333333] px-6 py-2 rounded-full text-sm font-bold border border-white shadow-lg">
                Am Beliebtesten
              </div>
            </div>
            
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">Geschenkpaket</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#8472DF]">€137</div>
                <div className="text-gray-500 text-sm">Alles was Sie brauchen</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Alles aus Standard</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">5 Tap-to-View Schlüsselanhänger</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Lithophane-Nachtlicht</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Kühlschrankmagnet</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Bemalbare Option verfügbar</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('gifts', 'giftPackPrice')}
              className="w-full bg-gradient-to-r from-[#8472DF] to-[#C293F6] hover:from-[#7A66D9] hover:to-[#B888F5] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              Geschenkpaket Wählen
            </button>
          </div>

          {/* STEAM Gift Pack */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 transform hover:-translate-y-2 relative overflow-visible border-gray-100 hover:shadow-xl hover:border-gray-200 flex flex-col">
            <div className="text-center flex-grow">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">STEAM Geschenkpaket</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2 text-[#333333]">€238</div>
                <div className="text-gray-500 text-sm">Lehrreiches & kreatives Erlebnis</div>
              </div>
              
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Alles aus Geschenkpaket</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra Figur zum Teilen</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">8-Farben-Figuren</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Extra weiße Figur mit Mal-Set</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Shop-Produkt oder Geschenkkarte zur Auswahl</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Kostenlose zweite Sendung mit Geschenkkarte</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Personalisierte Zeitkapsel</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Share & Earn Empfehlungsprogramm</span>
                  <div className="relative flex-shrink-0 ml-2">
                    <button className="w-4 h-4 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                      <i className="ri-question-line text-xs text-white"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#FFB067] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm leading-relaxed flex-1">Kostenloser Versand + Premium-Verpackung</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onOpenUploadForm?.('steamgift', 'steamGiftPackPrice')}
              className="w-full bg-[#FFB067] hover:bg-[#F6973E] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap mt-auto"
            >
              STEAM Paket Wählen
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
              <p className="font-semibold text-[#333333] text-sm">Sichere Materialien</p>
              <p className="text-gray-500 text-xs">Kinderfreundlich & ungiftig</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center">
              <i className="ri-truck-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Schnelle Lieferung</p>
              <p className="text-gray-500 text-xs">5-10 Werktage</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
              <i className="ri-money-dollar-circle-fill text-white text-xl"></i>
            </div>
            <div>
              <p className="font-semibold text-[#333333] text-sm">Geld-zurück-Garantie</p>
              <p className="text-gray-500 text-xs">100% Zufriedenheitsversprechen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}