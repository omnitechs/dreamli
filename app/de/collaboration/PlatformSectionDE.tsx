'use client';

import { useState } from 'react';

export default function PlatformSectionDE() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Die <span className="text-purple-600">Plattform</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Wir entwickeln eine Freelancing-ähnliche Plattform, die fairen Wettbewerb, Transparenz und Chancen für alle gewährleistet.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-login-circle-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Zugang zu Projekten</h3>
            <p className="text-gray-700">
              Melden Sie sich an, um verfügbare Projekte mit klaren Anforderungen einschließlich Zeichnungen, Produkttypen und Zielmaterialien zu sehen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-file-text-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Vorschläge einreichen</h3>
            <p className="text-gray-700">
              Schlagen Sie Ihr Budget und Ihre Lieferzeit für Projekte vor, die Ihren Fähigkeiten und Interessen entsprechen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-award-line text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ausgewählt werden</h3>
            <p className="text-gray-700">
              Dreamli prüft alle Vorschläge und vergibt Projekte an die beste Übereinstimmung basierend auf Qualität, Zeitplan und Budget.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Transparenter & fairer Prozess</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="ri-shield-check-line text-xl mr-3"></i>
                  Klare Projektanforderungen und Erwartungen
                </li>
                <li className="flex items-center">
                  <i className="ri-eye-line text-xl mr-3"></i>
                  Transparenter Bewertungsprozess für Vorschläge
                </li>
                <li className="flex items-center">
                  <i className="ri-equalizer-line text-xl mr-3"></i>
                  Fairer Wettbewerb basierend auf Verdiensten
                </li>
                <li className="flex items-center">
                  <i className="ri-hand-heart-line text-xl mr-3"></i>
                  Chancen für alle Fähigkeitsstufen
                </li>
              </ul>
            </div>
            <div className="text-center lg:text-right">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5855a2c25c1ef00d01d5d692a494903b.png"
                alt="Plattform-Interface"
                className="rounded-2xl shadow-lg max-w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}