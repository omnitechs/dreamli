'use client';

import { useState } from 'react';

export default function DesignerFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Files?",
      answer: "STL/OBJ/3MF; renders optional."
    },
    {
      question: "Languages?", 
      answer: "EN or NL."
    },
    {
      question: "When is the portal live?",
      answer: "We're rolling out early access to approved designers."
    },
    {
      question: "How do I get notified?",
      answer: "We email you when a project matches your profile."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FAQ
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className={`ri-arrow-${openIndex === index ? 'up' : 'down'}-s-line text-xl text-gray-600`}></i>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}