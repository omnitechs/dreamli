'use client';

import { useState } from 'react';

export default function CollaborationFAQNL() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Wanneer wordt het platform gelanceerd?",
      answer: "We zijn momenteel in beta-testing met geselecteerde partners. De volledige platformlancering is gepland voor Q4 2025. Vroege partners krijgen prioriteitstoegang en inbreng op platformfuncties."
    },
    {
      question: "Hoe worden budgetten bepaald?",
      answer: "Projectbudgetten worden bepaald door ons competitieve voorstelssysteem. Je dient je voorgestelde budget in op basis van projectcomplexiteit, tijdlijn en materialen. Dreamli beoordeelt alle voorstellen en selecteert op basis van waarde, kwaliteit en haalbaarheid."
    },
    {
      question: "Welk percentage neemt Dreamli?",
      answer: "Bij Dreamli is wat je instelt wat je verdient. Ontwerpers en fabrikanten ontvangen het volledige bedrag dat ze hebben opgegeven voor elk project — zonder commissies, verborgen kosten of inhoudingen. Je budget en tijdlijn worden volledig gerespecteerd. Dreamli dekt alle operationele kosten aan onze kant, zodat jij je kunt concentreren op je vak terwijl je transparant en eerlijk wordt betaald."
    },
    {
      question: "Wat is het goedkeuringsproces?",
      answer: "Ons goedkeuringsproces omvat portfolio-review, vaardigheidsbeoordeling en achtergrondverificatie. Voor ontwerpers kijken we naar 3D-modellerervaring en creativiteit. Voor fabrikanten beoordelen we productiecapaciteiten, kwaliteitsnormen en veiligheidsnaleving. Het proces duurt doorgaans 5-7 werkdagen."
    },
    {
      question: "Welke soorten projecten zullen beschikbaar zijn?",
      answer: "Projecten variëren van eenvoudig speelgoed en figurines tot complexe mechanische ontwerpen. Categorieën omvatten actiefiguren, educatief speelgoed, decoratieve items, functionele objecten en aangepaste spelstukken. Elk project bevat gedetailleerde specificaties en veiligheidseisen."
    },
    {
      question: "Hoe werken betalingen?",
      answer: "Betalingen worden rechtstreeks door Dreamli afgehandeld. Zodra je werk is geleverd en geverifieerd, sturen we je volledige overeengekomen bedrag zonder vertraging naar je door. Geen commissies, geen wachtperiodes — alleen snelle, transparante uitbetalingen."
    },
    {
      question: "Kan ik aan meerdere projecten tegelijkertijd werken?",
      answer: "Ja! Eenmaal goedgekeurd, kun je voorstellen indienen voor meerdere projecten. We moedigen partners aan om werklasten aan te nemen die passen bij hun capaciteit en kwaliteitslevering garanderen. Je kunt je beschikbaarheidsstatus instellen in je dashboard."
    },
    {
      question: "Wat als een project niet voldoet aan de verwachtingen?",
      answer: "We hebben een gestructureerd revisieproces met duidelijke feedbacklussen. De meeste problemen worden opgelost door collaboratieve communicatie. In zeldzame gevallen waarin projecten niet bevredigend kunnen worden voltooid, hebben we eerlijke geschillenbeslechtingsprocedures die alle partijen beschermen."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Veelgestelde <span className="text-purple-600">Vragen</span>
          </h2>
          <p className="text-xl text-gray-700">
            Krijg antwoorden op veelgestelde vragen over deelname aan het Dreamli platform.
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nog Vragen?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Ons team staat klaar om je te helpen begrijpen hoe Dreamli werkt en hoe jij deel kunt uitmaken van onze creatieve gemeenschap.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap">
              <i className="ri-mail-line mr-2"></i>
              Neem Contact Op
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}