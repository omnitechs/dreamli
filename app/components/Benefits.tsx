
'use client';

import { useState } from 'react';

export default function Benefits() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: "🎯",
      title: "Laser Focus",
      summary: "Activities that hold attention longer",
      detail: "When their drawing becomes real, they'll spend hours perfecting every detail - building concentration that transfers to homework and hobbies."
    },
    {
      icon: "✋",
      title: "Fine Motor Skills", 
      summary: "Improve hand-eye coordination",
      detail: "Creating custom 3D figurines develops the precise hand movements needed for writing, sports, and detailed work."
    },
    {
      icon: "🧩",
      title: "Spatial Problem-Solving",
      summary: "Learn to plan and think ahead", 
      detail: "Figuring out how their 2D drawing translates to 3D develops engineering thinking that helps in math, science, and life."
    },
    {
      icon: "💪",
      title: "Creative Confidence",
      summary: "See their own ideas come to life",
      detail: "Nothing builds self-esteem like showing friends \"I designed this myself\" - confidence that radiates into everything they do."
    },
    {
      icon: "🧠", 
      title: "Growth Mindset",
      summary: "Learn that practice makes progress",
      detail: "Each educational art kit teaches them that effort and creativity lead to amazing results they can hold and treasure."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-r from-[#93C4FF] to-[#F3E8FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Creative Kits Build Future Success
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The skills they develop today become their superpowers tomorrow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-all duration-300 border-2 border-gray-900/10">
                <span className="text-4xl filter drop-shadow-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  {benefit.icon}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 text-base leading-relaxed mb-4 px-2">
                {benefit.summary}
              </p>

              {/* Hidden detailed content for SEO */}
              <div className="hidden">
                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.detail}
                </p>
              </div>

              {/* Learn more button */}
              <button
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                className="inline-flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                aria-expanded={expandedCard === index}
              >
                <span className="mr-1">Learn more</span>
                <i className={`ri-arrow-${expandedCard === index ? 'up' : 'down'}-s-line transition-transform duration-200`}></i>
              </button>

              {/* Expandable detail */}
              {expandedCard === index && (
                <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.detail}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="rounded-2xl p-8 border border-white/30 max-w-4xl mx-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-6">
              <span className="text-gray-800 text-lg font-medium leading-relaxed flex-1 text-center">
                Research shows creative confidence developed in childhood compounds over decades. Our STEAM toys for kids give them that early advantage - transforming today's drawings into tomorrow's innovative thinking.
              </span>
              <button 
                className="w-10 h-10 flex items-center justify-center text-white rounded-full transition-colors cursor-pointer flex-shrink-0 hover:scale-110"
                title="Learn more about the research"
                style={{background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%)'}}
              >
                <i className="ri-information-line text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
