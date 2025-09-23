'use client';

interface SchoolsHeroDEProps {
  onRequestPilot: () => void;
  onBookDemo: () => void;
}

export default function SchoolsHeroDE({ onRequestPilot, onBookDemo }: SchoolsHeroDEProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] leading-tight">
              Verwandeln Sie jedes Klassenzimmer in 45 Minuten in ein Kreativitätslabor — Null Vorbereitung.
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              In weniger als einer Stunde erstellen Schüler etwas Echtes, behalten es und gewinnen Selbstvertrauen, während Lehrer nur „Start" drücken müssen.
            </p>

            {/* Benefit bullets */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-time-fill text-white text-sm"></i>
                </div>
                <span className="text-lg text-gray-700 font-medium">Läuft in 30–45 Min</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-group-fill text-white text-sm"></i>
                </div>
                <span className="text-lg text-gray-700 font-medium">Passt für 8–24 Schüler</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#FFA726] rounded-full flex items-center justify-center">
                  <i className="ri-box-3-fill text-white text-sm"></i>
                </div>
                <span className="text-lg text-gray-700 font-medium">Alle Materialien enthalten, Aufräumen übernommen</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onRequestPilot}
                className="bg-[#FFA726] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
              >
                Pilotprojekt anfordern
              </button>
              
              <button 
                onClick={onBookDemo}
                className="bg-white text-[#FFA726] border-2 border-[#FFA726] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
              >
                15-Min Demo buchen
              </button>
            </div>
          </div>

          {/* Right side - Classroom image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20bright%20classroom%20setting%20with%20enthusiastic%20female%20teacher%20helping%20diverse%20group%20of%20children%20aged%206-10%20painting%20small%20colorful%203D%20figurines%20at%20tables%2C%20collaborative%20learning%20environment%2C%20natural%20lighting%20through%20windows%2C%20educational%20materials%20visible%2C%20kids%20focused%20and%20engaged%2C%20warm%20classroom%20atmosphere%2C%20professional%20educational%20photography&width=600&height=500&seq=schools-hero-classroom&orientation=landscape"
                alt="Lehrerin hilft Schülern beim Bemalen von 3D-Figuren im Klassenzimmer"
                className="w-full h-96 object-cover object-top"
              />
            </div>

            {/* Floating trust indicators */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-fill text-green-600 text-lg"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sichere Materialien</p>
                  <p className="text-gray-600 text-xs">Kinderfreundliche Farben</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-time-fill text-blue-600 text-lg"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">30-45 Min</p>
                  <p className="text-gray-600 text-xs">Sitzungsdauer</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}