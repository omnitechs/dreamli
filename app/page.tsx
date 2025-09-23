
'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Gift Finder Hero Section */}
      <section className="bg-gradient-to-br from-[#DBEAFE]/20 to[#F3E8FF]/20">
        {/* Title Section - Sticks to top */}
        <div className="pt-12 pb-8">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight">
                Find the perfect gift <span className="text-[#8472DF]">your way</span>
              </h2>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="pb-16 sm:pb-24 lg:pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-6">
                  <p className="text-xl text-[#2E2E2E]/80 leading-relaxed">
                    Not sure what to choose? With Dreamli you can find gifts in two ways:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Ask our AI Gift Assistant</h3>
                        <p className="text-[#2E2E2E]/70">
                          Just tell it what you&apos;re looking for — a budget, an occasion, or even a vibe — and it will instantly suggest the best matches from thousands of products. No scrolling, no searching, just quick results.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#2E2E2E] mb-2">Use Advanced Filters</h3>
                        <p className="text-[#2E2E2E]/70">
                          Prefer to explore yourself? Set filters for budget, occasion, recipient, age group, or style, and browse our complete catalog of exclusive and personalized gifts.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href="https://shop.dreamli.nl/shop" className="inline-flex items-center gap-3 bg-[#8472DF] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8472DF]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                    <i className="ri-search-line text-xl w-6 h-6 flex items-center justify-center"></i>
                    Start Gift Finder
                  </Link>
                </div>
                
                <div className="relative lg:col-span-1">
                  {/* AI Chat Interface */}
                  <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#F3E8FF] mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center">
                          <i className="ri-robot-line text-white text-lg w-5 h-5 flex items-center justify-center"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#2E2E2E]">AI Gift Assistant</h3>
                          <p className="text-sm text-[#2E2E2E]/60">Online now</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#F8F9FF] p-4 rounded-2xl rounded-bl-sm">
                          <p className="text-[#2E2E2E]">Hi! I&apos;m here to help you find the perfect gift. What are you looking for?</p>
                        </div>
                        
                        <div className="bg-[#8472DF] text-white p-4 rounded-2xl rounded-br-sm ml-8">
                          <p>I need a birthday gift for my 8-year-old nephew, budget around €40</p>
                        </div>
                        
                        <div className="bg-[#F8F9FF] p-4 rounded-2xl rounded-bl-sm">
                          <p className="text-[#2E2E2E]">Perfect! I found 12 amazing options for 8-year-old&apos;s within €40. Would you like to see personalized items or our trending gifts?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <input 
                          type="text" 
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#8472DF]"
                        />
                        <button className="w-10 h-10 bg-[#8472DF] text-white rounded-full flex items-center justify-center hover:bg-[#8472DF]/90 transition-colors">
                          <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFB067] rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#93C4FF]/20 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Turn any idea into a gift */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Turn any idea into a <span className="text-[#8472DF]">gift</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                With the help of AI and our creative team, you can transform almost anything into a physical gift. Share a picture, a child&apos;s drawing, or even a short description — and we&apos;ll bring it to life as a figurine, puzzle, sleep light, or other custom creation. Your imagination becomes a gift they can hold.
              </p>
              <Link href="https://panel.dreamli.nl/create-with-ai" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer">
                <i className="ri-magic-line text-xl w-6 h-6 flex items-center justify-center"></i>
                Start a Custom Order
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img 
                  src="https://readdy.ai/api/search-image?query=Creative%20workspace%20with%20colorful%20child%20drawings%20being%20transformed%20into%203D%20objects%2C%20art%20studio%20environment%2C%20bright%20and%20inspiring%20atmosphere%2C%20digital%20design%20process%2C%20modern%20technology%20meets%20traditional%20art%2C%20warm%20lighting%2C%20creative%20tools%20and%20materials%20scattered%20around&width=600&height=500&seq=custom-order-process&orientation=landscape"
                  alt="Custom order creation process"
                  className="w-full h-[500px] rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-80 animate-pulse"></div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-cloud-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Upload &amp; Share</h3>
                    <p className="text-[#2E2E2E]/70">
                      Upload your photo, drawing, or idea. Our AI gets to work instantly and starts shaping it into a gift.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-palette-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Design &amp; Refine</h3>
                    <p className="text-[#2E2E2E]/70">
                      Some models are created fully by AI — you can interact directly, adjust, and confirm in real time. Others combine AI with our design team. In those cases, you&apos;ll see the preview once it&apos;s finalized, and you can approve or request changes. Either way, you&apos;re always in control.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-gift-2-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Print &amp; Deliver</h3>
                    <p className="text-[#2E2E2E]/70">
                      Once you confirm the design, we 3D print it in the Netherlands with high-quality materials and ship it straight to your door.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Dreamli Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#F3E8FF]/30 to-[#DBEAFE]/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Why Dreamli is the home of <span className="text-[#8472DF]">unforgettable gifts</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                Choosing the right gift isn&apos;t about the price tag — it&apos;s about the story, the surprise, and the connection. At Dreamli we bring these moments to life. Whether you&apos;re looking for something rare and exclusive, a personalized creation made from your own photo or drawing, or a quick pick from our wide catalog, you&apos;ll find it here.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-gift-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">🎁 Exclusive Gifts</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Carefully curated, limited, and unique pieces you won&apos;t find anywhere else.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-star-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">✨ Personalized Gifts</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Made from your photos, drawings, or ideas. Turn memories into meaningful keepsakes.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-book-line text-2xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4 text-center">📚 Complete Gift Catalog</h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Everything from small surprises to statement pieces, all in one convenient place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
