'use client';

import { useState } from 'react';

export default function SchoolsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much preparation time do teachers need?",
      answer: "Absolutely minimal! Each kit comes with everything pre-organized and a simple setup guide. Teachers need just 5 minutes to lay out materials. No special training or artistic skills required."
    },
    {
      question: "How messy will this get?",
      answer: "We've designed this specifically for classroom use. Water-based paints, protective mats, spill-proof containers, and included cleanup materials mean virtually no mess. Most teachers are surprised by how clean the process is."
    },
    {
      question: "Do staff need special training?",
      answer: "No special training needed! Each kit includes clear, step-by-step instructions with photos. We also provide a quick video guide and phone support if you have questions during your first session."
    },
    {
      question: "What if I have different group sizes?",
      answer: "Our kits are flexible! We can accommodate anywhere from 8-24 students per session. We'll adjust the materials and setup based on your specific group size when you book your pilot."
    },
    {
      question: "How does this support learning goals?",
      answer: "Our programs support multiple curriculum areas: fine motor skills, following instructions, creative expression, problem-solving, and social skills. We provide curriculum alignment documentation for your records."
    },
    {
      question: "What ongoing support do you provide?",
      answer: "Full support throughout! This includes setup assistance, troubleshooting during sessions, replacement materials if needed, and guidance on showcasing student work. We're just a phone call away."
    },
    {
      question: "Can students keep their creations?",
      answer: "Absolutely! Taking their painted figures home is one of the highlights for students. This creates a lasting connection between school learning and home, often sparking conversations with families about the creative process."
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
            <span className="text-sm font-semibold text-blue-700">Common Questions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Questions from other schools and BSOs about running creative programs
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
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help you create the perfect creative program for your school
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:schools@dreamli.nl"
                className="bg-[#FFA726] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-mail-fill"></i>
                <span>Email us</span>
              </a>
              
              <a
                href="tel:+31123456789"
                className="bg-white text-[#FFA726] border-2 border-[#FFA726] px-6 py-3 rounded-full font-semibold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <i className="ri-phone-fill"></i>
                <span>Call us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}