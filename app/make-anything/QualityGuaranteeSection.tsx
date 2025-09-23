
export default function QualityGuaranteeSection() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Our quality guarantee
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We stand behind every print. If it doesn't match your approved preview, we'll make it right.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-shield-check-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Match Guarantee</h3>
                  <p className="text-gray-600">Your physical print will match the approved 3D preview exactly. If not, we reprint for free.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-refresh-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Replacements</h3>
                  <p className="text-gray-600">Damaged during shipping? Manufacturing defect? We'll send a replacement at no cost.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-customer-service-2-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Support</h3>
                  <p className="text-gray-600">Direct contact with our team. Real humans who care about your project and satisfaction.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Money-Back Guarantee</h3>
                  <p className="text-gray-600">Not satisfied with the result? Full refund within 30 days of delivery. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What our customers say</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-gray-700 mb-2">"The 3D print matched the preview perfectly. Amazing quality and super fast delivery!"</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                  <span className="text-sm text-gray-600">- Sarah M.</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-700 mb-2">"My daughter's drawing became a beautiful figurine. The team even made small improvements!"</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                  <span className="text-sm text-gray-600">- Mike R.</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-gray-700 mb-2">"Professional service from start to finish. The preview feature is brilliant!"</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                  </div>
                  <span className="text-sm text-gray-600">- Lisa K.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600 mb-2">Average rating</div>
              <div className="flex justify-center text-yellow-400 mb-2">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
              </div>
              <div className="text-sm text-gray-500">Based on 2,847+ reviews</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer">
            Start your risk-free order
          </button>
          <p className="text-sm text-gray-600 mt-4">No payment required for preview • 30-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
}
