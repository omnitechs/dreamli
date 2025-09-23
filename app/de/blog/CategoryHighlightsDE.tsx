'use client';

import Link from 'next/link';

export default function CategoryHighlightsDE() {
  const categories = [
    {
      title: "Kreativität & Kindesentwicklung",
      description: "Wissenschaftlich fundierte Einblicke zur Förderung der Kreativität",
      icon: "ri-palette-line",
      gradient: "from-purple-500 to-pink-500",
      href: "https://blog.dreamli.nl/category/creativity-and-child-development/"
    },
    {
      title: "Erziehungs- & Bildungstipps", 
      description: "Expertenrat für moderne Eltern",
      icon: "ri-parent-line",
      gradient: "from-blue-500 to-cyan-500",
      href: "https://blog.dreamli.nl/category/parenting-and-education-tips/"
    },
    {
      title: "Dreamli Geschichten & Hinter den Kulissen",
      description: "Echte Familien, echte Transformationen", 
      icon: "ri-camera-line",
      gradient: "from-[#93C4FF] to-[#ACEEF3]",
      href: "https://blog.dreamli.nl/category/dreamli-stories-and-behind-the-scenes/"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Unsere Kategorien entdecken
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finden Sie genau das, was Sie suchen, mit unseren organisierten Inhaltskategorien.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              href={category.href}
              className="group block h-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border hover:border-gray-200 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${category.icon} text-2xl text-white w-8 h-8 flex items-center justify-center`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors">
                  Artikel erkunden
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