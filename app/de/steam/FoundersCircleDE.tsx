'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';

export default function FoundersCircleDE() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const spotsRemaining = 12;

  const items = [
    { name: "Ihre allererste Übungsfigur, um sich auf den Prozess zu freuen", value: 20 },
    { name: "Professionelle Malutensilien, um ihre Kreation zum Leben zu erwecken", value: 15 },
    { name: "Ihre maßgeschneiderte 3D-Figur aus ihrer eigenen Zeichnung", value: 89 },
    { name: "Eine persönliche Erinnerungsseite, um diesen magischen Moment zu dokumentieren", value: 20, note: "Teilen und verdienen: €1 pro Like, €2 pro Kommentar, €0,5 pro Ansicht" },
    { name: "5 Schlüsselanhänger, die mit der Erinnerungsseite Ihres Kindes verbunden sind - tippen Sie auf ein beliebiges Telefon und sehen Sie sofort ihre Zeichnung, den Entstehungsprozess und ihren stolzen Moment mit der fertigen Figur", value: 25 },
    { name: "50% Rabatt auf Ihre nächste Bestellung (weil eine Figur nie genug ist)", value: 68.5, note: "Für Sie oder Ihre Lieben" },
    { name: "40% lebenslanger Rabatt für Dreamli Academy + lernen und verdienen", value: 0, note: "Unbezahlbar" },
    { name: "Der Stolz zu wissen, dass Sie Ihrem Kind diese unvergessliche Erfahrung geschenkt haben", value: 0, note: "Unbezahlbar" }
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
                  <span className="font-semibold text-sm md:text-base">Exklusiver Gründerkreis</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Helfen Sie uns, Dreamli zu starten —{' '}
                <span className="text-[#8472DF]">Machen Sie es kostenlos</span>
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed text-center" suppressHydrationWarning={true}>
                Schließen Sie sich unseren ersten 20 Familien an und erhalten Sie Dreamlis vollständigen €137 maßgeschneiderten Service kostenlos.
                <br />
                <strong>Teilen Sie Ihre Fotos, eine Bewertung, und Ihr Dreamli gehört Ihnen.</strong>
              </p>

              {/* What's Included - Detailed Breakdown */}
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#333333] text-center">Was Sie erhalten:</h3>

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
                          <span className="text-[#8472DF] font-bold text-sm md:text-base ml-4 flex-shrink-0">Unbezahlbar</span>
                        )}
                      </div>
                    ))}

                    {/* Total Value */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-bold text-gray-800">Gesamtwert:</span>
                        <span className="text-xl md:text-2xl font-bold text-black">€{totalValue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 border border-green-200">
                  <div className="space-y-4">
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">Ihre Investition:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gesamtwert:</span>
                        <span className="font-semibold text-black">€{totalValue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sie zahlen:</span>
                        <span className="font-semibold text-black">€{youPay}</span>
                      </div>
                      <div className="border-t border-[#8472DF] pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#8472DF]">Sie sparen:</span>
                          <span className="text-xl font-bold text-[#8472DF]">€{totalSavings}</span>
                        </div>
                      </div>
                      <div className="bg-[#EAE7FA] text-gray-800 rounded-xl p-3 text-center">
                        <p className="font-bold text-lg">Plus: 100% Rückerstattung nach dem Teilen!</p>
                        <p className="text-sm opacity-90">Erhalten Sie Ihre €137 zurück, wenn Sie Ihre Erfahrung teilen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Works Section */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg md:text-xl font-bold text-blue-800 mb-3">
                    Warum das für uns funktioniert:
                  </h4>
                  <p className="text-blue-700 text-sm md:text-base">
                    Die Freude Ihres Kindes wird zur Inspiration, die anderen Eltern hilft, diese Magie zu entdecken.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-lg md:text-xl font-bold text-purple-800 mb-3">
                    Warum das für Sie funktioniert:
                  </h4>
                  <p className="text-purple-700 text-sm md:text-base">
                    Kein Risiko, maximale Belohnung, und Sie sind Teil von etwas Größerem als nur dem Kauf eines Spielzeugs.
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
                      Nur noch {spotsRemaining} Plätze verfügbar!
                    </p>
                    <p className="text-[#8472DF] text-sm md:text-base break-words">
                      Jetzt beitreten, bevor dieses exklusive Angebot abläuft
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
                  🎨 Meinen Platz sichern — 100% zurückerstattet nach dem Teilen
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