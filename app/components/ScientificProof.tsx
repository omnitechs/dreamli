
'use client';

import { useState } from 'react';

export default function ScientificProof() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="py-24 bg-[#FFFDE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Scientific Proof / Why This Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just selling toys, we're helping child development
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Research benefits */}
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Research-Based Benefits</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-focus-3-fill text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg mb-2">
                        Creative play improves focus & attention span
                      </p>
                      <a href="https://www.science.org/doi/10.1126/science.1151148" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                        Diamond, A. et al., 2007 – Science
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        Randomized trial of play-based "Tools of the Mind" curriculum showed significant gains in executive functions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-plant-fill text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg mb-2">
                        Builds resilience and growth mindset
                      </p>
                      <a href="https://doi.org/10.1038/s41586-019-1466-y" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                        Yeager, D.S. et al., 2019 – Nature
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        U.S. study: growth-mindset interventions improved grades and fostered coping/resilience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-trophy-fill text-white text-sm"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg mb-2">
                        Strengthens self-esteem and problem-solving skills
                      </p>
                      <a href="https://doi.org/10.1111/nyas.14235" target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-blue-600 cursor-pointer">
                        Mak, H.W. & Fancourt, D., 2020 – Annals of the NY Academy of Sciences
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        UK study of 6,209 children: arts & making activities linked to ~32% higher self-esteem
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional supporting text */}
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <i className="ri-lightbulb-fill text-yellow-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-2">The Science Behind Creative Play</p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            When children engage in hands-on creative activities, their brains form new neural pathways 
                            that enhance cognitive flexibility, emotional regulation, and social skills development.
                          </p>
                        </div>
                        <button 
                          onClick={() => setShowModal(true)}
                          className="w-8 h-8 flex items-center justify-center text-white rounded-full transition-colors cursor-pointer flex-shrink-0 ml-3" 
                          title="Learn more about the research" 
                          style={{background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%) !important'}}
                        >
                          <i className="ri-information-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Video */}
            <div className="relative px-4 sm:px-0">
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg relative">
                <img 
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/f381d98f33b951ad90f22af6a9faddb4.webp"
                  alt="Dutch children drawing at a table with Dutch educators in white lab coats guiding them during a creative workshop"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
                
                {/* Floating statistics - adjusted for mobile */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl transform rotate-12">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">15%</div>
                    <div className="text-xs">Better Focus</div>
                  </div>
                </div>
                
                <a 
                  href="https://blog.dreamli.nl/unlocking-confidence-and-resilience-through-creative-play/#higher-confidence"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl transform -rotate-12 hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">32%</div>
                    <div className="text-xs">Higher Confidence</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">The Outliers Advantage</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Malcolm Gladwell's Research</h4>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    As Malcolm Gladwell explains in his bestselling book <em>Outliers</em>, even small advantages in a child's early years can compound into lifelong success. Dreamli gives children that early boost in focus, creativity, and confidence — skills that grow with them year after year.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <p className="font-semibold text-blue-900 text-center text-lg">
                      Early advantage = Lifelong impact
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
