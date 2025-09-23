
'use client';

export default function SafetyPracticalities() {
  const safetyFeatures = [
    "Water-based, non-toxic paints",
    "Child-safe tools",
    "Spill-proof containers, aprons included", 
    "Cleanup in 5 min"
  ];

  return (
    <section className="py-24 bg-[#F3F7F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Safe for children, stress-free for teachers.
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
                <div className="text-sm text-gray-600">Setup time</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#FFA726] mb-2">0</div>
                <div className="text-sm text-gray-600">Training required</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-[#FFA726] mb-2">100%</div>
                <div className="text-sm text-gray-600">Mess-free</div>
              </div>
            </div>
          </div>

          {/* Right side - Collage image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Close-up%20of%20organized%20art%20supplies%20on%20clean%20white%20table%20in%20classroom%20setting%2C%20water-based%20paints%20in%20spill-proof%20containers%2C%20protective%20table%20mats%2C%20wet%20wipes%2C%20child-safe%20brushes%2C%20organized%20and%20safe%20educational%20materials&width=250&height=200&seq=safety-supplies&orientation=landscape"
                    alt="Safe art supplies"
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Teacher%20easily%20cleaning%20up%20classroom%20after%20art%20activity%2C%20quick%20cleanup%20process%2C%20organized%20workspace%2C%20smiling%20teacher%20with%20cleaning%20supplies%2C%20efficient%20classroom%20management%2C%20bright%20clean%20environment&width=250&height=160&seq=easy-cleanup&orientation=landscape"
                    alt="Easy cleanup"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Children%20wearing%20colorful%20protective%20aprons%20while%20painting%20in%20bright%20classroom%2C%20safe%20creative%20environment%2C%20washable%20materials%2C%20organized%20classroom%20setting%2C%20kids%20focused%20on%20creative%20work&width=250&height=160&seq=protective-aprons&orientation=landscape"
                    alt="Children with protective aprons"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Storage%20containers%20and%20organization%20system%20for%20classroom%20art%20supplies%2C%20neat%20labeled%20boxes%2C%20secure%20storage%20solutions%2C%20organized%20educational%20materials%2C%20professional%20classroom%20setup&width=250&height=200&seq=storage-system&orientation=landscape"
                    alt="Storage solutions"
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
                  <p className="font-bold text-gray-900 text-sm">CE Certified</p>
                  <p className="text-gray-600 text-xs">EU safety standards</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
