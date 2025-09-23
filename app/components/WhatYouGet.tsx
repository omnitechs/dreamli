'use client';

import { useState } from 'react';
import UploadForm from './UploadForm';

export default function WhatYouGet() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Get</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything included in your Dreamli kit and experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">Their very first practice figurine to get excited about the process</span>
                <span className="text-xl font-bold text-blue-700">€20</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">Professional painting supplies to bring their creation to life</span>
                <span className="text-xl font-bold text-green-700">€15</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">1 designed 3D-printed toy</span>
                <span className="text-xl font-bold text-purple-700">€100</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">Unlimited access to your Memory Page (first year)</span>
                <span className="text-xl font-bold text-orange-700">€20</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Share & earn: €1 per like, €2 per comment, €0.5 per view</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">5 NFC keychains to share your page</span>
                <span className="text-xl font-bold text-pink-700">€25</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">50% discount coupon for your loved ones</span>
                <span className="text-xl font-bold text-indigo-700">€68.50</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl lg:col-span-3 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">40% lifetime discount for Dreamli Academy + Learn & Earn</span>
                <span className="text-xl font-bold text-yellow-700">Priceless</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Value Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total value (excluding "priceless")</p>
                <p className="text-3xl font-bold text-gray-900">€248.50+</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Your price today</p>
                <p className="text-3xl font-bold text-green-600">€137</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">You save</p>
                <p className="text-3xl font-bold text-purple-600">€111.50+</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-6">
              You're not buying a random figure—you're turning your child's drawing into a custom 3D keepsake with tools, 
              a Memory Page to follow progress, and rewards when friends engage.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Notes:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Memory Page access listed as first-year value (renewal optional).</li>
              <li>• Share & earn payouts are per engagement on your Memory Page.</li>
              <li>• The 50% coupon can be gifted to a loved one for a future order.</li>
              <li>• Dreamli Academy & Learn & Earn: lifetime 40% discount (priceless benefit).</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-900 mb-6">
              Ready to get everything above for €137?
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Start for Free
            </button>
          </div>
        </div>
      </section>

      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}