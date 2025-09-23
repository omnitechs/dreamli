'use client';

import { useState } from 'react';

export default function SchoolsFAQNL() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Hoeveel voorbereidingstijd hebben leerkrachten nodig?",
      answer: "Absoluut minimaal! Elke kit komt met alles voorgeorganiseerd en een eenvoudige opzetgids. Leerkrachten hebben maar 5 minuten nodig om materialen neer te leggen. Geen speciale training of artistieke vaardigheden vereist."
    },
    {
      question: "Hoe rommelig wordt dit?",
      answer: "We hebben dit specifiek ontworpen voor klasgebruik. Watergebaseerde verf, beschermende matten, morsbestendige containers en inbegrepen schoonmaakmateriaal betekenen vrijwel geen rommel. De meeste leerkrachten zijn verrast door hoe schoon het proces is."
    },
    {
      question: "Hebben medewerkers speciale training nodig?",
      answer: "Geen speciale training nodig! Elke kit bevat duidelijke, stap-voor-stap instructies met foto's. We bieden ook een snelle videogids en telefonische ondersteuning als je vragen hebt tijdens je eerste sessie."
    },
    {
      question: "Wat als ik verschillende groepsgroottes heb?",
      answer: "Onze kits zijn flexibel! We kunnen groepen van 8-24 leerlingen per sessie aan. We passen de materialen en opzet aan op basis van je specifieke groepsgrootte wanneer je je pilot boekt."
    },
    {
      question: "Hoe ondersteunt dit leerdoelen?",
      answer: "Onze programma's ondersteunen meerdere curriculumgebieden: fijne motoriek, instructies opvolgen, creatieve expressie, probleemoplossing en sociale vaardigheden. We bieden curriculumafstemming documentatie voor je administratie."
    },
    {
      question: "Welke doorlopende ondersteuning bieden jullie?",
      answer: "Volledige ondersteuning gedurende het hele proces! Dit omvat opzethulp, probleemoplossing tijdens sessies, vervangende materialen indien nodig, en begeleiding bij het tonen van leerlingwerk. We zijn slechts een telefoontje weg."
    },
    {
      question: "Mogen leerlingen hun creaties houden?",
      answer: "Absoluut! Hun geschilderde figuren mee naar huis nemen is een van de hoogtepunten voor leerlingen. Dit creëert een blijvende verbinding tussen schoolleren en thuis, en wekt vaak gesprekken met families over het creatieve proces."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-blue-700">Veelgestelde Vragen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Alles Wat Je Moet Weten
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vragen van andere scholen en BSO's over het uitvoeren van creatieve programma's
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  <i className={`ri-arrow-down-s-line text-2xl text-gray-400 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}></i>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#FFA726]/10 to-[#FF9800]/10 rounded-3xl p-8 border border-[#FFA726]/20">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Nog steeds vragen?
            </h3>
            <p className="text-gray-600 mb-6">
              We helpen je graag het perfecte creatieve programma voor je school te creëren
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:scholen@dreamli.nl"
                className="bg-[#FFA726] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-mail-fill"></i>
                <span>Email ons</span>
              </a>
              
              <a
                href="tel:+31645559587"
                className="bg-white text-[#FFA726] border-2 border-[#FFA726] px-6 py-3 rounded-full font-semibold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-phone-fill"></i>
                <span>Bel ons</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}