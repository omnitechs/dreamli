
'use client';
import { useState } from 'react';

export default function PopularIdeasSection() {
  const [selectedCategory, setSelectedCategory] = useState('keepsakes');

  const categories = [
    { id: 'keepsakes', label: 'Personal Keepsakes', icon: 'ri-heart-fill' },
    { id: 'figures', label: 'Famous Figures', icon: 'ri-trophy-fill' },
    { id: 'friends', label: 'Friends & Family', icon: 'ri-group-fill' },
    { id: 'professional', label: 'Professional', icon: 'ri-briefcase-fill' }
  ];

  const ideas = {
    keepsakes: [
      {
        title: "Kids' Drawings → 3D Keepsakes",
        description: "Transform their masterpieces into treasured figurines",
        image: "https://readdy.ai/api/search-image?query=beautiful%20colorful%20child%20drawing%20of%20a%20fantasy%20creature%20transformed%20into%20a%20white%203D%20printed%20figurine%20on%20a%20wooden%20desk%2C%20soft%20lighting%2C%20magical%20atmosphere%2C%20high%20quality%20photography&width=400&height=300&seq=1&orientation=landscape",
        gradient: "from-pink-100 to-rose-200",
        iconBg: "bg-pink-500",
        icon: "ri-palette-fill"
      },
      {
        title: "Pet Portraits → Mini Statues",
        description: "Immortalize your furry friends forever",
        image: "https://readdy.ai/api/search-image?query=adorable%20golden%20retriever%20dog%20sitting%20next%20to%20its%20white%203D%20printed%20miniature%20statue%20replica%20on%20a%20home%20table%2C%20warm%20lighting%2C%20heartwarming%20scene&width=400&height=300&seq=2&orientation=landscape",
        gradient: "from-amber-100 to-orange-200",
        iconBg: "bg-amber-500",
        icon: "ri-heart-fill"
      },
      {
        title: "Wedding Moments → Eternal Memory",
        description: "Preserve your special day in 3D",
        image: "https://readdy.ai/api/search-image?query=elegant%20white%203D%20printed%20wedding%20couple%20figurine%20based%20on%20wedding%20photo%2C%20romantic%20setting%20with%20flowers%2C%20soft%20romantic%20lighting%2C%20luxury%20feel&width=400&height=300&seq=3&orientation=landscape",
        gradient: "from-purple-100 to-pink-200",
        iconBg: "bg-purple-500",
        icon: "ri-hearts-fill"
      }
    ],
    figures: [
      {
        title: "Historical Icons → Study Models",
        description: "Einstein, Da Vinci, and more legendary figures",
        image: "https://readdy.ai/api/search-image?query=detailed%20white%203D%20printed%20bust%20of%20Albert%20Einstein%20with%20wild%20hair%2C%20sitting%20on%20a%20bookshelf%20in%20a%20study%20room%2C%20scholarly%20atmosphere%2C%20high%20quality&width=400&height=300&seq=4&orientation=landscape",
        gradient: "from-blue-100 to-indigo-200",
        iconBg: "bg-blue-500",
        icon: "ri-graduation-cap-fill"
      },
      {
        title: "Movie Characters → Collectibles",
        description: "Iconic characters from your favorite films",
        image: "https://readdy.ai/api/search-image?query=collection%20of%20white%203D%20printed%20movie%20character%20figurines%20on%20display%20shelf%2C%20dramatic%20lighting%2C%20collector%20setup%2C%20cinema%20atmosphere&width=400&height=300&seq=5&orientation=landscape",
        gradient: "from-red-100 to-pink-200",
        iconBg: "bg-red-500",
        icon: "ri-movie-fill"
      },
      {
        title: "Sports Legends → Trophy Room",
        description: "Champions and athletes in miniature form",
        image: "https://readdy.ai/api/search-image?query=white%203D%20printed%20sports%20figure%20in%20action%20pose%20on%20a%20trophy%20display%20case%2C%20dynamic%20lighting%2C%20championship%20feel%2C%20professional%20sports%20memorabilia&width=400&height=300&seq=6&orientation=landscape",
        gradient: "from-green-100 to-emerald-200",
        iconBg: "bg-green-500",
        icon: "ri-medal-fill"
      }
    ],
    friends: [
      {
        title: "Friend Group → Squad Figurines",
        description: "Your whole crew in miniature form",
        image: "https://readdy.ai/api/search-image?query=group%20of%20diverse%20white%203D%20printed%20friend%20figurines%20standing%20together%20on%20a%20desk%2C%20friendship%20theme%2C%20warm%20lighting%2C%20happy%20atmosphere&width=400&height=300&seq=7&orientation=landscape",
        gradient: "from-cyan-100 to-blue-200",
        iconBg: "bg-cyan-500",
        icon: "ri-group-fill"
      },
      {
        title: "Family Portraits → Generational Art",
        description: "Multi-generational family memories preserved",
        image: "https://readdy.ai/api/search-image?query=beautiful%20white%203D%20printed%20family%20figurine%20set%20showing%20three%20generations%20on%20a%20mantelpiece%2C%20cozy%20home%20setting%2C%20family%20love%20atmosphere&width=400&height=300&seq=8&orientation=landscape",
        gradient: "from-teal-100 to-cyan-200",
        iconBg: "bg-teal-500",
        icon: "ri-home-heart-fill"
      },
      {
        title: "Graduation Photos → Achievement Statues",
        description: "Celebrate academic milestones in 3D",
        image: "https://readdy.ai/api/search-image?query=proud%20graduate%20in%20cap%20and%20gown%20transformed%20into%20white%203D%20printed%20figurine%2C%20graduation%20ceremony%20background%2C%20achievement%20celebration%20theme&width=400&height=300&seq=9&orientation=landscape",
        gradient: "from-indigo-100 to-purple-200",
        iconBg: "bg-indigo-500",
        icon: "ri-graduation-cap-fill"
      }
    ],
    professional: [
      {
        title: "Company Logos → Office Displays",
        description: "Professional branded showcase pieces",
        image: "https://readdy.ai/api/search-image?query=sleek%20white%203D%20printed%20company%20logo%20sculpture%20on%20executive%20desk%20in%20modern%20office%2C%20professional%20lighting%2C%20corporate%20atmosphere&width=400&height=300&seq=10&orientation=landscape",
        gradient: "from-slate-100 to-gray-200",
        iconBg: "bg-slate-500",
        icon: "ri-building-fill"
      },
      {
        title: "Product Prototypes → Presentations",
        description: "Bring your designs to client meetings",
        image: "https://readdy.ai/api/search-image?query=white%203D%20printed%20product%20prototype%20model%20on%20conference%20table%20during%20business%20presentation%2C%20professional%20meeting%20environment&width=400&height=300&seq=11&orientation=landscape",
        gradient: "from-orange-100 to-red-200",
        iconBg: "bg-orange-500",
        icon: "ri-lightbulb-fill"
      },
      {
        title: "Awards → Recognition Pieces",
        description: "Custom trophies and achievement displays",
        image: "https://readdy.ai/api/search-image?query=elegant%20white%203D%20printed%20custom%20award%20trophy%20on%20display%20stand%2C%20luxury%20presentation%2C%20achievement%20recognition%20theme&width=400&height=300&seq=12&orientation=landscape",
        gradient: "from-yellow-100 to-amber-200",
        iconBg: "bg-yellow-500",
        icon: "ri-trophy-fill"
      }
    ]
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Popular Ideas & Inspirations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From personal keepsakes to famous figures - discover what's possible when you transform 2D into amazing 3D creations
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              <i className={`${category.icon} text-lg`}></i>
              {category.label}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ideas[selectedCategory].map((idea, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 w-12 h-12 ${idea.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
                  <i className={`${idea.icon} text-white text-xl`}></i>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${idea.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-300`}></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {idea.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {idea.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-lightbulb-fill text-white text-3xl"></i>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Have Your Own Unique Idea?
              </h3>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Our advanced AI can transform virtually any image into a stunning 3D model. From technical drawings to abstract art, family photos to business logos - if you can imagine it, we can create it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer whitespace-nowrap">
                  <i className="ri-upload-cloud-fill mr-2"></i>
                  Start Creating Now
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-lg cursor-pointer whitespace-nowrap">
                  <i className="ri-question-line mr-2"></i>
                  See Examples
                </button>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
