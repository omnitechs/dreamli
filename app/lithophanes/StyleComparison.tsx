
'use client';

import Link from 'next/link';

export default function StyleComparison() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/20 to-[#DBEAFE]/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
              Choose Your Style
            </h2>
            <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto">
              Select the perfect lithophane style that brings your vision to life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mono Lithophane */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-8">
                <img
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/1943632d5992ad0d4c2bbcc22fe7da51.png"
                  alt="Mono Lithophane Style"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 bg-[#2E2E2E] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Classic
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4">
                Mono Lithophane <span className="text-[#2E2E2E]/60">(Black & White)</span>
              </h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#2E2E2E]">€39.99</span>
                  <span className="text-[#2E2E2E]/60">per piece</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">Perfect for portraits & detailed photos</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">Classic, timeless look</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">High-contrast depth & shadows</span>
                </div>
              </div>

              <Link 
                href="#upload-mono" 
                className="w-full inline-flex items-center justify-center gap-3 bg-[#2E2E2E] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#2E2E2E]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-upload-line text-xl w-6 h-6 flex items-center justify-center"></i>
                Choose &amp; Upload
              </Link>
            </div>

            {/* CMYK Lithophane */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFB067] to-[#FF8A65] text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
                Popular!
              </div>

              <div className="relative mb-8">
                <img
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/6f2a341fa43f47ee198777232c326e8f.png"
                  alt="CMYK Lithophane Style"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Vibrant
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#2E2E2E] mb-4">
                CMYK Lithophane <span className="text-[#8472DF]">(Color)</span>
              </h3>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#2E2E2E]">€49.99</span>
                  <span className="text-[#2E2E2E]/60">per piece</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">Ideal for colorful images &amp; paintings</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">Vivid, glowing display</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-check-line text-[#4ADE80] text-xl w-6 h-6 flex items-center justify-center"></i>
                  <span className="text-[#2E2E2E]/80">Feels like illuminated artwork</span>
                </div>
              </div>

              <Link 
                href="#upload-color" 
                className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-upload-line text-xl w-6 h-6 flex items-center justify-center"></i>
                Choose &amp; Upload
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
