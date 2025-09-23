
'use client';

import Link from 'next/link';

const categories = [
  {
    title: 'Kinderontwikkeling',
    description: 'Ondersteun de groei van je kind met deskundige tips en inzichten.',
    icon: 'ri-heart-line',
    color: 'bg-gradient-to-br from-pink-500 to-rose-500',
    link: 'https://blog.dreamli.nl/category/kinderontwikkeling/'
  },
  {
    title: 'Creatieve Activiteiten',
    description: 'Ontdek leuke DIY-projecten en activiteiten voor thuis.',
    icon: 'ri-palette-line',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    link: 'https://blog.dreamli.nl/category/activiteiten/'
  },
  {
    title: 'Opvoedingstips',
    description: 'Praktische adviezen van ervaringsdeskundigen en specialisten.',
    icon: 'ri-lightbulb-line',
    color: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    link: 'https://blog.dreamli.nl/category/opvoeding/'
  },
  {
    title: 'Succesverhalen',
    description: 'Inspirerende verhalen van families die Dreamli gebruiken.',
    icon: 'ri-star-line',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    link: 'https://blog.dreamli.nl/category/succesverhalen/'
  }
];

export default function CategoryHighlightsNL() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ontdek Onze <span className="text-purple-600">Categorieën</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vind precies wat je zoekt met onze zorgvuldig samengestelde onderwerpen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={category.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full">
                <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${category.icon} text-white text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {category.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                  Verken
                  <i className="ri-arrow-right-line ml-2 w-4 h-4 flex items-center justify-center group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
