'use client';

import { useState } from 'react';

export default function SchoolsFAQDE() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Wie viel Vorbereitungszeit benötigen Lehrer?",
      answer: "Absolut minimal! Jedes Kit kommt mit allem vorab organisiert und einer einfachen Aufbauanleitung. Lehrer benötigen nur 5 Minuten, um die Materialien auszulegen. Keine spezielle Ausbildung oder künstlerischen Fähigkeiten erforderlich."
    },
    {
      question: "Wie unordentlich wird das werden?",
      answer: "Wir haben das speziell für den Klassengebrauch entwickelt. Farben auf Wasserbasis, Schutzmatten, auslaufsichere Behälter und enthaltene Reinigungsmaterialien bedeuten praktisch keine Unordnung. Die meisten Lehrer sind überrascht, wie sauber der Prozess ist."
    },
    {
      question: "Benötigt das Personal spezielle Schulungen?",
      answer: "Keine spezielle Schulung erforderlich! Jedes Kit enthält klare, schrittweise Anleitungen mit Fotos. Wir bieten auch eine kurze Videoanleitung und telefonischen Support, falls Sie während Ihrer ersten Sitzung Fragen haben."
    },
    {
      question: "Was ist, wenn ich unterschiedliche Gruppengrößen habe?",
      answer: "Unsere Kits sind flexibel! Wir können überall von 8-24 Schülern pro Sitzung unterbringen. Wir passen die Materialien und den Aufbau basierend auf Ihrer spezifischen Gruppengröße an, wenn Sie Ihr Pilotprojekt buchen."
    },
    {
      question: "Wie unterstützt das die Lernziele?",
      answer: "Unsere Programme unterstützen mehrere Lehrplanbereiche: Feinmotorik, Befolgen von Anweisungen, kreativer Ausdruck, Problemlösung und soziale Fähigkeiten. Wir stellen Lehrplan-Abstimmungsdokumentation für Ihre Unterlagen zur Verfügung."
    },
    {
      question: "Welche fortlaufende Unterstützung bieten Sie?",
      answer: "Vollständige Unterstützung während des gesamten Prozesses! Das beinhaltet Aufbauhilfe, Fehlerbehebung während der Sitzungen, Ersatzmaterialien bei Bedarf und Anleitung zum Präsentieren der Schülerarbeiten. Wir sind nur einen Anruf entfernt."
    },
    {
      question: "Können Schüler ihre Kreationen behalten?",
      answer: "Absolut! Das Mitnehmen ihrer bemalten Figuren nach Hause ist eines der Highlights für Schüler. Das schafft eine dauerhafte Verbindung zwischen schulischem Lernen und Zuhause und regt oft Gespräche mit Familien über den kreativen Prozess an."
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
            <span className="text-sm font-semibold text-blue-700">Häufige Fragen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Alles was Sie wissen müssen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fragen von anderen Schulen und BSOs über die Durchführung kreativer Programme
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
              Haben Sie noch Fragen?
            </h3>
            <p className="text-gray-600 mb-6">
              Wir sind hier, um Ihnen bei der Erstellung des perfekten kreativen Programms für Ihre Schule zu helfen
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:schools@dreamli.de"
                className="bg-[#FFA726] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-mail-fill"></i>
                <span>E-Mail schreiben</span>
              </a>
              
              <a
                href="tel:+49123456789"
                className="bg-white text-[#FFA726] border-2 border-[#FFA726] px-6 py-3 rounded-full font-semibold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-phone-fill"></i>
                <span>Anrufen</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}