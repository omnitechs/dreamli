'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqSchemaProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export default function FaqSchema({ faqs, title = "Frequently Asked Questions", className = "" }: FaqSchemaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2)
        }}
      />
      
      <div className={`py-20 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {title}
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className={`ri-arrow-${openIndex === index ? 'up' : 'down'}-s-line text-gray-600`}></i>
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}