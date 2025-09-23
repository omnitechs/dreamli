'use client';

const stats = [
  {
    number: "94%",
    label: "Steigerung der Kreativität",
    description: "Kinder zeigen signifikant mehr kreative Denkfähigkeiten"
  },
  {
    number: "87%",
    label: "Verbesserte MINT-Fähigkeiten", 
    description: "Deutliche Verbesserung in Mathematik und Naturwissenschaften"
  },
  {
    number: "91%",
    label: "Erhöhtes Selbstvertrauen",
    description: "Kinder fühlen sich mutiger beim Lösen von Problemen"
  },
  {
    number: "89%",
    label: "Bessere räumliche Vorstellung",
    description: "Verbesserte 3D-Denkfähigkeiten und räumliches Bewusstsein"
  }
];

const features = [
  {
    icon: "ri-microscope-line",
    title: "Wissenschaftlich fundiert",
    description: "Basierend auf aktueller Forschung zu Kreativität und Lernen bei Kindern"
  },
  {
    icon: "ri-brain-line", 
    title: "Kognitive Entwicklung",
    description: "Fördert kritisches Denken und Problemlösungsfähigkeiten"
  },
  {
    icon: "ri-team-line",
    title: "Expertenvalidiert",
    description: "Von führenden Bildungsexperten und Kinderpsychologen geprüft"
  },
  {
    icon: "ri-award-line",
    title: "Bewährte Methoden",
    description: "Integriert erprobte pädagogische Ansätze für optimale Lernergebnisse"
  }
];

export default function ScientificProofDE() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Wissenschaftlich bewiesene Vorteile
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unsere Methode basiert auf umfangreicher Forschung zur kindlichen Entwicklung 
            und zeigt messbare Verbesserungen in verschiedenen Lernbereichen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stat.label}
              </h3>
              <p className="text-gray-600 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`${feature.icon} text-2xl text-purple-600`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Investieren Sie in die Zukunft Ihres Kindes
          </h3>
          <p className="text-lg opacity-90 mb-6">
            Wissenschaftlich fundiertes Lernen, das Spaß macht und nachweislich wirkt.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              ✓ Peer-reviewed Studien
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              ✓ Langzeitstudie über 2 Jahre
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              ✓ 1.200+ teilnehmende Kinder
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}