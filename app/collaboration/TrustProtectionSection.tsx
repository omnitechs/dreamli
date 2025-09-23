'use client';

export default function TrustProtectionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trust & <span className="text-purple-600">Protection</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your security and success are our top priorities. We've built comprehensive protections for all partners.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-file-shield-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Legal Protection</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-contract-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Contracts</h4>
                  <p className="text-gray-700 text-sm">Clear terms, responsibilities, and expectations for every project</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-copyright-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">IP Protection</h4>
                  <p className="text-gray-700 text-sm">Your intellectual property rights are secured and respected</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-shield-check-line text-blue-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Dispute Resolution</h4>
                  <p className="text-gray-700 text-sm">Fair mediation process for any project-related issues</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-secure-payment-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Security</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-money-dollar-circle-line text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transparent Payments</h4>
                  <p className="text-gray-700 text-sm">Clear payment terms with no hidden fees or surprises</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-time-line text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Timely Compensation</h4>
                  <p className="text-gray-700 text-sm">Payments processed within 7 days of project completion</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <i className="ri-bank-line text-green-600 text-sm"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure Transactions</h4>
                  <p className="text-gray-700 text-sm">Bank-level security for all financial transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-heart-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Dreamli's Commitment to Fairness</h3>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              We believe in creating a platform where creativity thrives through mutual respect, fair compensation, and transparent processes. Our success depends on your success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-eye-line text-xl text-white"></i>
              </div>
              <h4 className="font-semibold mb-2">Full Transparency</h4>
              <p className="text-sm text-white/80">Open communication about processes, decisions, and platform changes</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-scales-line text-xl text-white"></i>
              </div>
              <h4 className="font-semibold mb-2">Equal Opportunity</h4>
              <p className="text-sm text-white/80">Fair access to projects regardless of location or experience level</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-line text-xl text-white"></i>
              </div>
              <h4 className="font-semibold mb-2">Ongoing Support</h4>
              <p className="text-sm text-white/80">Dedicated support team to help you succeed on our platform</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}