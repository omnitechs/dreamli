
'use client';

export default function ScientificProofNL() {
  return (
    <section className="py-24 bg-[#FFFDE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wetenschappelijk Bewijs / Waarom Dit Belangrijk Is
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We verkopen niet alleen speelgoed, we helpen bij de ontwikkeling van kinderen
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Research benefits */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Onderzoeksgebaseerde Voordelen</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-focus-3-fill text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      Creatief spelen verbetert focus & aandachtsspanne
                    </p>
                    <a href="https://www.science.org/doi/10.1126/science.1151148" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                      Diamond, A. et al., 2007 – Science
                    </a>
                    <p className="text-gray-500 text-xs mt-1">
                      Gerandomiseerd onderzoek naar het speelgebaseerde "Tools of the Mind" curriculum toonde significante verbeteringen in executieve functies
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-plant-fill text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      Bouwt veerkracht en groeimindset op
                    </p>
                    <a href="https://doi.org/10.1038/s41586-019-1466-y" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                      Yeager, D.S. et al., 2019 – Nature
                    </a>
                    <p className="text-gray-500 text-xs mt-1">
                      VS-studie: groeimindset-interventies verbeterden cijfers en bevorderden coping/veerkracht
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-trophy-fill text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      Versterkt zelfvertrouwen en probleemoplossende vaardigheden
                    </p>
                    <a href="https://doi.org/10.1111/nyas.14235" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                      Mak, H.W. & Fancourt, D., 2020 – Annals of the NY Academy of Sciences
                    </a>
                    <p className="text-gray-500 text-xs mt-1">
                      Britse studie van 6.209 kinderen: kunst & maakactiviteiten gekoppeld aan ~32% hoger zelfvertrouwen
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional supporting text */}
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className="ri-lightbulb-fill text-yellow-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium mb-2">De Wetenschap Achter Creatief Spelen</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Wanneer kinderen deelnemen aan hands-on creatieve activiteiten, vormen hun hersenen nieuwe neurale verbindingen 
                      die cognitieve flexibiliteit, emotionele regulatie en sociale vaardigheidsontwikkeling verbeteren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Video */}
          <div className="relative px-4 sm:px-0">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg relative">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/f381d98f33b951ad90f22af6a9faddb4.webp"
                alt="Nederlandse kinderen die tekenen aan een tafel met Nederlandse begeleiders in witte jassen tijdens een creatieve workshop"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              
              {/* Floating statistics - adjusted for mobile */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl transform rotate-12">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">15%</div>
                  <div className="text-xs">Betere Focus</div>
                </div>
              </div>
              
              <a 
                href="https://blog.dreamli.nl/unlocking-confidence-and-resilience-through-creative-play/#higher-confidence"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl transform -rotate-12 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">32%</div>
                  <div className="text-xs">Hoger Vertrouwen</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
