
'use client';

import Link from 'next/link';

export default function BlogHero() {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Happy%20children%20drawing%20and%20creating%20art%20while%20parents%20smile%20and%20watch%2C%20colorful%20Dreamli%20creative%20kits%20spread%20on%20table%2C%20bright%20natural%20lighting%2C%20modern%20family%20home%20setting%2C%20warm%20and%20inviting%20atmosphere%2C%20soft%20pastel%20colors%20with%20white%20background%2C%20clean%20minimalist%20style&width=1200&height=600&seq=blog-hero&orientation=landscape')`
      }}
    >
      <div className="absolute inset-0 bg-white/40"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Inspiring Creativity,{' '}
            <span className="text-purple-600">One Child at a Time</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Parenting tips, creative play ideas, and stories from families who bring imagination to life with Dreamli.
          </p>
          
          <Link 
            href="/shop" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
          >
            Explore Kits
            <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
