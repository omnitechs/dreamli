
'use client';

import Link from 'next/link';

export default function BlogHeroNL() {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Blije%20kinderen%20tekenen%20en%20maken%20kunst%20terwijl%20ouders%20glimlachen%20en%20kijken%2C%20kleurrijke%20Dreamli%20creatieve%20kits%20uitgespreid%20op%20tafel%2C%20helder%20natuurlijk%20licht%2C%20moderne%20gezinswoning%20setting%2C%20warme%20en%20uitnodigende%20sfeer%2C%20zachte%20pastelkleuren%20met%20witte%20achtergrond%2C%20schone%20minimalistische%20stijl&width=1200&height=600&seq=blog-hero-nl&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 bg-white/40"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Creativiteit Inspireren,{' '}
            <span className="text-purple-600">Één Kind Tegelijk</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Opvoedingstips, creatieve spelideeën en verhalen van families die verbeelding tot leven brengen met Dreamli.
          </p>
          
          <Link 
            href="/nl/shop" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
          >
            Ontdek Kits
            <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
