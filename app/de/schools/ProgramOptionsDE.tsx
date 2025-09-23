'use client';

interface ProgramOptionsProps {
  onRequestPilot: () => void;
}

export default function ProgramOptionsDE({ onRequestPilot }: ProgramOptionsProps) {
  const programs = [
    {
      title: "Einmaliger Kreativ-Workshop",
      duration: "Einzelsitzung",
      description: "Spaßige, risikoarme Einführung in die Kreativität",
      features: [
        "Vorgefertigte thematische 3D-Modelle (€299 Wert)",
        "Komplettes Malset mit Farben, Pinseln, Reinigung (€79 Wert)",
        "Gebrauchsfertiger Lehrerguide (€49 Wert)",
        "Zufriedenheitsgarantie — volle Rückerstattung, wenn Schüler nicht zufrieden sind (Unbezahlbar)"
      ],
      price: "€249",
      originalPrice: "€427",
      popular: false,
      closingLine: "Perfekt für Schulveranstaltungen oder eine erste Dreamli-Erfahrung."
    },
    {
      title: "6-Wochen Kreative Reise",
      duration: "Wöchentliche Sitzungen",
      description: "Von Spaß zur Transformation. Schüler kreieren → drucken → malen, unbegrenzt oft",
      features: [
        "Unbegrenzte 3D-Drucke aus Schülerzeichnungen (€899 Wert)",
        "6 wöchentliche Herausforderungen & Lektionspläne (€249 Wert)",
        "Komplettes Materialkit für alle Wochen (€179 Wert)",
        "Schülerfortschritts-Tracker (€149 Wert)",
        "Zufriedenheitsgarantie — volle Rückerstattung bei Unzufriedenheit"
      ],
      price: "€1.130",
      originalPrice: "€1.476",
      popular: true,
      closingLine: "Bauen Sie Kreativität, Selbstvertrauen und Widerstandsfähigkeit in 6 Wochen auf."
    },
    {
      title: "Dreamli Kreativ-Club",
      duration: "Monatlich fortlaufend",
      description: "Kontinuierliche Bereicherung, die Kreativität in echte Fähigkeiten verwandelt",
      features: [
        "Neue 3D-Drucke & thematische Kits monatlich (€499 Wert)",
        "Unbegrenzte Schülerzeichnungen → gedruckte Modelle (€299 Wert)",
        "Digitales Kreativprofil für jeden Schüler (€249 Wert)",
        "Saisonale Elternpräsentationen (€199 Wert)",
        "Gamifiziertes Panel — Schüler sammeln Punkte, lernen Teamwork, Finanzliteralität, Werbung, Skalierung, KI-Fähigkeiten und können Teil der monatlichen Kosten zurückverdienen (Unbezahlbar)",
        "Zufriedenheitsgarantie — jederzeit kündbar, Rückerstattung des letzten Monats bei Unzufriedenheit"
      ],
      price: "€639/Monat",
      originalPrice: "€1.246/Monat",
      popular: false,
      closingLine: "Ganzjährige Kreativität + zukunftsfähige Fähigkeiten."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-purple-700">Programmoptionen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wählen Sie, Was Zu Ihren Bedürfnissen Passt
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible Formate für verschiedene Bildungsziele und Zeitpläne konzipiert
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className={`relative bg-white rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${program.popular ? 'border-[#FFA726] ring-2 ring-[#FFA726]/20' : 'border-gray-200'}`}>
              
              {program.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FFA726] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Am Beliebtesten
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-[#FFA726] font-semibold mb-3">{program.duration}</p>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{program.description}</p>
                
                {/* Value vs Price */}
                <div className="mb-4">
                  <div className="text-lg text-gray-500 line-through mb-1">Gesamtwert: {program.originalPrice}</div>
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
                Reservieren Sie Heute Ihren Platz
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
                <h3 className="font-bold text-green-800 text-lg">100% Zufriedenheitsgarantie</h3>
                <p className="text-green-700">Wenn Ihre Schüler nicht zufrieden sind, erstatten wir Ihre Zahlung zurück.</p>
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
                <h3 className="font-bold text-red-800 text-lg">Begrenzte Verfügbarkeit</h3>
                <p className="text-red-700">Nur 3 Schulen pro Stadt werden pro Semester akzeptiert. 15 Pilotplätze übrig in diesem Semester.</p>
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
              Reservieren Sie Heute Ihren Platz
            </button>
            
            <button
              onClick={onRequestPilot}
              className="bg-transparent text-[#FFA726] border-2 border-[#FFA726] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Buchen Sie Eine Schnelle Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}