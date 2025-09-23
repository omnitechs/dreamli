'use client';

export default function ContactMapNL() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Vind Ons
          </h2>
          <p className="text-xl text-gray-700">
            Gelegen in het hart van Groningen, Nederland
          </p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2389.123456789!2d6.566589!3d53.212345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sResedastraat%2039%2C%209713%20TN%20Groningen%2C%20Netherlands!5e0!3m2!1snl!2snl!4v1234567890123!5m2!1snl!2snl"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dreamli Locatie - Resedastraat 39, 9713 TN Groningen"
          ></iframe>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Makkelijk bereikbaar met het openbaar vervoer of de auto. Gratis parkeren beschikbaar in de buurt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <i className="ri-bus-fill text-purple-500"></i>
              <span>Bushalte: 2 minuten lopen</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <i className="ri-car-fill text-purple-500"></i>
              <span>Gratis parkeren beschikbaar</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <i className="ri-bike-fill text-purple-500"></i>
              <span>Fietsvriendelijke locatie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}