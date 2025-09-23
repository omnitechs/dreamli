'use client';

export default function HowItWorksSchoolsNL() {
  const steps = [
    {
      number: 1,
      title: "Kies Formaat",
      description: "Kies uit workshop, programma of club opties",
      image: "https://readdy.ai/api/search-image?query=Professional%20Dutch%20educational%20consultant%20showing%20colorful%20program%20brochures%20and%20materials%20to%20Dutch%20school%20administrator%20in%20bright%20modern%20office%20setting%20in%20Netherlands%2C%20program%20options%20laid%20out%20on%20table%2C%20collaborative%20planning%20meeting%2C%20warm%20professional%20atmosphere&width=350&height=250&seq=schools-pick-format-nl&orientation=landscape"
    },
    {
      number: 2,
      title: "Wij Leveren",
      description: "Complette kits arriveren klaar voor gebruik",
      image: "https://readdy.ai/api/search-image?query=Neatly%20organized%20educational%20kit%20boxes%20being%20delivered%20to%20modern%20Dutch%20school%20entrance%2C%20colorful%20packaging%20with%20clear%20Dutch%20labels%2C%20professional%20delivery%20service%20in%20Netherlands%2C%20organized%20educational%20materials%20visible%20through%20clear%20packaging&width=350&height=250&seq=schools-we-deliver-nl&orientation=landscape"
    },
    {
      number: 3,
      title: "Voer Sessie Uit",
      description: "Eenvoudige setup, duidelijke instructies, betrokken leerlingen",
      image: "https://readdy.ai/api/search-image?query=Bright%20Dutch%20classroom%20scene%20with%20teacher%20leading%20creative%20session%2C%20diverse%20group%20of%20Dutch%20children%20aged%207-11%20actively%20painting%20small%203D%20figures%2C%20organized%20workspace%20with%20art%20supplies%2C%20engaged%20learning%20environment%20in%20Netherlands%20school%2C%20natural%20lighting&width=350&height=250&seq=schools-run-session-nl&orientation=landscape"
    },
    {
      number: 4,
      title: "Toon & Houd",
      description: "Leerlingen tonen hun creaties en nemen ze mee naar huis",
      image: "https://readdy.ai/api/search-image?query=Happy%20Dutch%20children%20proudly%20displaying%20their%20colorful%20painted%203D%20figures%20in%20Dutch%20classroom%20setting%2C%20excited%20expressions%2C%20finished%20artwork%20visible%2C%20celebration%20of%20creativity%2C%20warm%20classroom%20atmosphere%20with%20completed%20projects%20in%20Netherlands&width=350&height=250&seq=schools-show-keep-nl&orientation=landscape"
    }
  ];

  return (
    <section className="py-24 bg-[#FFF9F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-orange-700">Hoe Het Werkt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Eenvoudig 4-Stappen Proces
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Van planning tot voltooiing — wij regelen de complexiteit, jullie genieten van de resultaten
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Step number */}
              <div className="bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              
              {/* Image */}
              <div className="mb-6 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img 
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                <i className="ri-group-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">Leeftijd 6-12</span>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                <i className="ri-user-3-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">8-24 leerlingen</span>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-[#FFA726] rounded-full flex items-center justify-center">
                <i className="ri-shield-check-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">Veilige materialen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}