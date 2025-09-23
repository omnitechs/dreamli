'use client';

import { useState } from 'react';

interface WorkshopProps {
  onBack: () => void;
}

interface WorkshopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  dreamPoints: number;
  category: 'kits' | 'toys' | 'robots' | 'tools';
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
}

export default function Workshop({ onBack }: WorkshopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<WorkshopItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Items', icon: 'ri-grid-line', color: 'from-gray-500 to-gray-600' },
    { id: 'kits', label: 'Building Kits', icon: 'ri-building-line', color: 'from-blue-500 to-indigo-500' },
    { id: 'toys', label: 'Magic Toys', icon: 'ri-toy-car-line', color: 'from-green-500 to-teal-500' },
    { id: 'robots', label: 'Robots', icon: 'ri-robot-line', color: 'from-purple-500 to-pink-500' },
    { id: 'tools', label: 'Creator Tools', icon: 'ri-tools-line', color: 'from-orange-500 to-red-500' }
  ];

  const workshopItems: WorkshopItem[] = [
    {
      id: 'dragon-kit',
      name: 'Dragon Builder Kit',
      description: 'Build your own fire-breathing dragon with LED eyes',
      price: 49.99,
      dreamPoints: 500,
      category: 'kits',
      image: 'https://readdy.ai/api/search-image?query=colorful%20dragon%20building%20kit%20toy%20set%20with%20blocks%20pieces%20LED%20lights%20magical%20fantasy%20theme%20children%20educational&width=400&height=300&seq=workshop1&orientation=landscape',
      difficulty: 'Intermediate',
      rating: 4.8,
      isBestseller: true
    },
    {
      id: 'unicorn-robot',
      name: 'Magical Unicorn Bot',
      description: 'Programmable unicorn that responds to voice commands',
      price: 89.99,
      dreamPoints: 800,
      category: 'robots',
      image: 'https://readdy.ai/api/search-image?query=cute%20programmable%20unicorn%20robot%20toy%20with%20rainbow%20colors%20LED%20horn%20interactive%20features%20children%20technology&width=400&height=300&seq=workshop2&orientation=landscape',
      difficulty: 'Advanced',
      rating: 4.9,
      isNew: true
    },
    {
      id: 'castle-kit',
      name: 'Fairy Tale Castle',
      description: 'Enchanted castle with working drawbridge and lights',
      price: 79.99,
      dreamPoints: 650,
      category: 'kits',
      image: 'https://readdy.ai/api/search-image?query=magical%20fairy%20tale%20castle%20building%20kit%20with%20towers%20drawbridge%20lights%20fantasy%20medieval%20theme%20colorful%20blocks&width=400&height=300&seq=workshop3&orientation=landscape',
      difficulty: 'Intermediate',
      rating: 4.7,
      discount: 20
    },
    {
      id: 'rainbow-car',
      name: 'Rainbow Speed Racer',
      description: 'Color-changing race car that lights up the track',
      price: 34.99,
      dreamPoints: 350,
      category: 'toys',
      image: 'https://readdy.ai/api/search-image?query=colorful%20rainbow%20race%20car%20toy%20with%20LED%20lights%20color%20changing%20effects%20speed%20racing%20theme%20children%20playful&width=400&height=300&seq=workshop4&orientation=landscape',
      difficulty: 'Beginner',
      rating: 4.6,
      isBestseller: true
    },
    {
      id: 'magic-wand',
      name: 'Creator\'s Magic Wand',
      description: 'Interactive wand that brings your creations to life',
      price: 24.99,
      dreamPoints: 250,
      category: 'tools',
      image: 'https://readdy.ai/api/search-image?query=magical%20creator%20wand%20tool%20with%20sparkles%20stars%20LED%20effects%20fantasy%20wizard%20theme%20interactive%20children%20toy&width=400&height=300&seq=workshop5&orientation=landscape',
      difficulty: 'Beginner',
      rating: 4.5,
      isNew: true
    },
    {
      id: 'space-station',
      name: 'Cosmic Space Station',
      description: 'Build your own orbiting space station with astronauts',
      price: 119.99,
      dreamPoints: 1200,
      category: 'kits',
      image: 'https://readdy.ai/api/search-image?query=space%20station%20building%20kit%20with%20astronaut%20figures%20rockets%20planets%20cosmic%20theme%20educational%20STEM%20children%20toy&width=400&height=300&seq=workshop6&orientation=landscape',
      difficulty: 'Advanced',
      rating: 4.9,
      discount: 15
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? workshopItems 
    : workshopItems.filter(item => item.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
      </button>

      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
          <i className="ri-hammer-line text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dreamli Workshop</h1>
        <p className="text-gray-600">Discover amazing kits, toys, and tools to enhance your creations</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium transition-all cursor-pointer ${
              selectedCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <i className={category.icon}></i>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border-2 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {item.isNew && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    NEW
                  </div>
                )}
                {item.isBestseller && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    BESTSELLER
                  </div>
                )}
                {item.discount && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{item.discount}%
                  </div>
                )}
              </div>

              {/* Quick Add Button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <i className="ri-shopping-cart-line text-white"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <i className="ri-star-fill text-sm"></i>
                  <span className="text-sm font-medium text-gray-600">{item.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </div>
                <div className="flex items-center space-x-2 text-orange-600 font-bold">
                  <i className="ri-coin-line text-sm"></i>
                  <span className="text-sm">{item.dreamPoints}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-800">
                  ${item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}
                  {item.discount && (
                    <span className="text-sm text-gray-400 line-through ml-2">${item.price}</span>
                  )}
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-80 object-cover object-top rounded-2xl"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <p className="text-gray-600 text-lg">{selectedItem.description}</p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Difficulty:</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedItem.difficulty)}`}>
                        {selectedItem.difficulty}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`ri-star-${i < Math.floor(selectedItem.rating) ? 'fill' : 'line'} text-sm`}></i>
                          ))}
                        </div>
                        <span className="text-gray-600">({selectedItem.rating})</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Dream Points:</span>
                      <div className="flex items-center space-x-2 text-orange-600 font-bold">
                        <i className="ri-coin-line"></i>
                        <span>{selectedItem.dreamPoints}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-2xl">
                      <span className="font-medium text-gray-700">Price:</span>
                      <div className="font-bold text-gray-800">
                        ${selectedItem.discount ? (selectedItem.price * (1 - selectedItem.discount / 100)).toFixed(2) : selectedItem.price}
                        {selectedItem.discount && (
                          <span className="text-lg text-gray-400 line-through ml-2">${selectedItem.price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer">
                      Add to Cart
                    </button>
                    <button className="px-6 bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                      <i className="ri-heart-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-32 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-20 animate-spin" style={{animationDuration: '10s'}}></div>
      <div className="absolute bottom-32 left-16 w-8 h-8 bg-purple-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
    </div>
  );
}