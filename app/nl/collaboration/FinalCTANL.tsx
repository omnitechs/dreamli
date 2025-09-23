'use client';

import Link from 'next/link';

export default function FinalCTANL() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Klaar om Samen te Werken? Word Vandaag Lid van de Hub.
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Zet de eerste stap naar het creëren van geweldige producten voor kinderen. 
          Solliciteer nu en word onderdeel van de Dreamli Samenwerkingshub.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/nl/collaboration/apply"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-700 text-lg font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-lg"
          >
            <i className="ri-rocket-line text-xl mr-3"></i>
            Sluit je vandaag aan bij de Hub
          </Link>
          <Link 
            href="https://calendly.com/sina-omnitechs/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-purple-700 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-calendar-line text-xl mr-3"></i>
            Plan een Gesprek
          </Link>
          <Link 
            href="/nl/contact"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-purple-700 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-question-line text-xl mr-3"></i>
            Vragen?
          </Link>
        </div>
      </div>
    </section>
  );
}