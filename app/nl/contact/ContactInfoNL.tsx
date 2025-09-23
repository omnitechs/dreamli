'use client';

export default function ContactInfoNL() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/31645559587', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#F6EBD9] to-[#FBD4D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Over Dreamli
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Wij zijn gepassioneerd over het tot leven brengen van de creativiteit van kinderen door middel van innovatieve 3D-printtechnologie en het creëren van blijvende digitale herinneringen voor gezinnen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
              <i className="ri-phone-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Telefoon & WhatsApp</h3>
            <p className="text-gray-700 mb-4">Bel ons of stuur een bericht</p>
            <p className="text-lg font-semibold text-gray-900 mb-4">+31 6 45559587</p>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              <i className="ri-whatsapp-fill text-xl"></i>
              <span>Chat via WhatsApp</span>
            </button>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
              <i className="ri-mail-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">E-mail</h3>
            <p className="text-gray-700 mb-4">Stuur ons altijd een e-mail</p>
            <a 
              href="mailto:info@dreamli.nl"
              className="text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
            >
              info@dreamli.nl
            </a>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6">
              <i className="ri-map-pin-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Adres</h3>
            <p className="text-gray-700 mb-4">Bezoek ons in Groningen</p>
            <p className="text-lg text-gray-900">
              Resedastraat 39<br />
              9713 TN Groningen<br />
              Nederland
            </p>
            <p className="text-sm text-gray-600 mt-3">
              KvK: 93814429
            </p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-time-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Openingstijden</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Maandag - Vrijdag</span>
              <span className="font-semibold text-gray-900">9:00 - 17:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Zaterdag</span>
              <span className="font-semibold text-gray-900">Op Afspraak</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Zondag</span>
              <span className="font-semibold text-gray-900">Gesloten</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}