'use client';

export default function OutcomesSectionDE() {
  const outcomes = [
    {
      title: "Fokus",
      improvement: "+14–17% Aufmerksamkeit",
      description: "Nachhaltige Aufmerksamkeit und Konzentration während der Aktivitäten",
      icon: "ri-focus-3-fill",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Selbstwertgefühl", 
      improvement: "~32% Stärkung des Selbstvertrauens",
      description: "Vertrauen in kreative Fähigkeiten und Problemlösung",
      icon: "ri-medal-fill",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Widerstandsfähigkeit",
      improvement: "Problemlösende Denkweise", 
      description: "Ausdauer bei Herausforderungen und kreatives Denken",
      icon: "ri-lightbulb-fill",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nicht nur Spaß — messbare Ergebnisse.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {outcomes.map((outcome, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-r ${outcome.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${outcome.icon} text-3xl text-white`}></i>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{outcome.title}</h3>
                <div className="text-lg font-semibold text-[#FFA726] mb-4">{outcome.improvement}</div>
                <p className="text-gray-600 leading-relaxed">{outcome.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}