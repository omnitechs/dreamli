'use client';

import Link from 'next/link';

export default function HowItWorksGiftsNL() {
  const steps = [
    {
      number: 1,
      title: "Tekening Uploaden",
      description: "Upload je kind's tekening en wij transformeren het in een complete herinnering bundel.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png",
      alt: "Ouder fotografeert een engel tekening van een kind om er een 3D geprinte herinnering van te maken",
      link: "/nl/hoe-werkt-het#stap-1"
    },
    {
      number: 2,
      title: "Voorvertoning & Bevestigen",
      description: "Bekijk de 3D model voorvertoning en bevestig voordat we beginnen met het maken van je figuur.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d4cb39d78c1c354c9040a676b15b190c.webp",
      alt: "3D modelleringssoftware toont een engel beeldje gemaakt van een kindertekening",
      link: "/nl/hoe-werkt-het#stap-2"
    },
    {
      number: 3,
      title: "Wij Maken Het",
      description: "Ons team 3D print je beeldje, maakt het lithofaan nachtlampje, magneet en sleutelhangers.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/65b1a71f4f3d3f49dd830c05c2695294.webp",
      link: "/nl/hoe-werkt-het#stap-3"
    },
    {
      number: 4,
      title: "Genieten & Delen",
      description: "Je complete Cadeaupakket arriveert klaar om te tonen, plus toegang tot je privé Herinneringspagina.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ae69e1793d0aa487776c0b377072507a.webp",
      link: "/nl/hoe-werkt-het#stap-4"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-blue-700">Hoe het Werkt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Eenvoudige 4 Stappen</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Verwijder verwarring, laat zien dat het makkelijk is</p>
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
                  alt={step.number === 1 ? "Kindertekening van een engel wordt geüpload naar Dreamli platform" : 
                       step.number === 2 ? "3D modelleringssoftware toont een engel beeldje gemaakt van een kindertekening" :
                       "Hand houdt een 3D geprint engel beeldje buiten als gepersonaliseerde herinnering van een kindertekening"}
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
              <h3 className="text-2xl font-bold text-gray-900">Optionele Schilderset</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              Wil je meer creativiteit? Kies de schilderbare optie - je kunt samen een beeldje of zelfs de koelkastmagneet inkleuren, waardoor het uitpakken een familieactiviteit wordt.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm">
              <i className="ri-brush-line text-purple-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="text-gray-700 font-medium">Perfect voor familie bindingstijd</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 rounded-full px-6 py-3" style={{ backgroundColor: '#e6e6e6' }}>
            <i className="ri-shield-check-line text-xl w-6 h-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
            <span className="text-black font-medium">Gemaakt door ervaren vakpeople</span>
          </div>
        </div>
      </div>
    </section>
  );
}