'use client';

export default function BenefitsSectionDE() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Designer <span className="text-purple-600">Vorteile</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Treten Sie einer Plattform bei, die darauf ausgelegt ist, Kreativprofis mit sinnvollen Belohnungen, 
            kreativer Freiheit und langfristigen Wachstumsmöglichkeiten zu unterstützen.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 border border-purple-100">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mr-6">
                <i className="ri-palette-line text-2xl text-white"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Für kreative Designer</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-brush-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Kreative Freiheit</h4>
                <p className="text-sm text-gray-600">Drücken Sie Ihre künstlerische Vision aus, während Sie Kinderträume zum Leben erwecken</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-money-dollar-circle-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Umsatzbeteiligung</h4>
                <p className="text-sm text-gray-600">Verdienen Sie wettbewerbsfähige Vergütung für jedes abgeschlossene Projekt</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-eye-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Portfolio-Sichtbarkeit</h4>
                <p className="text-sm text-gray-600">Präsentieren Sie Ihre Arbeit Familien und bauen Sie Ihren Ruf auf</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-community-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Community-Anerkennung</h4>
                <p className="text-sm text-gray-600">Werden Sie als Teil unserer kreativen Community gefeiert</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-star-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Plattform-Schutz & Support</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-shield-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Rechtlicher Schutz</h4>
              <p className="text-gray-700">Umfassende Verträge und IP-Schutz für all Ihre kreativen Arbeiten</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-balance-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Faire Verträge</h4>
              <p className="text-gray-700">Transparente Bedingungen und gerechte Umsatzbeteiligungsvereinbarungen</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-plant-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Langfristiges Wachstum</h4>
              <p className="text-gray-700">Nachhaltige Partnerschaften, die mit Ihrer kreativen Laufbahn wachsen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}