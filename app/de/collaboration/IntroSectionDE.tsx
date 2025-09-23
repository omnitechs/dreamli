export default function IntroSectionDE() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Warum unserer Designer-Community beitreten?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-palette-line text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kreative Freiheit</h3>
              <p className="text-gray-600">
                Drücken Sie Ihre künstlerische Vision mit vollständiger kreativer Kontrolle aus und präsentieren Sie Ihren einzigartigen Stil der Welt.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kollaboratives Netzwerk</h3>
              <p className="text-gray-600">
                Vernetzen Sie sich mit anderen Designern, teilen Sie Ideen und arbeiten Sie an aufregenden kreativen Projekten zusammen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-trophy-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Anerkennung</h3>
              <p className="text-gray-600">
                Lassen Sie Ihre Arbeit von einer Community anerkennen, die außergewöhnliches Design und Kreativität schätzt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}