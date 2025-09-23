'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    amount: '$29.99',
    productName: 'Dreamli Creation',
    orderNumber: 'DRM-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  });

  useEffect(() => {
    const session = searchParams.get('session_id');
    if (session) {
      setSessionId(session);
      // In real implementation, fetch order details from Stripe session
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-purple-200/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating stars */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <i className="ri-star-fill text-yellow-300 text-sm"></i>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                  <i className="ri-check-line text-6xl text-white"></i>
                </div>
                <div className="absolute -inset-4 bg-green-400/20 rounded-full animate-ping"></div>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                🎉 Congratulations! Your magical Dreamli journey is about to begin
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/70 mb-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmation</h2>
                <p className="text-gray-600">Your order has been processed successfully</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Order Number</span>
                  <span className="text-gray-900 font-bold">{orderDetails.orderNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Product</span>
                  <span className="text-gray-900 font-bold">{orderDetails.productName}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Amount Paid</span>
                  <span className="text-2xl font-bold text-green-600">{orderDetails.amount}</span>
                </div>

                {sessionId && (
                  <div className="flex justify-between items-center py-4">
                    <span className="text-gray-700 font-medium">Session ID</span>
                    <span className="text-gray-600 text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg">
                      {sessionId.slice(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-3xl p-8 shadow-xl border border-white/50 mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What happens next?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Email Confirmation</h4>
                    <p className="text-gray-600">You'll receive an order confirmation email within minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Creation Process</h4>
                    <p className="text-gray-600">Our team will begin bringing your child's drawing to life</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Delivery Updates</h4>
                    <p className="text-gray-600">Track your order progress through email notifications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-6 rounded-3xl font-bold text-lg hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:scale-105 text-center"
              >
                <div className="flex items-center justify-center space-x-3">
                  <i className="ri-dashboard-line text-2xl"></i>
                  <span>Go to Dashboard</span>
                </div>
              </Link>

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

            {/* Support Section */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Questions about your order? We're here to help!
              </p>
              <Link
                href="/contact"
                className="text-[#B9E4C9] hover:text-[#a8d9b8] font-medium underline transition-colors"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B9E4C9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}