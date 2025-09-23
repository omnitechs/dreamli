'use client';

import Link from 'next/link';
import ZoomableImage from '../components/ZoomableImage';

export default function HowItWorksHero() {
  const heroImageUrl = 'https://readdy.ai/api/search-image?query=children%20drawing%20colorful%20creative%20artwork%20on%20paper%20with%20crayons%20and%20markers%2C%20bright%20cheerful%20environment%2C%20soft%20natural%20lighting%2C%20modern%20minimalist%20background%20with%20gentle%20purple%20and%20pink%20tones%2C%20artistic%20creative%20atmosphere%2C%20inspiring%20educational%20setting&width=1920&height=1080&seq=how-it-works-hero&orientation=landscape';

  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: `url('${heroImageUrl}')`
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <ZoomableImage 
          src={heroImageUrl}
          alt="Children drawing creative artwork"
          className="absolute inset-0 w-full h-full object-cover opacity-0"
        />
      </div>
      
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl">
            Simple 4 Steps — from drawing to a real figure.
          </p>
          <Link 
            href="/signup"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg whitespace-nowrap cursor-pointer"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </div>
  );
}