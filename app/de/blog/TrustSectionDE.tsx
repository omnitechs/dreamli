'use client';

export default function TrustSectionDE() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <i className="ri-heart-3-line text-2xl text-white w-6 h-6 flex items-center justify-center"></i>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Warum dieser Blog wichtig ist</h2>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            Dreamli basiert auf Forschungsergebnissen, die zeigen, wie kreatives Spielen Konzentration, Problemlösung und Selbstvertrauen bei Kindern stärkt. 
            Unser Blog teilt Expertenrat, Familiengeschichten und inspirierende Aktivitäten, um Ihnen zu helfen, die Fantasie Ihres Kindes zu fördern.
          </p>
          
          <p>
            Jeder Artikel wird mit Sorgfalt von Kindesentwicklungsexperten, Pädagogen und echten Eltern verfasst, die die Magie verstehen, 
            die entsteht, wenn Kreativität auf Lernen trifft.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Forschungs-</div>
            <div className="text-sm text-gray-600">basierte Inhalte</div>
          </div>
        </div>
      </div>
    </section>
  );
}