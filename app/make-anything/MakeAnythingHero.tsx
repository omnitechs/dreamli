
'use client';

import { useState } from 'react';

export default function MakeAnythingHero() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Split%20screen%20composition%20showing%20a%20realistic%20child%20drawing%20of%20a%20dinosaur%20on%20paper%20on%20the%20left%20side%2C%20and%20a%20professional%20high-quality%203D%20printed%20colorful%20dinosaur%20figurine%20on%20the%20right%20side%2C%20clean%20white%20background%2C%20professional%20product%20photography%20lighting%2C%20showcasing%20the%20transformation%20from%202D%20to%203D%2C%20detailed%20textures%20visible&width=1920&height=1080&seq=hero-before-after&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block mb-6">
              ✓ 2,847+ satisfied customers
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn any photo into a real 3D object
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload your photo or drawing. Watch our AI create a live 3D preview you can rotate and inspect. 
              Only pay when you approve the result.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700">See exact 3D preview before paying</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700">Free adjustments until you're happy</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <span className="text-gray-700">Delivered in 7-10 days after approval</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                Upload & Preview Free
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer">
                See Examples
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="ri-shield-check-line text-green-600"></i>
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-truck-line text-blue-600"></i>
                <span>Free shipping over €50</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-customer-service-2-line text-purple-600"></i>
                <span>Personal support</span>
              </div>
            </div>
          </div>

          {/* Right Content - Process Visual */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">How it works</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-upload-2-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">1. Upload your image</h4>
                  <p className="text-gray-600 text-sm">Any photo or drawing (JPG/PNG)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-3d-view-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">2. AI creates 3D preview</h4>
                  <p className="text-gray-600 text-sm">Rotate, zoom, request changes</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-check-double-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">3. Approve & order</h4>
                  <p className="text-gray-600 text-sm">Choose size, colors, confirm order</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-gift-line text-orange-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">4. Receive your object</h4>
                  <p className="text-gray-600 text-sm">Professional 3D printing & delivery</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Starting from</p>
              <p className="text-2xl font-bold text-gray-900">€30</p>
              <p className="text-xs text-gray-500">Small size, single color</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
