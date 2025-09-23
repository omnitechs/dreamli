'use client';

import { useState, useEffect } from 'react';
import UploadForm from './UploadForm';

export default function FinalCTA() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fixed positions to avoid hydration mismatch
  const backgroundElements = [
    { left: '12%', top: '25%', delay: '0s', duration: '3s' },
    { left: '88%', top: '15%', delay: '1s', duration: '4s' },
    { left: '25%', top: '70%', delay: '2s', duration: '3.5s' },
    { left: '75%', top: '80%', delay: '0.5s', duration: '2.8s' },
    { left: '5%', top: '45%', delay: '1.5s', duration: '3.2s' },
    { left: '95%', top: '60%', delay: '2.5s', duration: '4.2s' },
    { left: '35%', top: '10%', delay: '3s', duration: '3.8s' },
    { left: '65%', top: '35%', delay: '0.2s', duration: '3.3s' },
    { left: '15%', top: '90%', delay: '1.8s', duration: '2.6s' },
    { left: '85%', top: '50%', delay: '2.2s', duration: '4.5s' },
    { left: '45%', top: '20%', delay: '0.8s', duration: '3.7s' },
    { left: '55%', top: '85%', delay: '2.8s', duration: '3.1s' },
    { left: '8%', top: '65%', delay: '1.2s', duration: '2.9s' },
    { left: '92%', top: '30%', delay: '3.2s', duration: '4.1s' },
    { left: '30%', top: '55%', delay: '0.7s', duration: '3.4s' },
    { left: '70%', top: '5%', delay: '1.9s', duration: '2.7s' },
    { left: '20%', top: '40%', delay: '2.4s', duration: '3.9s' },
    { left: '80%', top: '75%', delay: '0.3s', duration: '3.6s' },
    { left: '50%', top: '15%', delay: '1.6s', duration: '2.5s' },
    { left: '40%', top: '95%', delay: '2.9s', duration: '4.3s' },
    { left: '60%', top: '65%', delay: '0.9s', duration: '3.8s' },
    { left: '18%', top: '8%', delay: '1.4s', duration: '2.8s' },
    { left: '82%', top: '88%', delay: '2.1s', duration: '3.2s' },
    { left: '38%', top: '78%', delay: '0.6s', duration: '4.4s' },
    { left: '62%', top: '28%', delay: '3.1s', duration: '2.3s' }
  ];

  const floatingHearts = [
    { position: "absolute top-20 left-10 w-8 h-8 animate-bounce", delay: "0s", icon: "ri-heart-fill", color: "text-pink-300" },
    { position: "absolute top-40 right-20 w-6 h-6 animate-bounce", delay: "1s", icon: "ri-star-fill", color: "text-yellow-300" },
    { position: "absolute bottom-40 left-20 w-10 h-10 animate-bounce", delay: "2s", icon: "ri-gift-fill", color: "text-purple-300" },
    { position: "absolute bottom-20 right-10 w-7 h-7 animate-bounce", delay: "1.5s", icon: "ri-palette-fill", color: "text-green-300" }
  ];

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#FFF8E7] relative overflow-hidden">
        {/* Background elements - only render on client */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isClient && backgroundElements.map((element, i) => (
            <div
              key={i}
              className="absolute animate-pulse opacity-20"
              style={{
                left: element.left,
                top: element.top,
                animationDelay: element.delay,
                animationDuration: element.duration
              }}
              suppressHydrationWarning={true}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <span className="text-sm font-semibold text-purple-700">Klaar voor magie?</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Maak van hun fantasie een
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                blijvende herinnering
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Elke kinderverbeelding vertelt een verhaal. Of het nu begint met een tekening, een beschrijving of een wilde bedtijdfantasie — wij maken het tastbaar.
              <br />
              Een herinnering om vast te houden. En om nooit te vergeten.
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-8">
            <button 
              onClick={() => setShowUploadForm(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-6 rounded-full text-2xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-2xl transform hover:scale-105 hover:shadow-3xl"
            >
              Krijg gratis offerte
            </button>

            <p className="text-lg text-gray-600">
              <span className="font-semibold">Zonder verplichting.</span> Alleen magie.
            </p>
          </div>

          {/* Benefits recap */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                <i className="ri-timer-fill text-2xl text-white"></i>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Binnen 24 uur</p>
                <p className="text-sm text-gray-600">Vrijblijvende offerte</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                <i className="ri-truck-fill text-2xl text-white"></i>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">3-5 werkdagen</p>
                <p className="text-sm text-gray-600">Gratis thuisbezorgd</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <i className="ri-heart-3-fill text-2xl text-white"></i>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Voor altijd</p>
                <p className="text-sm text-gray-600">Herinneringen bewaard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating hearts decoration - only render on client */}
        {isClient && floatingHearts.map((heart, index) => (
          <div
            key={index}
            className={heart.position}
            style={{ animationDelay: heart.delay }}
            suppressHydrationWarning={true}
          >
            <i className={`${heart.icon} ${heart.color} text-xl`}></i>
          </div>
        ))}
      </section>

      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}