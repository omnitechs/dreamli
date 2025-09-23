
'use client';

import { useState } from 'react';

export default function KeychainHero() {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/8001b8cf3ba37551025d17bdabd39401.png')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Custom Keychains — Name or Photo, Made in PLA+
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Live preview • Up to 25 cm • NFC optional • Free shipping over €50
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#tab-name"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Start with Name (€19,99)
              </a>
              <a
                href="#tab-photo"
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Start with Photo (€29,99)
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-gray-200">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                  <i className="ri-recycle-line text-green-600 text-xl"></i>
                </div>
                <span className="text-sm text-gray-600">PLA+ Material</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
                  <i className="ri-map-pin-line text-blue-600 text-xl"></i>
                </div>
                <span className="text-sm text-gray-600">Made in Groningen</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full">
                  <i className="ri-bank-card-line text-purple-600 text-xl"></i>
                </div>
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full">
                  <i className="ri-nfc-line text-orange-600 text-xl"></i>
                </div>
                <span className="text-sm text-gray-600">NFC Optional</span>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="relative">
              <img
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/bbfb8fa6e81f7d83d9a8938d1bcf8447.webp"
                alt="Custom Keychains Collection"
                className="w-full rounded-2xl shadow-2xl object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Live Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
