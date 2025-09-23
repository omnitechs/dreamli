'use client';

import { useState } from 'react';

export default function BenefitsDE() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: "🎯",
      title: "Laserfokus",
      summary: "Aktivitäten, die die Aufmerksamkeit länger halten",
      detail: "Wenn ihre Zeichnung real wird, verbringen sie Stunden damit, jedes Detail zu perfektionieren - und bauen Konzentration auf, die sich auf Hausaufgaben und Hobbys überträgt."
    },
    {
      icon: "✋",
      title: "Feinmotorik", 
      summary: "Verbessern Sie die Hand-Augen-Koordination",
      detail: "Das Erstellen maßgeschneiderter 3D-Figuren entwickelt die präzisen Handbewegungen, die für das Schreiben, Sport und detaillierte Arbeit benötigt werden."
    },
    {
      icon: "🧩",
      title: "Räumliches Problemlösen",
      summary: "Lernen Sie zu planen und vorauszudenken", 
      detail: "Herauszufinden, wie ihre 2D-Zeichnung in 3D übersetzt wird, entwickelt ingenieurtechnisches Denken, das in Mathematik, Naturwissenschaften und im Leben hilft."
    },
    {
      icon: "💪",
      title: "Kreatives Selbstvertrauen",
      summary: "Sehen Sie ihre eigenen Ideen zum Leben erwachen",
      detail: "Nichts baut Selbstwertgefühl auf wie Freunden zu zeigen \"Das habe ich selbst entworfen\" - Selbstvertrauen, das in alles ausstrahlt, was sie tun."
    },
    {
      icon: "🧠", 
      title: "Wachstumsmentalität",
      summary: "Lernen Sie, dass Übung Fortschritt macht",
      detail: "Jedes pädagogische Kunstset lehrt sie, dass Anstrengung und Kreativität zu erstaunlichen Ergebnissen führen, die sie halten und schätzen können."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-r from-[#93C4FF] to-[#F3E8FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Warum Kreative Sets zukünftigen Erfolg aufbauen
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Die Fähigkeiten, die sie heute entwickeln, werden morgen zu ihren Superkräften
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-all duration-300 border-2 border-gray-900/10">
                <span className="text-4xl filter drop-shadow-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {benefit.icon}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 text-base leading-relaxed mb-4 px-2">
                {benefit.summary}
              </p>

              {/* Hidden detailed content for SEO */}
              <div className="hidden">
                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.detail}
                </p>
              </div>

              {/* Learn more button */}
              <button
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                className="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                aria-expanded={expandedCard === index}
              >
                <span className="mr-1">Mehr erfahren</span>
                <i className={`ri-arrow-${expandedCard === index ? 'up' : 'down'}-s-line transition-transform duration-200`}></i>
              </button>

              {/* Expandable detail */}
              {expandedCard === index && (
                <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.detail}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="rounded-2xl p-8 border border-white/30 max-w-4xl mx-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-gray-800 text-lg font-medium leading-relaxed flex-1 text-center">
                Forschungen zeigen, dass in der Kindheit entwickeltes kreatives Selbstvertrauen sich über Jahrzehnte aufbaut. Unsere STEAM-Spielzeuge für Kinder geben ihnen diesen frühen Vorteil - verwandeln heutige Zeichnungen in morgiges innovatives Denken.
              </span>
              <button 
                className="w-10 h-10 flex items-center justify-center text-white rounded-full transition-colors cursor-pointer flex-shrink-0 hover:scale-110"
                title="Mehr über die Forschung erfahren"
                style={{background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%)'}}
              >
                <i className="ri-information-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}