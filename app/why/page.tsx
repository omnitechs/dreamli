
'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadForm from '../components/UploadForm';

export default function WhyPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [visibleSection, setVisibleSection] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.title = "Why Dreamli — Safe, Personalised 3D Kits from Kids' Art";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Celebrate your child\'s creativity with a durable, paintable 3D figure made from their drawing. Safe materials, careful modelling, a keepsake they\'ll treasure.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Celebrate your child\'s creativity with a durable, paintable 3D figure made from their drawing. Safe materials, careful modelling, a keepsake they\'ll treasure.';
      document.head.appendChild(meta);
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight * 0.8;
      
      setIsScrolled(scrollPosition > 50);
      setVisibleSection(Math.floor(scrollPosition / sectionHeight));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', label: 'The Beginning' },
    { id: 'story', label: 'My Story' },
    { id: 'pattern', label: 'The Pattern' },
    { id: 'challenge', label: 'New Challenge' },
    { id: 'solution', label: 'Why Dreamli' },
    { id: 'join', label: 'Join Us' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Progress Indicator */}
      <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${Math.min((visibleSection + 1) * 16.67, 100)}%` }}
        />
      </div>

      {/* Floating Navigation */}
      <div className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
        <div className="bg-white rounded-full shadow-lg p-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block w-3 h-3 rounded-full mb-2 transition-all duration-300 hover:scale-125 ${
                visibleSection >= index ? 'bg-purple-500' : 'bg-gray-300'
              }`}
              title={section.label}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      >
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://readdy.ai/api/search-image?query=Beautiful%20abstract%20flowing%20lines%20and%20particles%20representing%20creativity%20and%20potential%2C%20soft%20purple%20and%20pink%20gradients%2C%20dreamy%20atmosphere%2C%20inspirational%20background%2C%20digital%20art%2C%20flowing%20energy%2C%20sparkling%20particles%2C%20gentle%20light%20rays%2C%20ethereal%20beauty&width=1920&height=1080&seq=why-hero-bg&orientation=landscape"
            alt="Creative potential background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-6 pt-32 pb-20 flex items-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Why Dreamli STEAM
                <span className="block text-5xl md:text-6xl mt-2">Exists</span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-600 mb-12 leading-relaxed">
                A story about discovering that 
                <span className="font-semibold text-purple-600"> talent isn't born—it's nurtured</span>
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => scrollToSection('story')}
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center">
                    Discover My Story
                    <i className="ri-arrow-down-line ml-2 group-hover:translate-y-1 transition-transform duration-300"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-mouse-line text-3xl text-purple-400"></i>
        </div>
      </section>

      {/* Personal Story Section */}
      <section 
        id="story" 
        className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-blue-50"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <div className="pl-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                      The Kitchen Table Moment
                    </h2>
                    
                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                      <p className="hover:text-purple-600 transition-colors duration-300 cursor-default">
                        When I was a child, people called me <span className="font-semibold text-purple-600">"smart."</span> 
                        Teachers praised my talent.
                      </p>
                      
                      <p className="hover:text-purple-600 transition-colors duration-300 cursor-default">
                        But every morning, my father gave me <span className="font-semibold text-red-500">two pages of math problems.</span> 
                        I struggled, erased holes in the paper, felt stuck.
                      </p>
                      
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                        <p className="text-green-700 font-medium">
                          Then something magical happened in class. Those same problems felt 
                          <span className="font-bold"> easy</span>—not because I was gifted, 
                          but because <span className="font-bold">I had practiced.</span>
                        </p>
                      </div>
                      
                      <p className="text-xl font-semibold text-purple-700 hover:scale-105 transition-transform duration-300 cursor-default">
                        That kitchen table moment changed everything I believed about talent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Warm%20kitchen%20scene%20with%20father%20and%20child%20working%20on%20math%20problems%20together%20at%20wooden%20table%2C%20soft%20morning%20light%2C%20educational%20materials%2C%20nurturing%20family%20moment%2C%20cozy%20home%20atmosphere%2C%20books%20and%20pencils%2C%20caring%20guidance%2C%20emotional%20learning%20experience&width=600&height=800&seq=kitchen-moment&orientation=portrait"
                    alt="Father helping child with math"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white p-4 rounded-2xl shadow-lg">
                  <i className="ri-lightbulb-flash-line text-3xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Pattern Section */}
      <section 
        id="pattern" 
        className="py-20 bg-white relative"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                The Pattern I Couldn't Ignore
              </h2>
              <p className="text-xl text-gray-600">As I grew, I saw it everywhere:</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Happy%20parent%20and%20child%20drawing%20together%20at%20kitchen%20table%2C%20colorful%20art%20supplies%2C%20watercolor%20paints%2C%20creative%20family%20bonding%20moment%2C%20warm%20lighting%2C%20artistic%20development%20through%20daily%20practice&width=400&height=300&seq=artistic-kids-1&orientation=landscape"
                    alt="Artistic Kids" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500 to-rose-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-palette-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  "Artistic Kids"
                </h3>
                <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  Their parents drew with them daily.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Family%20playing%20music%20together%20in%20living%20room%2C%20piano%20keyboard%2C%20children%20learning%20instruments%2C%20musical%20family%20bonding%2C%20parents%20teaching%20kids%20music%2C%20cozy%20home%20environment%2C%20musical%20development&width=400&height=300&seq=musical-kids-1&orientation=landscape"
                    alt="Musical Prodigies" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-indigo-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-music-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  "Musical Prodigies"
                </h3>
                <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  Families who played music together.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Parent%20and%20child%20playing%20sports%20together%20outdoors%2C%20soccer%20ball%2C%20running%20in%20park%2C%20family%20exercise%20time%2C%20active%20lifestyle%20through%20play%2C%20athletic%20development%20through%20play%2C%20joyful%20movement%2C%20sunny%20day&width=400&height=300&seq=athletic-kids-1&orientation=landscape"
                    alt="Natural Athletes" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-cyan-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-trophy-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  "Natural Athletes"
                </h3>
                <p className="text-lg text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  Parents who made movement feel like joy.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  The Truth Revealed
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Children aren't born gifted. They become gifted through 
                  <span className="font-bold text-purple-600"> nurture, practice, and belief.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The New Challenge Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <img 
          src="https://readdy.ai/api/search-image?query=Happy%20family%20with%20children%20using%20technology%20responsibly%2C%20parents%20and%20kids%20together%2C%20warm%20home%20environment%2C%20balanced%20screen%20time%2C%20creative%20learning%2C%20modern%20family%20life%2C%20cozy%20living%20room%2C%20natural%20lighting%2C%20children%20exploring%20and%20creating&width=1920&height=1080&seq=family-tech-balance&orientation=landscape" 
          alt="Family balancing technology and creativity" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              The Real Challenge for Our Kids
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold mb-4 text-blue-200">AI is Fast</h3>
                <p className="text-lg text-gray-200">
                  Today, AI can solve problems in seconds.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">❤️</div>
                <h3 className="text-2xl font-bold mb-4 text-pink-200">But Kids Need More</h3>
                <p className="text-lg text-gray-200">
                  Creativity, resilience, and confidence can only grow with practice and love.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">🌱</div>
                <h3 className="text-2xl font-bold mb-4 text-green-200">These Are Human Skills</h3>
                <p className="text-lg text-gray-200">
                  No technology can replace the joy of creating and learning together.
                </p>
              </div>
            </div>
            
            <div className="text-2xl md:text-3xl font-bold text-yellow-200 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              ✨ Your child already has the spark. All they need is their chance to shine.
            </div>
          </div>
        </div>
      </section>

      {/* Why Dreamli Section */}
      <section 
        id="solution" 
        className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Why Dreamli
              </h2>
              <p className="text-2xl text-gray-600">
                Giving every child their kitchen table moment
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Children%20engaging%20with%20creative%20learning%20kits%2C%20colorful%20educational%20materials%2C%20hands-on%20activities%2C%20happy%20kids%20creating%20and%20building%2C%20bright%20playroom%20environment%2C%20innovative%20learning%20tools%2C%20craft%20supplies%2C%20interactive%20educational%20experience%2C%20joyful%20discovery&width=800&height=600&seq=dreamli-kits&orientation=landscape"
                    alt="Dreamli creative kits"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg animate-pulse">
                  <i className="ri-magic-line text-3xl"></i>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-gift-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Creative Kits</h3>
                      <p className="text-gray-600">
                        Our kits don't just teach—they transform 
                        <span className="font-semibold text-red-500">"I can't"</span> into 
                        <span className="font-semibold text-green-500">"Look what I created!"</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-gamepad-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Through Play</h3>
                      <p className="text-gray-600">
                        Through play and practice, we develop the uniquely human skills that will help children thrive.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-3xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-rocket-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-800 mb-2">Tomorrow's World</h3>
                      <p className="text-purple-700 font-medium">
                        Preparing children for a future where human creativity and resilience matter most.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section 
        id="join" 
        className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://readdy.ai/api/search-image?query=Inspiring%20family%20moments%2C%20parents%20and%20children%20learning%20together%2C%20warm%20home%20environment%2C%20educational%20activities%2C%20nurturing%20relationships%2C%20bright%20future%2C%20hope%20and%20potential%2C%20loving%20family%20bonds%2C%20creative%20learning%20experiences%2C%20joyful%20discovery&width=1920&height=1080&seq=join-us&orientation=landscape"
            alt="Families learning together"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">
              Join Us
            </h2>
            
            <div className="space-y-8 mb-12">
              <p className="text-2xl leading-relaxed">
                Every day, parents create kitchen table moments that unlock potential.
              </p>
              
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Will you join us?
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 my-12">
                {[
                  { text: "Your child's potential is", highlight: "infinite", icon: "ri-infinity-line" },
                  { text: "Their future is", highlight: "bright", icon: "ri-sun-line" },
                  { text: "Their moment is", highlight: "waiting", icon: "ri-time-line" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <i className={`${item.icon} text-4xl mb-4 block text-yellow-300`}></i>
                    <p className="text-lg mb-2">{item.text}</p>
                    <p className="text-2xl font-bold text-yellow-300">{item.highlight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUploadForm(true)}
                className="group bg-white text-purple-600 px-12 py-6 rounded-full text-xl font-bold hover:bg-purple-50 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl"
              >
                <span className="flex items-center justify-center">
                  <i className="ri-arrow-right-circle-line text-2xl mr-3 group-hover:translate-x-2 transition-transform duration-300"></i>
                  Join Dreamli today, and let's unlock your child's true potential together
                </span>
              </button>
              
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </div>
  );
}
