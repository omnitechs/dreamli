
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LithophanesHero() {
  return (
    <section className="relative min-h-screen bg-cover bg-right bg-no-repeat" style={{
      backgroundImage: "url('https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/8fcb11d92b78e5072b21b33e0e204a23.png')"
    }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">        
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Transform Your Photos Into 
            <span className="block text-yellow-300">Illuminated Art</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Create stunning 3D lithophanes that bring your memories to life with light
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/how-it-works"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap cursor-pointer"
            >
              Start Creating
            </Link>
            
            <Link 
              href="#gallery"
              className="border-2 border-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl whitespace-nowrap cursor-pointer"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
