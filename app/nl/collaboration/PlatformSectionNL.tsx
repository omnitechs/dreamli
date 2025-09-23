'use client';

import { useState } from 'react';
import ManufacturerModal from '../../collaboration/ManufacturerModal';

export default function PlatformSectionNL() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Het <span className="text-purple-600">Platform</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We creëren een freelance-stijl platform dat eerlijke concurrentie, transparantie en kansen voor iedereen garandeert.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-login-circle-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Toegang tot Projecten</h3>
            <p className="text-gray-700">
              Log in om beschikbare projecten te zien met duidelijke vereisten inclusief tekeningen, producttypen en doelmaterialen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-file-text-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Voorstellen Indienen</h3>
            <p className="text-gray-700">
              Stel je budget en leveringstijd voor bij projecten die passen bij je vaardigheden en interesses.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-award-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Geselecteerd Worden</h3>
            <p className="text-gray-700">
              Dreamli beoordeelt alle voorstellen en wijst projecten toe aan de beste match op basis van kwaliteit, tijdlijn en budget.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Transparant & Eerlijk Proces</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="ri-shield-check-line text-xl mr-3"></i>
                  Duidelijke projecteisen en verwachtingen
                </li>
                <li className="flex items-center">
                  <i className="ri-eye-line text-xl mr-3"></i>
                  Transparant beoordelingsproces voor voorstellen
                </li>
                <li className="flex items-center">
                  <i className="ri-equalizer-line text-xl mr-3"></i>
                  Eerlijke concurrentie gebaseerd op verdienste
                </li>
                <li className="flex items-center">
                  <i className="ri-hand-heart-line text-xl mr-3"></i>
                  Kansen voor alle vaardigheidsniveaus
                </li>
              </ul>
            </div>
            <div className="text-center lg:text-right">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5855a2c25c1ef00d01d5d692a494903b.png"
                alt="Platform Interface"
                className="rounded-2xl shadow-lg max-w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <ManufacturerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}