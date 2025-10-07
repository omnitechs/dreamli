
'use client';

import { useState } from 'react';

export default function FAQ() {
  // Initialise the accordion with the first item opened
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ data – all strings are correctly escaped
  const faqs = [
    {
      question: 'What kind of photos work best?',
      answer:
        'Clear, well-lit portraits or high-quality artwork work best. Photos with good contrast and detail will produce the most stunning results. We recommend images with at least 1080p resolution for optimal quality.'
    },
    {
      question: 'How long does it take to create and ship?',
      answer:
        'Once you upload your photo and confirm the design, we typically complete production within 3-5 business days. Shipping takes an additional 2-3 days within the Netherlands and 5-7 days for international orders.'
    },
    {
      question: 'What sizes are available?',
      answer:
        'We offer lithophanes in various sizes: Small (15x20cm), Medium (20x25cm), Large (25x30cm), and Extra Large (30x40cm). All sizes include the LED backlighting system and stand.'
    },
    {
      question: "Can I preview my lithophane before it's made?",
      answer:
        'Yes! After you upload your photo, we provide a digital preview showing how your lithophane will look when illuminated. You can request adjustments before we begin production.'
    },
    {
      question: "What's the difference between Mono and CMYK lithophanes?",
      answer:
        'Mono lithophanes are black and white, perfect for portraits and detailed photos with beautiful depth and shadows. CMYK lithophanes are full-color, ideal for colorful artwork and images that benefit from vibrant illumination.'
    },
    {
      question: 'Is the LED lighting included?',
      answer:
        'Yes! Every lithophane comes with a custom-fitted LED backlighting system that provides uniform illumination. The LED system is energy‑efficient and includes a power adapter.'
    },
    {
      question: "What if I'm not satisfied with the result?",
      answer:
        "We offer a 30‑day money‑back guarantee. If you're not completely satisfied with your lithophane, we'll work with you to make it right or provide a full refund."
    },
    {
      question: 'Can I order multiple lithophanes with different photos?',
      answer:
        'Absolutely! You can order as many lithophanes as you want, each with different photos. We also offer discounts for bulk orders of 3 or more lithophanes.'
    }
  ];

  // Helper to toggle a question open/closed safely
  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#2E2E2E]/80">
              Everything you need to know about creating your custom lithophane
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-[#F8F9FF] to-[#F3E8FF]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors duration-200 cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-[#2E2E2E] pr-4">
                    {faq.question}
                  </h3>
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#8472DF] text-white transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  >
                    <i className="ri-arrow-down-s-line text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p className="text-[#2E2E2E]/70 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact support */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#8472DF]/10 to-[#93C4FF]/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
                Still have questions?
              </h3>
              <p className="text-[#2E2E2E]/70 mb-6">
                Our team is here to help you create the perfect lithophane
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@dreamli.nl"
                  className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-6 py-3 rounded-full font-medium hover:bg-[#8472DF]/90 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-mail-line text-lg w-5 h-5 flex items-center justify-center"></i>
                  Email Support
                </a>
                <a
                  href="https://wa.me/31645559587"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#25D366]/90 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-whatsapp-line text-lg w-5 h-5 flex items-center justify-center"></i>
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
          {/* End of contact support */}
        </div>
      </div>
    </section>
  );
}
