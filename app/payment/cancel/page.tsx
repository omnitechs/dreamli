'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = searchParams.get('session_id');
    if (session) {
      setSessionId(session);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-200/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-purple-200/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating elements */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Cancel Icon */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <i className="ri-close-line text-6xl text-white"></i>
                </div>
                <div className="absolute -inset-4 bg-orange-400/20 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Payment Cancelled
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                No worries! Your payment was cancelled and no charges were made.
              </p>
            </div>

            {/* Information Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/70 mb-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">What happened?</h2>
                <p className="text-gray-600">Your payment process was interrupted or cancelled</p>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <i className="ri-information-line text-2xl text-orange-600"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 mb-2">No charges were made</h4>
                      <p className="text-orange-700 leading-relaxed">
                        Your payment method was not charged. You can safely try again or choose a different payment option.
                      </p>
                    </div>
                  </div>
                </div>

                {sessionId && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Session ID</span>
                      <span className="text-gray-600 text-sm font-mono bg-white px-3 py-1 rounded-lg">
                        {sessionId.slice(0, 20)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why this might happen */}
            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-3xl p-8 shadow-xl border border-white/50 mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Common reasons for cancellation</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className="ri-arrow-right-line text-lg text-gray-600"></i>
                  </div>
                  <p className="text-gray-700">You clicked the back button or closed the payment window</p>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className="ri-arrow-right-line text-lg text-gray-600"></i>
                  </div>
                  <p className="text-gray-700">Payment session timed out due to inactivity</p>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className="ri-arrow-right-line text-lg text-gray-600"></i>
                  </div>
                  <p className="text-gray-700">There was an issue with your payment method</p>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 flex items-center justify-center mt-1">
                    <i className="ri-arrow-right-line text-lg text-gray-600"></i>
                  </div>
                  <p className="text-gray-700">You decided to review your order before completing</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <button
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-6 rounded-3xl font-bold text-lg hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-3">
                  <i className="ri-arrow-left-line text-2xl"></i>
                  <span>Try Payment Again</span>
                </div>
              </button>

              <Link
                href="/"
                className="bg-white text-gray-800 px-8 py-6 rounded-3xl font-bold text-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:scale-105 text-center"
              >
                <div className="flex items-center justify-center space-x-3">
                  <i className="ri-home-line text-2xl"></i>
                  <span>Back to Home</span>
                </div>
              </Link>
            </div>

            {/* Additional Options */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Need help with your order?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/contact"
                  className="text-center p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-customer-service-line text-xl text-blue-600"></i>
                  </div>
                  <p className="font-medium text-gray-800">Contact Support</p>
                  <p className="text-sm text-gray-600 mt-1">Get help with payment</p>
                </Link>

                <div className="text-center p-4 rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-phone-line text-xl text-green-600"></i>
                  </div>
                  <p className="font-medium text-gray-800">Call Us</p>
                  <p className="text-sm text-gray-600 mt-1">1-800-DREAMLI</p>
                </div>

                <div className="text-center p-4 rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-mail-line text-xl text-purple-600"></i>
                  </div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <p className="text-sm text-gray-600 mt-1">support@dreamli.com</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Still have questions about payments or our service?
              </p>
              <Link
                href="/faq"
                className="text-[#B9E4C9] hover:text-[#a8d9b8] font-medium underline transition-colors"
              >
                Check our FAQ section
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B9E4C9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}