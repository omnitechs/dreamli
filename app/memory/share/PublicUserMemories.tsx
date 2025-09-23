
'use client';

import { useState } from 'react';

interface Memory {
  id: number;
  type: 'photo' | 'video' | 'note';
  content: string;
  caption?: string;
  date: string;
  isPublic: boolean;
}

export default function PublicUserMemories() {
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);

  // Only show public memories
  const publicMemories: Memory[] = [
    {
      id: 1,
      type: 'photo',
      content: 'https://readdy.ai/api/search-image?query=Happy%20child%20playing%20with%20colorful%20unicorn%20figurine%20in%20a%20bright%20bedroom%2C%20natural%20lighting%2C%20joyful%20expression%2C%20family%20photo%20style%2C%20warm%20and%20loving%20atmosphere%2C%20showing%20the%20magical%20bond%20between%20child%20and%20toy%2C%20pure%20happiness%20and%20wonder&width=400&height=400&seq=public-memory-1&orientation=squarish',
      caption: 'Adam\'s eerste dag met zijn magische Dreamli!',
      date: '22 juni 2024',
      isPublic: true
    },
    {
      id: 2,
      type: 'note',
      content: 'Adam draagt zijn eenhoorn nu overal mee naartoe. Hij stond er zelfs op dat het mee kwam eten vanavond! De vreugde in zijn ogen toen hij zijn tekening tot leven zag komen was werkelijk onbetaalbaar. Dit is echt een magische ervaring geweest voor ons hele gezin.',
      caption: 'Reflectie van een ouder',
      date: '23 juni 2024',
      isPublic: true
    },
    {
      id: 3,
      type: 'photo',
      content: 'https://readdy.ai/api/search-image?query=Colorful%20unicorn%20figurine%20sitting%20on%20a%20bedside%20table%20next%20to%20a%20bed%20where%20a%20child%20is%20sleeping%20peacefully%2C%20nightlight%20creating%20soft%20warm%20glow%2C%20bedtime%20routine%2C%20peaceful%20and%20safe%20atmosphere%2C%20magical%20guardian%20watching%20over%20dreams&width=400&height=400&seq=public-memory-2&orientation=squarish',
      caption: 'Hij tekent en schildert nu veel meer dan vroeger. Waakt over zoete dromen ',
      date: '24 juni 2024',
      isPublic: true
    },
    {
      id: 4,
      type: 'photo',
      content: 'https://readdy.ai/api/search-image?query=Family%20picnic%20scene%20with%20colorful%20unicorn%20figurine%20placed%20on%20a%20checkered%20blanket%20in%20a%20sunny%20park%2C%20surrounded%20by%20family%20members%20having%20lunch%2C%20outdoor%20family%20bonding%2C%20summer%20day%2C%20joyful%20family%20memories%20being%20created&width=400&height=400&seq=public-memory-3&orientation=squarish',
      caption: 'Familie picknick met ons nieuwste gezinslid!',
      date: '25 juni 2024',
      isPublic: true
    },
    {
      id: 5,
      type: 'note',
      content: 'Vandaag stelde Adam zijn Dreamli voor aan zijn oma via videobellen. Oma was zo verbaasd om de tekening die ze Adam had zien maken tot leven te zien komen als echt speelgoed. Drie generaties verbonden door één magisch moment.',
      caption: 'Generaties verbinden',
      date: '26 juni 2024',
      isPublic: true
    },
    {
      id: 6,
      type: 'photo',
      content: 'https://readdy.ai/api/search-image?query=Child%20proudly%20showing%20colorful%20unicorn%20figurine%20to%20friends%20at%20school%20or%20playground%2C%20other%20children%20gathering%20around%20with%20excitement%20and%20wonder%2C%20social%20interaction%2C%20sharing%20joy%20and%20creativity%2C%20bright%20outdoor%20setting&width=400&height=400&seq=public-memory-4&orientation=squarish',
      caption: 'Show en vertel superster! ',
      date: '27 juni 2024',
      isPublic: true
    }
  ];

  const selectedMemoryData = publicMemories.find(m => m.id === selectedMemory);

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Their Magical Moments
        </h2>
        <p className="text-gray-600 text-lg">
          Beautiful memories shared by the family
        </p>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publicMemories.map((memory, index) => (
          <div 
            key={memory.id} 
            className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/70 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative">
              {memory.type === 'photo' && (
                <div className="relative group">
                  <img 
                    src={memory.content}
                    alt="Memory"
                    className="w-full h-64 object-cover object-top cursor-pointer transition-transform duration-300 group-hover:scale-110"
                    onClick={() => setSelectedMemory(memory.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <i className="ri-zoom-in-line text-2xl text-gray-800"></i>
                    </div>
                  </div>
                </div>
              )}
              
              {memory.type === 'note' && (
                <div className="p-8 bg-gradient-to-br from-[#FFF5F5] to-[#F0F8FF] min-h-[16rem] flex items-center">
                  <div className="relative">
                    <i className="ri-double-quotes-l text-4xl text-gray-300 absolute -top-4 -left-2"></i>
                    <p className="text-gray-800 leading-relaxed text-lg font-medium relative z-10">
                      {memory.content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              {memory.caption && (
                <h3 className="text-gray-800 font-bold mb-3 text-lg">{memory.caption}</h3>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">{memory.date}</span>
                <div className="flex items-center space-x-1">
                  <i className="ri-heart-line text-red-400"></i>
                  <span className="text-sm text-gray-500">Public</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {publicMemories.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="ri-camera-line text-4xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No memories shared yet</h3>
          <p className="text-gray-600 text-lg">
            The family hasn't shared any public memories yet, but check back soon!
          </p>
        </div>
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && selectedMemoryData && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer z-10 shadow-lg"
            >
              <i className="ri-close-line text-2xl text-gray-800"></i>
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
              {selectedMemoryData.type === 'photo' && (
                <img 
                  src={selectedMemoryData.content}
                  alt="Memory"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              )}
              
              <div className="p-8">
                {selectedMemoryData.caption && (
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedMemoryData.caption}
                  </h3>
                )}
                
                {selectedMemoryData.type === 'note' && (
                  <div className="mb-6">
                    <i className="ri-double-quotes-l text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {selectedMemoryData.content}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-500 font-medium">{selectedMemoryData.date}</span>
                  <div className="flex items-center space-x-2">
                    <i className="ri-heart-line text-red-400"></i>
                    <span className="text-gray-500">Shared with love</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
