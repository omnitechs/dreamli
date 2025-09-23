
'use client';

import Link from 'next/link';

const latestPosts = [
  {
    title: 'Waarom Creativiteit Essentieel is voor Kinderontwikkeling',
    excerpt: 'Wetenschappelijk onderzoek toont aan dat creatieve activiteiten de hersenen van kinderen op unieke manieren stimuleren.',
    readTime: '6 min lezen',
    category: 'Kinderontwikkeling',
    image: 'https://readdy.ai/api/search-image?query=kinderen%20bezig%20met%20creatieve%20hersenstimulatie%20activiteiten%20kleurrijke%20educatieve%20spelletjes%20ontwikkeling%20cognitieve%20vaardigheden%20vrolijke%20leeromgeving&width=400&height=256&seq=creativiteit-essentieel-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/waarom-creativiteit-essentieel-is-voor-kinderontwikkeling/'
  },
  {
    title: 'De Kracht van Verbeelding: Hoe Tekeningen Leren Stimuleren',
    excerpt: 'Ontdek hoe het simpele proces van tekenen complexe leerprocessen in gang zet bij jonge kinderen.',
    readTime: '4 min lezen',
    category: 'Educatie',
    image: 'https://readdy.ai/api/search-image?query=kind%20tekent%20creatieve%20tekening%20met%20kleurpotloden%20verbeelding%20stimulatie%20leerproces%20vrolijke%20uitdrukking%20educatieve%20ontwikkeling&width=400&height=256&seq=kracht-verbeelding-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/de-kracht-van-verbeelding-hoe-tekeningen-leren-stimuleren/'
  },
  {
    title: 'STEAM Onderwijs Thuis: Praktische Tips voor Ouders',
    excerpt: 'Maak van je huis een laboratorium vol ontdekkingen met deze eenvoudige STEAM-activiteiten.',
    readTime: '7 min lezen',
    category: 'Activiteiten',
    image: 'https://readdy.ai/api/search-image?query=STEAM%20onderwijs%20activiteiten%20thuis%20ouders%20kinderen%20experimenteren%20wetenschap%20technologie%20engineering%20kunst%20wiskunde%20huiselijke%20leeromgeving&width=400&height=256&seq=steam-thuis-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/steam-onderwijs-thuis-praktische-tips-voor-ouders/'
  },
  {
    title: 'Hoe Dreamli Kits de Fantasie van Kinderen Versterken',
    excerpt: 'Een diepgaande kijk op hoe onze unieke kits kinderen helpen hun creatieve potentieel te ontdekken.',
    readTime: '5 min lezen',
    category: 'Producten',
    image: 'https://readdy.ai/api/search-image?query=Dreamli%20creatieve%20kits%20kinderen%20spelen%20fantasie%20versterken%20kleurrijke%20educatieve%20materialen%20vrolijke%20kinderen%20creatief%20bezig&width=400&height=256&seq=dreamli-kits-fantasie-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/hoe-dreamli-kits-de-fantasie-van-kinderen-versterken/'
  },
  {
    title: 'De Psychologie van Spelen: Waarom Spel Meer is dan Entertainment',
    excerpt: 'Wetenschappelijke inzichten in hoe spel de emotionele en sociale ontwikkeling van kinderen beïnvloedt.',
    readTime: '8 min lezen',
    category: 'Psychologie',
    image: 'https://readdy.ai/api/search-image?query=kinderen%20spelen%20samen%20sociale%20emotionele%20ontwikkeling%20psychologie%20van%20spel%20interactie%20vrolijke%20speelse%20omgeving%20leren%20door%20spelen&width=400&height=256&seq=psychologie-spelen-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/de-psychologie-van-spelen-waarom-spel-meer-is-dan-entertainment/'
  },
  {
    title: 'Digitale Creativiteit vs. Traditioneel Ambacht: Een Evenwicht Vinden',
    excerpt: 'Hoe moderne ouders een gezonde balans kunnen vinden tussen schermtijd en hands-on creativiteit.',
    readTime: '6 min lezen',
    category: 'Moderne Opvoeding',
    image: 'https://readdy.ai/api/search-image?query=balans%20digitale%20creativiteit%20traditioneel%20ambacht%20kinderen%20iPad%20tablet%20versus%20verf%20knutselen%20moderne%20opvoeding%20evenwichtige%20benadering&width=400&height=256&seq=digitaal-traditioneel-balans-nl&orientation=landscape',
    link: 'https://blog.dreamli.nl/digitale-creativiteit-vs-traditioneel-ambacht-een-evenwicht-vinden/'
  }
];

export default function LatestPostsNL() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nieuwste <span className="text-purple-600">Artikelen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Blijf op de hoogte van de laatste trends en tips in kinderontwikkeling en creatief spelen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post, index) => (
            <article key={index} className="group cursor-pointer">
              <a 
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
                  <div className="relative">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <i className="ri-time-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {post.readTime}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors whitespace-nowrap">
                      Lees Meer
                      <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://blog.dreamli.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
          >
            Bekijk Alle Artikelen
            <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
