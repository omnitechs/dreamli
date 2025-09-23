'use client';

export default function GuaranteeSectionDE() {
  return (
    <section className="py-24 bg-[#F0F9FF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Kein Risiko für Schulen.
        </h2>
        
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-blue-100">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-shield-check-fill text-3xl text-white"></i>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Wenn Sie nach dem ersten Durchlauf nicht zufrieden sind, erstatten wir Ihnen das Geld zurück – ohne Fragen zu stellen.
          </p>
          
          <div className="mt-8 inline-flex items-center space-x-3 bg-green-50 rounded-full px-6 py-3 border border-green-200">
            <i className="ri-award-fill text-green-600 text-lg"></i>
            <span className="text-green-700 font-semibold">100% Zufriedenheitsgarantie</span>
          </div>
        </div>
      </div>
    </section>
  );
}