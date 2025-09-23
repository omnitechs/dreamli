'use client';

import { useState } from 'react';

interface TimelineStep {
  id: number;
  icon: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  completed: boolean;
}

export default function PublicCreationTimeline() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const timelineSteps: TimelineStep[] = [
    {
      id: 1,
      icon: 'ri-pencil-line',
      title: 'Drawing Received',
      description: 'A beautiful drawing arrived at our studio, full of imagination and wonder',
      date: 'June 18, 2024',
      image: 'https://readdy.ai/api/search-image?query=A%20childs%20colorful%20drawing%20of%20a%20unicorn%20with%20rainbow%20mane%20on%20white%20paper%2C%20photographed%20on%20a%20clean%20white%20desk%20with%20soft%20natural%20lighting%2C%20showing%20the%20innocent%20and%20creative%20style%20of%20a%20young%20artist%2C%20surrounded%20by%20colored%20pencils%20and%20crayons%2C%20warm%20and%20inviting%20atmosphere%2C%20magical%20and%20dreamy&width=500&height=350&seq=public-drawing&orientation=landscape',
      completed: true
    },
    {
      id: 2,
      icon: 'ri-palette-line',
      title: '3D Design Created',
      description: 'Our talented artists carefully transformed the drawing into a magical 3D model',
      date: 'June 19, 2024',
      image: 'https://readdy.ai/api/search-image?query=3D%20modeling%20workspace%20showing%20a%20colorful%20unicorn%20figurine%20being%20designed%20on%20a%20computer%20screen%2C%20with%20digital%20sculpting%20tools%20and%20bright%20colors%2C%20professional%20studio%20environment%20with%20soft%20lighting%2C%20creative%20and%20technical%20atmosphere%2C%20magical%20transformation%20process&width=500&height=350&seq=public-3d-design&orientation=landscape',
      completed: true
    },
    {
      id: 3,
      icon: 'ri-printer-line',
      title: 'Printed & Painted',
      description: 'With love and care, each detail was printed and hand-painted to perfection',
      date: 'June 20, 2024',
      image: 'https://readdy.ai/api/search-image?query=Colorful%203D%20printed%20unicorn%20figurine%20being%20hand-painted%20by%20an%20artist%20in%20a%20bright%20workshop%2C%20with%20paint%20brushes%20and%20vibrant%20colors%2C%20showing%20the%20detailed%20craftsmanship%20and%20care%20in%20creating%20the%20magical%20toy%2C%20soft%20natural%20lighting%2C%20artisan%20craftsmanship&width=500&height=350&seq=public-printed&orientation=landscape',
      completed: true
    },
    {
      id: 4,
      icon: 'ri-gift-line',
      title: 'Packaged & Shipped',
      description: 'Carefully packaged with love and sent on its journey to create magical memories',
      date: 'June 21, 2024',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20gift%20packaging%20with%20a%20colorful%20unicorn%20figurine%20nestled%20in%20soft%20tissue%20paper%20inside%20an%20elegant%20box%2C%20with%20sparkles%20and%20magical%20elements%2C%20professional%20product%20photography%20with%20warm%20lighting%2C%20creating%20excitement%20and%20anticipation%2C%20magical%20delivery&width=500&height=350&seq=public-packaged&orientation=landscape',
      completed: true
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          How This Dreamli Was Born
        </h2>
        <p className="text-gray-600 text-lg">
          Follow the magical journey from drawing to reality
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFB6C1] via-[#B9E4C9] to-[#F5F5DC] opacity-40"></div>

        {/* Timeline steps */}
        <div className="space-y-12">
          {timelineSteps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative flex items-start animate-fade-in"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Timeline dot */}
              <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] transform hover:scale-105 transition-transform duration-300">
                <i className={`${step.icon} text-3xl text-white`}></i>
              </div>

              {/* Content */}
              <div className="ml-12 flex-1">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/70 hover:shadow-3xl transition-all duration-500 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      {step.date}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">{step.description}</p>
                  
                  {step.image && (
                    <div className="relative group">
                      <img 
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 object-cover object-top rounded-2xl cursor-pointer transition-transform duration-500 group-hover:scale-105"
                        onClick={() => setSelectedStep(step.id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <i className="ri-zoom-in-line text-2xl text-gray-800"></i>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedStep(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer z-10 shadow-lg"
            >
              <i className="ri-close-line text-2xl text-gray-800"></i>
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={timelineSteps.find(step => step.id === selectedStep)?.image}
                alt="Timeline step"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {timelineSteps.find(step => step.id === selectedStep)?.title}
                </h3>
                <p className="text-gray-600">
                  {timelineSteps.find(step => step.id === selectedStep)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}