
'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from "./components/Hero";
import AI from "./components/AI";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Gift Finder Hero Section */}
        <Hero/>

      {/* How It Works Section - Turn any idea into a gift */}
        <AI/>

      {/* Why Dreamli Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Why Dreamli is the home of <span className="text-[#8472DF]">unforgettable gifts</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                Choosing the right gift isn&apos;t about the price tag — it&apos;s about the story, the surprise, and the connection. At Dreamli we bring these moments to life. Whether you&apos;re looking for something rare and exclusive, a personalized creation made from your own photo or drawing, or a quick pick from our wide catalog, you&apos;ll find it here.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-gift-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">🎁 Exclusive Gifts</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Carefully curated, limited, and unique pieces you won&apos;t find anywhere else.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-star-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">✨ Personalized Gifts</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Made from your photos, drawings, or ideas. Turn memories into meaningful keepsakes.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-book-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">📚 Complete Gift Catalog</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Everything from small surprises to statement pieces, all in one convenient place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
