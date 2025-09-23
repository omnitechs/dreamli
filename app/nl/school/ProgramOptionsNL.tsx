'use client';

interface ProgramOptionsNLProps {
  onRequestPilot: () => void;
}

export default function ProgramOptionsNL({ onRequestPilot }: ProgramOptionsNLProps) {
  const programs = [
    {
      title: "Eenmalige Creatieve Workshop",
      duration: "Enkele sessie",
      description: "Leuke, laagdrempelige introductie tot creativiteit",
      features: [
        "Voorgemaakte thematische 3D-modellen (€299 waarde)",
        "Complete verfkit met verf, penselen, opruimmateriaal (€79 waarde)",
        "Kant-en-klare leerkrachtgids (€49 waarde)",
        "Tevredenheidsgarantie — volledige terugbetaling als leerlingen niet tevreden zijn (Onbetaalbaar)"
      ],
      price: "€249",
      originalPrice: "€427",
      popular: false,
      closingLine: "Perfect voor schoolevenementen of een eerste Dreamli-ervaring."
    },
    {
      title: "6-Weken Creatieve Reis",
      duration: "Wekelijkse sessies",
      description: "Van plezier naar transformatie. Leerlingen creëren → printen → schilderen, onbeperkt",
      features: [
        "Onbeperkte 3D-prints van leerlingtekeningen (€899 waarde)",
        "6 wekelijkse uitdagingen & lesplannen (€249 waarde)",
        "Complete materialenkit voor alle weken (€179 waarde)",
        "Leerlingvoortgangstracker (€149 waarde)",
        "Tevredenheidsgarantie — volledige terugbetaling bij ontevredenheid"
      ],
      price: "€1.130",
      originalPrice: "€1.476",
      popular: true,
      closingLine: "Bouw creativiteit, zelfvertrouwen en veerkracht op in 6 weken."
    },
    {
      title: "Dreamli Creatieve Club",
      duration: "Maandelijks doorlopend",
      description: "Doorlopende verrijking die creativiteit omzet in praktische vaardigheden",
      features: [
        "Nieuwe 3D-prints & thematische kits maandelijks (€499 waarde)",
        "Onbeperkte leerlingtekeningen → geprinte modellen (€299 waarde)",
        "Digitaal creatief profiel voor elke leerling (€249 waarde)",
        "Seizoenspresentaties voor ouders (€199 waarde)",
        "Gamified panel — leerlingen verdienen punten, leren teamwork, financiële geletterdheid, reclame, schaalvoordelen, AI-vaardigheden, en kunnen deel van maandelijkse kosten terugverdienen (Onbetaalbaar)",
        "Tevredenheidsgarantie — altijd opzegbaar, terugbetaling laatste maand bij ontevredenheid"
      ],
      price: "€639/maand",
      originalPrice: "€1.246/maand",
      popular: false,
      closingLine: "Jaarronde creativiteit + toekomstgerichte vaardigheden."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-purple-700">Programma Opties</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kies Wat Past Bij Jullie Behoeften
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexibele formaten ontworpen voor verschillende educatieve doelen en roosters
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className={`relative bg-white rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${program.popular ? 'border-[#FFA726] ring-2 ring-[#FFA726]/20' : 'border-gray-200'}`}>
              
              {program.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FFA726] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Meest Populair
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-[#FFA726] font-semibold mb-3">{program.duration}</p>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{program.description}</p>
                
                {/* Value vs Price */}
                <div className="mb-4">
                  <div className="text-lg text-gray-500 line-through mb-1">Totale Waarde: {program.originalPrice}</div>
                  <div className="text-3xl font-bold text-gray-900">{program.price}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {program.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-fill text-green-600 text-sm"></i>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Closing line */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800 italic text-center">"{program.closingLine}"</p>
              </div>

              <button
                onClick={onRequestPilot}
                className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 ${
                  program.popular 
                    ? 'bg-[#FFA726] text-white hover:bg-[#FF9800]'
                    : 'bg-white text-[#FFA726] border-2 border-[#FFA726] hover:bg-[#FFA726] hover:text-white'
                }`}
              >
                Reserveer Vandaag Je Plek
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee and Scarcity */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {/* Guarantee Box */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-lg">100% Tevredenheidsgarantie</h3>
                <p className="text-green-700">Als je leerlingen niet tevreden zijn, betalen we je geld terug.</p>
              </div>
            </div>
          </div>

          {/* Scarcity Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <i className="ri-alarm-warning-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg">Beperkte Beschikbaarheid</h3>
                <p className="text-red-700">Slechts 3 scholen per stad geaccepteerd per periode. Nog 15 pilotplekken dit kwartaal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRequestPilot}
              className="bg-[#FFA726] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Reserveer Vandaag Je Plek
            </button>
            
            <button
              onClick={onRequestPilot}
              className="bg-transparent text-[#FFA726] border-2 border-[#FFA726] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Boek een Snelle Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}