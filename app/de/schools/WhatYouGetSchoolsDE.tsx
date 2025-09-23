'use client';

export default function WhatYouGetSchoolsDE() {
  const benefits = [
    {
      title: "Fertige Kits",
      description: "Alles vorbereitet und verpackt — einfach öffnen und kreativ werden",
      icon: "ri-box-3-fill",
      color: "from-blue-400 to-cyan-400"
    },
    {
      title: "Bewiesene Fähigkeitsentwicklung", 
      description: "Messbare Verbesserungen in Fokus, Selbstvertrauen und Problemlösung",
      icon: "ri-trophy-fill",
      color: "from-green-400 to-emerald-400"
    },
    {
      title: "Lehrerfreundlich",
      description: "Keine spezielle Schulung erforderlich — klare Anweisungen enthalten", 
      icon: "ri-user-smile-fill",
      color: "from-purple-400 to-pink-400"
    },
    {
      title: "Flexible Formate",
      description: "Einmalige Workshops, mehrtägige Programme oder monatliche Clubs",
      icon: "ri-settings-3-fill",
      color: "from-orange-400 to-yellow-400"
    }
  ];

  return (
    <section className="py-24 bg-[#F9FBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Jedes Kind wird mit einer Kreation gehen, auf die es stolz ist — oder wir führen kostenlos eine weitere Sitzung durch.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  <i className={`${benefit.icon} text-2xl text-white`}></i>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}