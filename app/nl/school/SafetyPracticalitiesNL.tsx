'use client';

export default function SafetyPracticalitiesNL() {
  const safetyFeatures = [
    "Watergebaseerde, niet-giftige verf",
    "Kindveilig gereedschap",
    "Morsbestendige containers, schorten inbegrepen", 
    "Opruimen in 5 min"
  ];

  return (
    <section className="py-24 bg-[#F3F7F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Veilig voor kinderen, stressvrij voor leerkrachten.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Safety features */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6">
                {safetyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-fill text-green-600 text-lg"></i>
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#FFA726] mb-2">5 min</div>
                <div className="text-sm text-gray-600">Opzettijd</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#FFA726] mb-2">0</div>
                <div className="text-sm text-gray-600">Training vereist</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#FFA726] mb-2">100%</div>
                <div className="text-sm text-gray-600">Rommelvij</div>
              </div>
            </div>
          </div>

          {/* Right side - Collage image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Close-up%20of%20organized%20art%20supplies%20on%20clean%20white%20table%20in%20Dutch%20classroom%20setting%2C%20water-based%20paints%20in%20spill-proof%20containers%2C%20protective%20table%20mats%2C%20wet%20wipes%2C%20child-safe%20brushes%2C%20organized%20and%20safe%20educational%20materials%20in%20Netherlands%20school&width=250&height=200&seq=safety-supplies-nl&orientation=landscape"
                    alt="Veilige kunstbenodigdheden"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Dutch%20teacher%20easily%20cleaning%20up%20classroom%20after%20art%20activity%2C%20quick%20cleanup%20process%2C%20organized%20workspace%2C%20smiling%20teacher%20with%20cleaning%20supplies%2C%20efficient%20classroom%20management%20in%20Netherlands%2C%20bright%20clean%20environment&width=250&height=160&seq=easy-cleanup-nl&orientation=landscape"
                    alt="Eenvoudig opruimen"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Dutch%20children%20wearing%20colorful%20protective%20aprons%20while%20painting%20in%20bright%20Dutch%20classroom%2C%20safe%20creative%20environment%2C%20washable%20materials%2C%20organized%20classroom%20setting%20in%20Netherlands%2C%20kids%20focused%20on%20creative%20work&width=250&height=160&seq=protective-aprons-nl&orientation=landscape"
                    alt="Kinderen met beschermende schorten"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Storage%20containers%20and%20organization%20system%20for%20Dutch%20classroom%20art%20supplies%2C%20neat%20labeled%20boxes%20in%20Dutch%2C%20secure%20storage%20solutions%2C%20organized%20educational%20materials%2C%20professional%20Dutch%20classroom%20setup&width=250&height=200&seq=storage-system-nl&orientation=landscape"
                    alt="Opbergoplossingen"
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-medal-fill text-white text-lg"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">CE Gecertificeerd</p>
                  <p className="text-gray-600 text-xs">EU veiligheidsnormen</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}