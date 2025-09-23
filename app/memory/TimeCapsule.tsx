
'use client';

import { useState } from 'react';

interface TimeCapsuleProps {
  isOwner: boolean;
  onClose: () => void;
}

export default function TimeCapsule({ isOwner, onClose }: TimeCapsuleProps) {
  const [step, setStep] = useState<'waiting' | 'enterCode' | 'schedule' | 'confirmed'>('waiting');
  const [code, setCode] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeSubmit = () => {
    if (code.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setStep('schedule');
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleScheduleSubmit = () => {
    if (returnDate) {
      setIsSubmitting(true);
      setTimeout(() => {
        setStep('confirmed');
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 30);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Tijdcapsule</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          {step === 'waiting' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-time-line text-3xl text-white"></i>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Er Komt Iets Speciaals...
              </h4>
              
              <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  We hebben je een verrassingspakket gestuurd! Houd er naar uit - binnenin vind je iets dat een heel speciale functie zal ontgrendelen.
                </p>
                <div className="flex items-center space-x-3 text-[#B9E4C9]">
                  <i className="ri-information-line text-xl"></i>
                  <span className="font-medium">Wees geduldig, je krijgt binnenkort de code</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-3">
                  <i className="ri-gift-line text-2xl text-purple-600"></i>
                  <span className="font-bold text-purple-800">Verrassingspakket</span>
                </div>
                <p className="text-purple-700 text-sm">
                  Een mysterieus pakket arriveert bij je deur met alles wat je nodig hebt om deze speciale functie te ontgrendelen. De magie begint wanneer je het ontvangt!
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Al je verrassingspakket ontvangen?</p>
                <button
                  onClick={() => setStep('enterCode')}
                  className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Ik heb mijn code!
                </button>
              </div>
            </div>
          )}

          {step === 'enterCode' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-key-line text-3xl text-white"></i>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Voer Je Speciale Code In
              </h4>
              
              <p className="text-gray-600 mb-6">
                De speciale code gevonden in je verrassingspakket? Voer hem hieronder in om te ontdekken wat deze service zo bijzonder maakt!
              </p>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Voer hier je code in"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-center text-lg font-mono tracking-wider"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Volgende Stap:</p>
                      <p>Eenmaal geverifieerd, ontdek je wat deze service echt speciaal maakt!</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('waiting')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Terug
                  </button>
                  <button
                    onClick={handleCodeSubmit}
                    disabled={!code.trim() || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 animate-spin">
                          <i className="ri-loader-4-line text-sm"></i>
                        </div>
                        <span>Verifiëren...</span>
                      </div>
                    ) : (
                      'Code Verifiëren'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'schedule' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-calendar-line text-3xl text-white"></i>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                De Grote Onthulling!
              </h4>
              
              <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  Verrassing! We kunnen je model veilig bewaren en het op een door jou gekozen toekomstige datum terugsturen - als een magische tijdcapsule!
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <i className="ri-check-line text-green-600"></i>
                    <span>Stuur een van je modellen naar ons terug met het meegeleverde verzendlabel</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <i className="ri-check-line text-green-600"></i>
                    <span>We bewaren het veilig in ons speciale tijdcapsule-faciliteit</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <i className="ri-check-line text-green-600"></i>
                    <span>Op je gekozen datum sturen we het terug als een prachtige verrassing!</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wanneer wil je het terug ontvangen?
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={minDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-center text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Kies een datum tussen 30 dagen en 5 jaar vanaf nu
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-shield-check-line text-blue-600 text-lg mt-0.5"></i>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Veilige Bewaarbeloften:</p>
                      <p>Je model wordt bewaard in perfecte omstandigheden en precies teruggestuurd wanneer je hebt gevraagd. Het is alsof je een cadeau naar je toekomstige zelf stuurt!</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('enterCode')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Terug
                  </button>
                  <button
                    onClick={handleScheduleSubmit}
                    disabled={!returnDate || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 animate-spin">
                          <i className="ri-loader-4-line text-sm"></i>
                        </div>
                        <span>Plannen...</span>
                      </div>
                    ) : (
                      'Tijdcapsule Plannen'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-check-line text-3xl text-white"></i>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Tijdcapsule Gepland!
              </h4>
              
              <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  Je magische tijdcapsule is gepland voor:
                </p>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-2xl font-bold text-gray-800">
                    {new Date(returnDate).toLocaleDateString('nl-NL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                  <i className="ri-check-line text-green-600 text-lg"></i>
                  <span className="text-green-800">Code succesvol geverifieerd</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <i className="ri-time-line text-blue-600 text-lg"></i>
                  <span className="text-blue-800">Terugkeerdatum gepland</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <i className="ri-mail-line text-purple-600 text-lg"></i>
                  <span className="text-purple-800">Bevestigingsdetails verzonden</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Volgende stap:</strong> Stuur een model uit je pakket naar ons met het meegeleverde vooruitbetaalde verzendlabel. Zodra we het ontvangen, begint je tijdcapsule-reis!
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Klaar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
