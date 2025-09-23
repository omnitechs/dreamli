'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';

export default function FoundersCircleNL() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const spotsRemaining = 12;

  const items = [
    { name: "Hun allereerste oefenfiguurtje om enthousiast te worden over het proces", value: 20 },
    { name: "Professionele verfbenodigdheden om hun creatie tot leven te brengen", value: 15 },
    { name: "Hun aangepaste 3D-figurine van hun eigen tekening", value: 89 },
    { name: "Een persoonlijke herinneringspagina om dit magische moment vast te leggen", value: 20, note: "Deel en verdien: €1 per like, €2 per reactie, €0,5 per weergave" },
    { name: "5 sleutelhangers die verbinding maken met de herinneringspagina van je kind - tik op elke telefoon en zie direct hun tekening, het creatieproces en hun trotse moment met het eindresultaat", value: 25 },
    { name: "50% korting op je volgende bestelling (omdat één figurine nooit genoeg is)", value: 68.5, note: "Voor jou of je dierbaren" },
    { name: "40% levenslange korting voor Dreamli Academy + leren en verdienen", value: 0, note: "Onbetaalbaar" },
    { name: "De trots van wetende dat je je kind deze onvergetelijke ervaring hebt gegeven", value: 0, note: "Onbetaalbaar" }
  ];

  const totalValue = 237.5;
  const youPay = 137;
  const totalSavings = 100.5;

  return (
    <>
      <section id="oprichters-kring" className="py-12 md:py-20 bg-gradient-to-br from-[#DBEAFE] to-[#F3E8FF] max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-w-0">
            {/* Content - Now centered */}
            <div className="space-y-6 md:space-y-8 max-w-4xl min-w-0">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-[#F5F5F5] text-[#8472DF] px-3 py-2 md:px-4 rounded-full border border-[#8472DF]/20">
                  <i className="ri-vip-crown-fill text-sm"></i>
                  <span className="font-semibold text-sm md:text-base">Exclusieve Oprichters Kring</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Help Ons Dreamli Lanceren —{' '}
                <span className="text-[#8472DF]">Maak Het Gratis</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center" suppressHydrationWarning={true}>
                Sluit je aan bij onze eerste 20 families en ontvang Dreamli's volledige €137 aangepaste service, gratis.
                <br />
                <strong>Deel je foto's, een review, en je Dreamli is van ons.</strong>
              </p>

              {/* What's Included - Detailed Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#333333] text-center">Wat Je Krijgt:</h3>

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
                          <span className="text-[#8472DF] font-bold text-sm md:text-base ml-4 flex-shrink-0">Onbetaalbaar</span>
                        )}
                      </div>
                    ))}

                    {/* Total Value */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-bold text-gray-800">Totale Waarde:</span>
                        <span className="text-xl md:text-2xl font-bold text-black">€{totalValue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 border border-green-200">
                  <div className="space-y-4">
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">Jouw Investering:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Totale Waarde:</span>
                        <span className="font-semibold text-black">€{totalValue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jij Betaalt:</span>
                        <span className="font-semibold text-black">€{youPay}</span>
                      </div>
                      <div className="border-t border-green-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#8472DF]">Je Bespaart:</span>
                          <span className="text-xl font-bold text-[#8472DF]">€{totalSavings}</span>
                        </div>
                      </div>
                      <div className="bg-[#EAE7FA] text-gray-800 rounded-xl p-3 text-center">
                        <p className="font-bold text-lg">Plus: 100% Terugbetaling Na Delen!</p>
                        <p className="text-sm opacity-90">Krijg je €137 terug wanneer je je ervaring deelt</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Works Section */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                    Waarom dit voor ons werkt:
                  </h4>
                  <p className="text-blue-700 text-sm md:text-base">
                    De vreugde van je kind wordt de inspiratie die andere ouders helpt deze magie te ontdekken.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-lg md:text-xl font-bold text-purple-800 mb-3">
                    Waarom dit voor jou werkt:
                  </h4>
                  <p className="text-purple-700 text-sm md:text-base">
                    Geen risico, maximale beloning, en je bent onderdeel van iets groters dan alleen een speeltje kopen.
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
                      Nog maar {spotsRemaining} plekken beschikbaar!
                    </p>
                    <p className="text-[#8472DF] text-sm md:text-base break-words">
                      Meld je nu aan voordat dit exclusieve aanbod afloopt
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
                  🎨 Claim Mijn Plek — 100% Terugbetaald Na Delen
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