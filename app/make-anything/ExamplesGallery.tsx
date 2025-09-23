'use client';

import { useState } from 'react';

export default function ExamplesGallery() {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const examples = [
    {
      id: 1,
      title: "Child's drawing → mini figurine",
      before: "https://readdy.ai/api/search-image?query=Childs%20colorful%20crayon%20drawing%20of%20a%20cute%20monster%20character%20with%20big%20eyes%20and%20simple%20shapes%2C%20drawn%20on%20white%20paper%2C%20vibrant%20colors%2C%20bold%20outlines&width=400&height=400&seq=before-child-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=Small%203D%20printed%20figurine%20of%20the%20same%20cute%20monster%20character%20from%20the%20drawing%2C%20colorful%20plastic%20material%2C%20sitting%20on%20a%20white%20surface%2C%20professional%20product%20photography&width=400&height=400&seq=after-child-1&orientation=squarish"
    },
    {
      id: 2,
      title: "Pet photo → desk statue",
      before: "https://readdy.ai/api/search-image?query=Clear%20portrait%20photo%20of%20a%20golden%20retriever%20dog%20sitting%2C%20front%20view%2C%20good%20lighting%2C%20sharp%20focus%2C%20clean%20background%2C%20perfect%20for%203D%20modeling&width=400&height=400&seq=before-pet-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=3D%20printed%20statue%20of%20the%20same%20golden%20retriever%20dog%20on%20a%20desk%2C%20medium%20size%2C%20realistic%20proportions%2C%20single%20color%20plastic%2C%20professional%20office%20setting&width=400&height=400&seq=after-pet-1&orientation=squarish"
    },
    {
      id: 3,
      title: "Logo → display piece",
      before: "https://readdy.ai/api/search-image?query=Modern%20company%20logo%20design%20with%20geometric%20shapes%20and%20clean%20lines%2C%20minimalist%20style%2C%20vector-like%20appearance%2C%20perfect%20for%203D%20conversion&width=400&height=400&seq=before-logo-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=Large%203D%20printed%20version%20of%20the%20same%20logo%20as%20a%20display%20piece%2C%20elevated%20on%20a%20stand%2C%20clean%20white%20plastic%20material%2C%20office%20display%20setting&width=400&height=400&seq=after-logo-1&orientation=squarish"
    },
    {
      id: 4,
      title: "Game avatar → shelf model",
      before: "https://readdy.ai/api/search-image?query=Video%20game%20character%20avatar%20with%20distinctive%20armor%20and%20weapons%2C%20cartoon%20style%2C%20clear%20features%2C%203%2F4%20view%20angle%2C%20colorful%20design&width=400&height=400&seq=before-avatar-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=3D%20printed%20model%20of%20the%20same%20game%20character%20on%20a%20shelf%2C%20medium%20size%2C%20multi-colored%20plastic%20printing%2C%20detailed%20features%2C%20collector%20display&width=400&height=400&seq=after-avatar-1&orientation=squarish"
    },
    {
      id: 5,
      title: "Birthday gift figurine",
      before: "https://readdy.ai/api/search-image?query=Hand-drawn%20sketch%20of%20a%20family%20portrait%20with%20simple%20stick%20figures%20and%20heart%20symbols%2C%20drawn%20with%20love%2C%20personal%20touch%2C%20gift%20concept&width=400&height=400&seq=before-gift-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=3D%20printed%20family%20figurine%20based%20on%20the%20drawing%2C%20small%20size%2C%20colorful%20details%2C%20presented%20as%20a%20birthday%20gift%20with%20wrapping%2C%20heartwarming%20scene&width=400&height=400&seq=after-gift-1&orientation=squarish"
    },
    {
      id: 6,
      title: "Anniversary keepsake",
      before: "https://readdy.ai/api/search-image?query=Romantic%20couple%20photo%20in%20black%20and%20white%2C%20holding%20hands%2C%20side%20profile%20view%2C%20classic%20portrait%20style%2C%20perfect%20for%20commemorative%20piece&width=400&height=400&seq=before-anniversary-1&orientation=squarish",
      after: "https://readdy.ai/api/search-image?query=Elegant%203D%20printed%20silhouette%20of%20the%20couple%2C%20small%20decorative%20piece%2C%20single%20color%20white%20plastic%2C%20romantic%20anniversary%20gift%20presentation&width=400&height=400&seq=after-anniversary-1&orientation=squarish"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            See what others made
          </h2>
          <p className="text-xl text-gray-600">
            From kids' drawings and pets to logos and game avatars.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div 
              key={example.id} 
              className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedExample(example.id)}
            >
              <div className="grid grid-cols-2 h-48">
                <div className="relative">
                  <img 
                    src={example.before}
                    alt={`Before - ${example.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={example.after}
                    alt={`After - ${example.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    After
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-center">
                  {example.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for enlarged view */}
        {selectedExample && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {examples.find(ex => ex.id === selectedExample)?.title}
                  </h3>
                  <button 
                    onClick={() => setSelectedExample(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <i className="ri-close-line text-gray-600"></i>
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Original</h4>
                    <img 
                      src={examples.find(ex => ex.id === selectedExample)?.before}
                      alt="Before"
                      className="w-full h-80 object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">3D Printed Result</h4>
                    <img 
                      src={examples.find(ex => ex.id === selectedExample)?.after}
                      alt="After"
                      className="w-full h-80 object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}