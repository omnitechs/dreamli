'use client';

import Link from 'next/link';

export default function HowItWorksGiftsDE() {
  const steps = [
    {
      number: 1,
      title: "Zeichnung Hochladen",
      description: "Laden Sie die Zeichnung Ihres Kindes hoch und wir verwandeln sie in ein komplettes Erinnerungspaket.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png",
      alt: "Elternteil fotografiert eine Engelszeichnung eines Kindes, um sie in ein 3D-gedrucktes Andenken zu verwandeln",
      link: "/de/wie-es-funktioniert#step-1"
    },
    {
      number: 2,
      title: "Vorschau & Bestätigen",
      description: "Sehen Sie die 3D-Modell-Vorschau und bestätigen Sie, bevor wir mit der Erstellung Ihrer Figur beginnen.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d4cb39d78c1c354c9040a676b15b190c.webp",
      alt: "3D-Modellierungssoftware zeigt eine Engelsfigur, die aus einer Kinderzeichnung erstellt wurde",
      link: "/de/wie-es-funktioniert#step-2"
    },
    {
      number: 3,
      title: "Wir Erstellen Es",
      description: "Unser Team druckt Ihre Figur in 3D, erstellt das Lithophane-Nachtlicht, Magneten und Schlüsselanhänger.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/65b1a71f4f3d3f49dd830c05c2695294.webp",
      link: "/de/wie-es-funktioniert#step-3"
    },
    {
      number: 4,
      title: "Genießen & Teilen",
      description: "Ihr komplettes Geschenkpaket kommt bereit zum Ausstellen an, plus Zugang zu Ihrer privaten Erinnerungsseite.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ae69e1793d0aa487776c0b377072507a.webp",
      link: "/de/wie-es-funktioniert#step-4"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-blue-700">Wie Es Funktioniert</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Einfache 4 Schritte</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Verwirrung beseitigen, zeigen dass es einfach ist</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Link 
              key={step.number} 
              href={step.link}
              className="text-center group cursor-pointer block transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img 
                  src={step.image} 
                  alt={step.number === 1 ? "Kinderzeichnung eines Engels wird zur Dreamli-Plattform hochgeladen" : 
                       step.number === 2 ? "3D-Modellierungssoftware zeigt eine Engelsfigur, die aus einer Kinderzeichnung erstellt wurde" :
                       "Hand hält eine 3D-gedruckte Engelsfigur draußen als personalisiertes Andenken aus einer Kinderzeichnung"}
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </Link>
          ))}
        </div>

        {/* Optional Painting Kit Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <i className="ri-palette-line text-xl w-6 h-6 flex items-center justify-center"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Optionales Mal-Set</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Möchten Sie mehr Kreativität? Wählen Sie die bemalbare Option — Sie können eine Figur oder sogar den Kühlschrankmagneten zusammen bemalen und das Auspacken zu einer Familienaktivität machen.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm">
              <i className="ri-brush-line text-purple-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="text-gray-700 font-medium">Perfekt für gemeinsame Familienzeit</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 rounded-full px-6 py-3" style={{ backgroundColor: '#e6e6e6' }}>
            <i className="ri-shield-check-line text-xl w-6 h-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
            <span className="text-black font-medium">Hergestellt von erfahrenen Handwerkern</span>
          </div>
        </div>
      </div>
    </section>
  );
}