
'use client';

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mb-6">
          Ready to bring your image to life?
        </h2>
        <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
          Upload your photo or drawing now. See the live 3D preview instantly. 
          Only pay when you love the result.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-full text-xl font-bold transition-colors duration-200 whitespace-nowrap cursor-pointer shadow-xl">
            Upload & Preview Free
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-full text-xl font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer">
            See Examples First
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-eye-line text-white text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">See before you buy</h3>
            <p className="text-sm opacity-80">3D preview first, payment later</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-tools-line text-white text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">Free adjustments</h3>
            <p className="text-sm opacity-80">Perfect it until you're happy</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-line text-white text-2xl"></i>
            </div>
            <h3 className="font-semibold mb-2">Money-back guarantee</h3>
            <p className="text-sm opacity-80">30 days, no questions asked</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6">Why thousands choose us</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">2,847+</div>
              <div className="text-sm opacity-80">Happy customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98.5%</div>
              <div className="text-sm opacity-80">Approval rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4.9★</div>
              <div className="text-sm opacity-80">Average rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">7-10</div>
              <div className="text-sm opacity-80">Days delivery</div>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-70 mt-8">
          No payment required for 3D preview • Secure checkout • Made in Netherlands
        </p>
      </div>
    </section>
  );
}
