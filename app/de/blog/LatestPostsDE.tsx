'use client';

export default function LatestPostsDE() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Möchten Sie mehr lesen?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Erkunden Sie unsere komplette Sammlung von Artikeln und Einblicken.
          </p>
        </div>
        
        <a 
          href="https://blog.dreamli.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] text-gray-900 font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
        >
          Alle Blog-Artikel lesen
          <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
        </a>
      </div>
    </section>
  );
}