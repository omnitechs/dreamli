'use client';

import Link from 'next/link';

export default function CollaborationHeroNL() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20creative%20workspace%20with%20designers%20and%20manufacturers%20collaborating%20on%20innovative%20children%20products%2C%20colorful%20design%20studio%20environment%20with%20sketches%2C%20prototypes%2C%20and%20digital%20screens%20showing%20kid-friendly%20designs%2C%20bright%20and%20inspiring%20atmosphere%2C%20professional%20yet%20playful%2C%20diverse%20team%20working%20together%2C%20clean%20minimalist%20background&width=1920&height=1080&seq=collab-hero-nl&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-white/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Samenwerkingshub
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
            Waar creativiteit en kansen samenkomen.
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Verbind je met gelijkgestemde creatievelingen en fabrikanten om innovatieve producten voor kinderen tot leven te brengen via Dreamli's collaboratieve ecosysteem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Link 
              href="/nl/collaboration/apply" 
              className="inline-flex items-center px-8 py-4 bg-white text-purple-700 text-lg font-semibold rounded-full hover:bg-purple-50 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-team-line text-xl mr-3"></i>
              Sluit je aan bij de Hub
            </Link>
            <a 
              href="https://calendly.com/sina-omnitechs/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-full hover:bg-purple-700 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-calendar-line text-xl mr-3"></i>
              Boek een Meeting
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}