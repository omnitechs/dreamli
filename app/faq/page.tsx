
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqCategories = [
  {
    title: "Process & Timeline",
    icon: "ri-time-line",
    questions: [
      {
        id: 1,
        question: "How does the Dreamli process work?",
        answer: "It's wonderfully simple! Upload your child's drawing through our website, and we'll create a 3D preview within 24 hours. Once you approve how it looks, we craft your custom figurine, nightlight, and digital keepsakes in our Dutch workshop. Everything arrives at your door in 5-10 working days, ready to create magical moments."
      },
      {
        id: 6,
        question: "How long does it take to receive my order?",
        answer: "Your Dreamli keepsakes will arrive within 5-10 working days after you approve the 3D preview. We make every single item to order right here in the Netherlands - no mass production, no sitting in warehouses. This means your child's drawing gets the personal attention it deserves, and you get a truly unique keepsake that's worth the short wait."
      },
      {
        id: 7,
        question: "Can I track my order?",
        answer: "Of course! Once your figurine starts printing, we'll send you tracking information so you can follow its journey to your door. We know how exciting it is (especially for the kids!) to wait for something special, so we keep you updated every step of the way."
      },
      {
        id: 8,
        question: "What if I need it faster for a birthday or special occasion?",
        answer: "We understand how important timing can be for special moments! While we can't guarantee rush orders due to our careful, made-to-order process, we recommend ordering at least 2 weeks before your special date. If you're cutting it close, contact us directly - we'll do our best to help make the moment magical."
      }
    ]
  },
  {
    title: "Customization Process",
    icon: "ri-brush-line",
    questions: [
      {
        id: 9,
        question: "What kind of drawings work best?",
        answer: "Almost any drawing works! Crayon, marker, pencil, colored pencil - we've seen it all. The clearer the lines, the better, but don't worry about perfection. We've turned stick figures into adorable keepsakes and transformed elaborate masterpieces into stunning figurines. If your child drew it with love, we can make it into something special."
      },
      {
        id: 10,
        question: "What if the 3D preview doesn't look right?",
        answer: "No worries at all! Before we start creating anything, you'll see exactly how your figurine will look. If something seems off, just let us know and we'll adjust it. We want you to be completely happy before we begin crafting. Remember, we offer no-questions-asked refunds if you're not satisfied with the final result."
      },
      {
        id: 11,
        question: "Can we make changes after ordering?",
        answer: "Small adjustments are usually possible before we start printing, just reach out to us quickly! Once the printing begins, changes become tricky, but we're always happy to discuss options. The good news is that most parents are delighted with how closely the figurine matches their child's original vision."
      },
      {
        id: 2,
        question: "What if I don't like the 3D preview?",
        answer: "No problem at all! We want you to be completely happy. You can request changes to the preview, or if it's not quite right, we offer a full refund - no questions asked. We only start creating your physical keepsakes after you give the thumbs up to the 3D preview."
      }
    ]
  },
  {
    title: "Safety & Materials",
    icon: "ri-shield-check-line",
    questions: [
      {
        id: 4,
        question: "Are Dreamli products safe for young children?",
        answer: "Absolutely! All our figurines and accessories are made from PLA+ material, which is completely child-safe and non-toxic. We use the same materials found in many children's toys. Our products are designed and manufactured right here in the Netherlands, following strict European safety standards. The figurines are durable and won't break into sharp pieces if dropped - perfect for little hands to hold and play with."
      },
      {
        id: 5,
        question: "What about the NFC keychains - are they safe?",
        answer: "Yes, our tap-to-view keychains are completely safe. They contain a tiny, sealed chip (like contactless payment cards) that can't be accessed or damaged during normal play. The keychains are designed to be durable and won't bend or break easily. They work with any smartphone - just a gentle tap and the memory appears!"
      }
    ]
  },
  {
    title: "Privacy & Digital Features",
    icon: "ri-lock-line",
    questions: [
      {
        id: 12,
        question: "Is my child's information safe on the Memory Page?",
        answer: "Your child's privacy is our top priority. Memory Pages are completely private by default - only people you choose can see them. You have full control to edit, share, or delete the page anytime. We follow strict European privacy laws (GDPR), and we only collect basic information to make the experience special - your child's name and any comments you choose to add."
      },
      {
        id: 13,
        question: "How do the tap-to-view keychains work?",
        answer: "It's beautifully simple! When someone taps their phone to the keychain, it opens your child's Memory Page showing the original drawing and any story you've added. No apps to download, no complicated setup - it just works. Think of it like a digital photo frame that fits in your pocket and can be shared with grandparents, teachers, or anyone special in your child's life."
      },
      {
        id: 17,
        question: "Can I control who sees my child's Memory Page?",
        answer: "Absolutely! You have complete control over privacy settings. Memory Pages are private by default, and you choose exactly who can view them. You can generate special sharing links for grandparents, teachers, or family friends, and you can revoke access anytime. It's your child's memory, so you decide who gets to be part of it."
      },
      {
        id: 18,
        question: "What happens to the original drawing?",
        answer: "Don't worry - we work entirely from the photo you upload! Your child's original drawing stays safely with you. We preserve the digital version on the Memory Page, so you'll always have both the physical original and a beautiful digital keepsake that can't get lost or damaged."
      }
    ]
  },
  {
    title: "Value & Pricing",
    icon: "ri-price-tag-3-line",
    questions: [
      {
        id: 14,
        question: "Why does it cost more than a regular photo gift?",
        answer: "Great question! Unlike photo gifts that print existing images, we transform your child's 2D drawing into a completely custom 3D creation. Each figurine is individually crafted, painted by hand, and comes with digital keepsakes that last forever. You're not just buying a product - you're creating a core memory that your child will treasure for years, complete with ways to share that joy with family near and far."
      },
      {
        id: 15,
        question: "What's included in the Gift Pack?",
        answer: "The Gift Pack (€137) includes everything needed for a complete memory experience: your custom figurine, a lithophane nightlight that glows with the original drawing, a paintable fridge magnet, 5 tap-to-view keychains to share with family, and a private Memory Page that preserves the magic forever. It's designed to create lasting memories and connections across your entire family."
      }
    ]
  },
  {
    title: "Getting Started",
    icon: "ri-upload-line",
    questions: [
      {
        id: 3,
        question: "Do I need to create an account to place an order?",
        answer: "Not immediately! You can upload your drawing and see the 3D preview without creating an account. We only ask you to set up a simple account when you're ready to place your order - this helps us create your personalized Memory Page and keep everything organized for you."
      },
      {
        id: 16,
        question: "What file types can I upload?",
        answer: "We accept most common image formats: JPG, PNG, PDF, and HEIC (iPhone photos). For best results, make sure the drawing is well-lit and the lines are clear. If you're unsure about your photo quality, just upload it anyway - our team is experienced at working with all kinds of images!"
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Everything you need to know about turning your child's drawings into magical 3D keepsakes
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-16">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                {/* Category Header */}
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                    <i className={`${category.icon} text-2xl text-white`}></i>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                </div>

                {/* Questions in Category */}
                <div className="space-y-4">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="bg-gray-50 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        <div className={`w-6 h-6 flex items-center justify-center transition-transform ${
                          openItems.includes(faq.id) ? 'rotate-180' : ''
                        }`}>
                          <i className="ri-arrow-down-s-line text-2xl text-purple-600"></i>
                        </div>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${
                        openItems.includes(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-6 pb-5">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're here to help! Reach out to our friendly team and we'll get back to you as soon as possible.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-message-3-line w-5 h-5 flex items-center justify-center mr-2"></i>
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
