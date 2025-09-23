'use client';

export default function HowItWorksSectionNL() {
  const steps = [
    {
      number: "01",
      title: "Registreer Je Rol",
      description: "Meld je aan als Ontwerper of Fabrikant en vul je professionele profiel aan met je expertise en portfolio.",
      icon: "ri-user-add-line",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "02", 
      title: "Dien Je Voorstel In",
      description: "Deel je productideeën, concepten of partnerschapsvoorstellen. Voeg gedetailleerde specificaties en samenwerkingsvoorkeuren toe.",
      icon: "ri-upload-cloud-line",
      color: "from-blue-500 to-purple-500"
    },
    {
      number: "03",
      title: "Start Met Samenwerken", 
      description: "Krijg beoordeling en goedkeuring van ons team, en begin vervolgens samen te werken met gematchte partners om ideeën tot leven te brengen.",
      icon: "ri-team-line",
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hoe Het Werkt
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beginnen met de Samenwerkingshub is eenvoudig. Volg deze drie stappen om je creatieve reis met ons te starten.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 transform translate-x-4 z-0"></div>
              )}
              
              <div className="relative z-10 text-center">
                {/* Step number and icon */}
                <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-xl`}>
                  <div className="text-center">
                    <div className="text-white text-sm font-bold mb-1">{step.number}</div>
                    <i className={`${step.icon} text-3xl text-white`}></i>
                  </div>
                </div>

                {/* Step content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Process illustration */}
        <div className="mt-16">
          <img 
            src="https://readdy.ai/api/search-image?query=Professional%20collaboration%20process%20illustration%20showing%20designers%20and%20manufacturers%20working%20together%20on%20children%20products%2C%20step-by-step%20workflow%20with%20registration%2C%20proposal%20submission%2C%20and%20collaboration%20phases%2C%20modern%20flat%20design%20style%20with%20bright%20colors%2C%20clean%20and%20organized%20layout&width=800&height=300&seq=process-flow-nl&orientation=landscape"
            alt="Samenwerkingsproces"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}