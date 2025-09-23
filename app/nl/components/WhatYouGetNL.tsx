
'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';

export default function WhatYouGetNL() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wat Je Krijgt</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alles wat inbegrepen is in je Dreamli-kit en ervaring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">1 oefenfiguurtje</span>
                <span className="text-xl font-bold text-blue-700">€20</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">1 verfkit</span>
                <span className="text-xl font-bold text-green-700">€15</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">1 ontworpen 3D-geprint speeltje</span>
                <span className="text-xl font-bold text-purple-700">€100</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">Onbeperkte toegang tot je Herinneringspagina (eerste jaar)</span>
                <span className="text-xl font-bold text-orange-700">€20</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Deel & verdien: €1 per like, €2 per reactie, €0,5 per weergave
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">5 NFC-sleutelhangers om je pagina te delen</span>
                <span className="text-xl font-bold text-pink-700">€25</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">50% kortingscoupon voor je dierbaren</span>
                <span className="text-xl font-bold text-indigo-700">€68,50</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl lg:col-span-3 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-800">40% levenslange korting voor Dreamli Academy + Leer & Verdien</span>
                <span className="text-xl font-bold text-yellow-700">Onbetaalbaar</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Waarde Overzicht</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-2">Totale waarde (exclusief "onbetaalbaar")</p>
                <p className="text-3xl font-bold text-gray-900">€248,50+</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Jouw prijs vandaag</p>
                <p className="text-3xl font-bold text-green-600">€137</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Je bespaart</p>
                <p className="text-3xl font-bold text-purple-600">€111,50+</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-6">
              Je koopt geen willekeurig figuur—je verandert de tekening van je kind in een aangepast 3D-aandenken met tools, 
              een Herinneringspagina om de voortgang te volgen, en beloningen wanneer vrienden reageren.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Opmerkingen:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Toegang tot Herinneringspagina vermeld als waarde van het eerste jaar (verlenging optioneel).</li>
              <li>• Deel & verdien uitbetalingen zijn per interactie op je Herinneringspagina.</li>
              <li>• De 50% coupon kan worden weggegeven aan een dierbare voor een toekomstige bestelling.</li>
              <li>• Dreamli Academy & Leer & Verdien: levenslange 40% korting (onbetaalbaar voordeel).</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-900 mb-6">
              Klaar om alles hierboven te krijgen voor €137?
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Start Gratis
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
