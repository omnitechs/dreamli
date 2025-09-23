'use client';

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Designer <span className="text-purple-600">Benefits</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Join a platform designed to support creative professionals with meaningful rewards, 
            creative freedom, and long-term growth opportunities.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 border border-purple-100">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mr-6">
                <i className="ri-palette-line text-2xl text-white"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">For Creative Designers</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-brush-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Creative Freedom</h4>
                <p className="text-sm text-gray-600">Express your artistic vision while bringing children's dreams to life</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-money-dollar-circle-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Revenue Share</h4>
                <p className="text-sm text-gray-600">Earn competitive compensation for every project completed</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-eye-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Portfolio Visibility</h4>
                <p className="text-sm text-gray-600">Showcase your work to families and build your reputation</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="ri-community-line text-purple-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Community Recognition</h4>
                <p className="text-sm text-gray-600">Be celebrated as part of our creative community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-star-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Protection & Support</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-shield-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Legal Protection</h4>
              <p className="text-gray-700">Comprehensive contracts and IP protection for all your creative work</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-balance-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fair Contracts</h4>
              <p className="text-gray-700">Transparent terms and equitable revenue sharing agreements</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-plant-line text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Long-term Growth</h4>
              <p className="text-gray-700">Sustainable partnerships that grow with your creative career</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}