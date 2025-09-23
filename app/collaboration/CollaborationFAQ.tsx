'use client';

import { useState } from 'react';

export default function CollaborationFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "When will the platform launch?",
      answer: "We're currently in beta testing with select partners. The full platform launch is planned for Q4 2025. Early partners will have priority access and input on platform features."
    },
    {
      question: "How are budgets decided?",
      answer: "Project budgets are determined through our competitive proposal system. You submit your proposed budget based on project complexity, timeline, and materials. Dreamli reviews all proposals and selects based on value, quality, and feasibility."
    },
    {
      question: "What percentage does Dreamli take?",
      answer: "At Dreamli, what you set is what you earn. Designers and manufacturers receive the full amount they quote for each project — with no commissions, hidden fees, or deductions. Your budget and timeline are respected in full. Dreamli covers all operational costs on our side, so you can focus on your craft while being paid transparently and fairly."
    },
    {
      question: "What is the approval process?",
      answer: "Our approval process includes portfolio review, skill assessment, and background verification. For designers, we look at 3D modeling experience and creativity. For manufacturers, we evaluate production capabilities, quality standards, and safety compliance. The process typically takes 5-7 business days."
    },
    {
      question: "What types of projects will be available?",
      answer: "Projects range from simple toys and figurines to complex mechanical designs. Categories include action figures, educational toys, decorative items, functional objects, and custom game pieces. Each project includes detailed specifications and safety requirements."
    },
    {
      question: "How do payments work?",
      answer: "Payments are handled directly by Dreamli. As soon as your work is delivered and verified, we transfer your full agreed amount to you without delay. No commissions, no waiting periods — just fast, transparent payouts."
    },
    {
      question: "Can I work on multiple projects simultaneously?",
      answer: "Yes! Once approved, you can submit proposals for multiple projects. We encourage partners to take on workloads that match their capacity and ensure quality delivery. You can set your availability status in your dashboard."
    },
    {
      question: "What if a project doesn't meet expectations?",
      answer: "We have a structured revision process with clear feedback loops. Most issues are resolved through collaborative communication. In rare cases where projects cannot be completed satisfactorily, we have fair dispute resolution procedures that protect all parties."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-purple-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-700">
            Get answers to common questions about joining the Dreamli platform.
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our team is here to help you understand how Dreamli works and how you can be part of our creative community.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors whitespace-nowrap">
              <i className="ri-mail-line mr-2"></i>
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}