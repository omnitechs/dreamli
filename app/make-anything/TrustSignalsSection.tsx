
export default function TrustSignalsSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
            <div className="text-gray-600 text-sm">Happy customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
            <div className="text-gray-600 text-sm">Approval rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
            <div className="text-gray-600 text-sm">Customer rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">7-10</div>
            <div className="text-gray-600 text-sm">Days delivery</div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Why customers trust us</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-green-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">100% Satisfaction Guarantee</h4>
              <p className="text-gray-600 text-sm">If your 3D print doesn't match the approved preview, we'll reprint for free or refund completely.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-eye-line text-blue-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">See Before You Pay</h4>
              <p className="text-gray-600 text-sm">Never pay upfront. Review and approve your 3D model preview first. Only charge when you confirm the order.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-tools-line text-purple-600 text-2xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Quality</h4>
              <p className="text-gray-600 text-sm">Industrial-grade 3D printers and premium materials. Each piece is hand-finished and quality-checked.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
