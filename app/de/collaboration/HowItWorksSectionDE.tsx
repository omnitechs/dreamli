'use client';

export default function HowItWorksSectionDE() {
  const steps = [
    {
      number: "01",
      title: "Registrieren und genehmigt werden",
      description: "Reichen Sie Ihre Bewerbung mit Portfolio-Beispielen ein und lassen Sie sich von unserem Team verifizieren.",
      icon: "ri-user-add-line",
      color: "purple"
    },
    {
      number: "02", 
      title: "Projekt-Dashboard aufrufen",
      description: "Durchsuchen Sie verfügbare Projekte mit detaillierten Anforderungen und Spezifikationen.",
      icon: "ri-dashboard-line",
      color: "blue"
    },
    {
      number: "03",
      title: "Ihren Vorschlag einreichen",
      description: "Schlagen Sie Ihr Budget und Ihre Lieferzeit für Projekte vor, die Sie interessieren.",
      icon: "ri-file-text-line", 
      color: "green"
    },
    {
      number: "04",
      title: "Zusammenarbeiten & liefern",
      description: "Arbeiten Sie mit dem Dreamli-Team zusammen, um Projekte zu vervollständigen und außergewöhnliche Ergebnisse zu liefern.",
      icon: "ri-team-line",
      color: "orange"
    },
    {
      number: "05",
      title: "Bezahlt werden & wachsen",
      description: "Erhalten Sie faire Vergütung und bauen Sie Ihren Ruf in unserer Community auf.",
      icon: "ri-trophy-line",
      color: "pink"
    }
  ];

  const colorClasses = {
    purple: {
      bg: "bg-purple-600",
      light: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-600"
    },
    blue: {
      bg: "bg-blue-600", 
      light: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600"
    },
    green: {
      bg: "bg-green-600",
      light: "bg-green-50", 
      border: "border-green-100",
      text: "text-green-600"
    },
    orange: {
      bg: "bg-orange-600",
      light: "bg-orange-50",
      border: "border-orange-100", 
      text: "text-orange-600"
    },
    pink: {
      bg: "bg-pink-600",
      light: "bg-pink-50",
      border: "border-pink-100",
      text: "text-pink-600"
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Wie es <span className="text-purple-600">funktioniert</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Unser optimierter Prozess macht es einfach, beizutreten, zusammenzuarbeiten und auf der Dreamli-Plattform erfolgreich zu sein.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 via-green-200 via-orange-200 to-pink-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color];
              return (
                <div key={index} className={`${colors.light} ${colors.border} border rounded-3xl p-6 text-center relative`}>
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <i className={`${step.icon} text-2xl text-white`}></i>
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-8 h-8 ${colors.bg} text-white text-sm font-bold rounded-full mb-4`}>
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-rocket-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bereit anzufangen?</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Der Prozess ist einfach und transparent. Treten Sie Tausenden von Kreativprofis bei, die bereits Teil der Dreamli-Community sind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-palette-line mr-2"></i>
                Als Designer bewerben
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}