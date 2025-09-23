'use client';

export default function BenefitsSectionNL() {
  const benefits = [
    {
      icon: "ri-shield-check-line",
      title: "Vertrouwen & Veiligheid",
      description: "Werk samen met geverifieerde partners in een veilige omgeving. Alle samenwerkingen worden beschermd door uitgebreide overeenkomsten en ons vertrouwde platform.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "ri-eye-line",
      title: "Maximale Exposure",
      description: "Krijg zichtbaarheid via Dreamli's gevestigde netwerk van gezinnen en brancheverbindingen. Je werk bereikt het juiste publiek.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "ri-money-dollar-circle-line",
      title: "Omzetdeling",
      description: "Eerlijke en transparante omzetdelingsmodellen zorgen ervoor dat alle partners profiteren van succesvolle samenwerkingen en productlanceringen.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: "ri-plant-line",
      title: "Creatief Ecosysteem",
      description: "Wordt onderdeel van een bloeiende gemeenschap gericht op het creëren van betekenisvolle, educatieve en leuke ervaringen voor kinderen wereldwijd.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Waarom Kiezen Voor Onze Hub?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Wordt lid van een gemeenschap die creativiteit, innovatie en betekenisvolle impact waardeert. Dit maakt onze Samenwerkingshub uniek.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                <i className={`${benefit.icon} text-2xl text-white`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Creatieve Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Producten Gecreëerd</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Landen Bereikt</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Partner Tevredenheid</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}