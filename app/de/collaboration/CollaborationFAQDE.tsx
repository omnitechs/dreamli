'use client';

import { useState } from 'react';

export default function CollaborationFAQDE() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Wann wird die Plattform gestartet?",
      answer: "Wir befinden uns derzeit in der Beta-Testphase mit ausgewählten Partnern. Der vollständige Plattform-Launch ist für Q4 2025 geplant. Frühe Partner haben Prioritätszugang und Einfluss auf Plattform-Features."
    },
    {
      question: "Wie werden Budgets entschieden?",
      answer: "Projektbudgets werden durch unser wettbewerbsfähiges Angebotssystem bestimmt. Sie reichen Ihr vorgeschlagenes Budget basierend auf Projektkomplexität, Zeitplan und Materialien ein. Dreamli überprüft alle Angebote und wählt basierend auf Wert, Qualität und Machbarkeit aus."
    },
    {
      question: "Welchen Prozentsatz nimmt Dreamli?",
      answer: "Bei Dreamli erhalten Sie genau das, was Sie festlegen. Designer und Hersteller erhalten den vollen Betrag, den sie für jedes Projekt anbieten — ohne Provisionen, versteckte Gebühren oder Abzüge. Ihr Budget und Zeitplan werden vollständig respektiert. Dreamli übernimmt alle operativen Kosten auf unserer Seite, damit Sie sich auf Ihr Handwerk konzentrieren können, während Sie transparent und fair bezahlt werden."
    },
    {
      question: "Wie läuft der Genehmigungsprozess ab?",
      answer: "Unser Genehmigungsprozess umfasst Portfolio-Überprüfung, Fähigkeitsbewertung und Hintergrundüberprüfung. Bei Designern schauen wir auf 3D-Modellierungserfahrung und Kreativität. Bei Herstellern bewerten wir Produktionskapazitäten, Qualitätsstandards und Sicherheitskonformität. Der Prozess dauert normalerweise 5-7 Werktage."
    },
    {
      question: "Welche Arten von Projekten werden verfügbar sein?",
      answer: "Projekte reichen von einfachen Spielzeugen und Figuren bis zu komplexen mechanischen Designs. Kategorien umfassen Actionfiguren, Bildungsspielzeug, Dekorationsgegenstände, funktionale Objekte und individuelle Spielstücke. Jedes Projekt enthält detaillierte Spezifikationen und Sicherheitsanforderungen."
    },
    {
      question: "Wie funktionieren die Zahlungen?",
      answer: "Zahlungen werden direkt von Dreamli abgewickelt. Sobald Ihre Arbeit geliefert und verifiziert wurde, überweisen wir Ihren vollen vereinbarten Betrag ohne Verzögerung an Sie. Keine Provisionen, keine Wartezeiten — nur schnelle, transparente Auszahlungen."
    },
    {
      question: "Kann ich gleichzeitig an mehreren Projekten arbeiten?",
      answer: "Ja! Nach der Genehmigung können Sie Angebote für mehrere Projekte einreichen. Wir ermutigen Partner, Arbeitslasten zu übernehmen, die ihrer Kapazität entsprechen und Qualitätslieferung gewährleisten. Sie können Ihren Verfügbarkeitsstatus in Ihrem Dashboard einstellen."
    },
    {
      question: "Was passiert, wenn ein Projekt die Erwartungen nicht erfüllt?",
      answer: "Wir haben einen strukturierten Überarbeitungsprozess mit klaren Feedback-Schleifen. Die meisten Probleme werden durch kollaborative Kommunikation gelöst. In seltenen Fällen, in denen Projekte nicht zufriedenstellend abgeschlossen werden können, haben wir faire Streitbeilegungsverfahren, die alle Parteien schützen."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Häufig Gestellte <span className="text-purple-600">Fragen</span>
          </h2>
          <p className="text-xl text-gray-700">
            Erhalten Sie Antworten auf häufige Fragen zum Beitritt zur Dreamli-Plattform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <div className={`w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  <i className="ri-arrow-down-s-line text-purple-600"></i>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-question-answer-line text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Haben Sie noch Fragen?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Unser Team ist hier, um Ihnen zu helfen, zu verstehen, wie Dreamli funktioniert und wie Sie Teil unserer kreativen Gemeinschaft werden können.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap">
              <i className="ri-mail-line mr-2"></i>
              Unser Team kontaktieren
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}