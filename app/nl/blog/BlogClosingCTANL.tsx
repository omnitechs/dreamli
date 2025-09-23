
'use client';

import Link from 'next/link';

export default function BlogClosingCTANL() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-6">
            <i className="ri-rocket-2-line text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
          </div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Klaar om te Beginnen met{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Creatief Spelen?
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Word onderdeel van duizenden families die hun kinderen helpen hun creatieve potentieel te ontdekken met Dreamli's unieke kits.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <Link
            href="/nl/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-lg font-bold rounded-full hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-2xl whitespace-nowrap cursor-pointer"
          >
            Ontdek Dreamli Kits
            <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </Link>
          
          <Link
            href="/nl/contact"
            className="inline-flex items-center px-8 py-4 bg-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 whitespace-nowrap cursor-pointer"
          >
            Stel Een Vraag
            <i className="ri-question-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </Link>
        </div>
        
        {/* Social Proof */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">50.000+</div>
            <div className="text-gray-300">Gelukkige Families</div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-pink-400 mb-2">98%</div>
            <div className="text-gray-300">Tevredenheidscore</div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="text-3xl font-bold text-purple-400 mb-2">200.000+</div>
            <div className="text-gray-300">Creatieve Projecten</div>
          </div>
        </div>
        
        <div className="mt-12 text-gray-400">
          <p className="flex items-center justify-center">
            <i className="ri-shield-check-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            30 dagen geld-terug-garantie • Gratis verzending boven €50
          </p>
        </div>
      </div>
    </section>
  );
}
