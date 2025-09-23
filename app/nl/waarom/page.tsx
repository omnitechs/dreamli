
'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UploadForm from '../../components/UploadForm';

export default function WhyPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [visibleSection, setVisibleSection] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Waarom Dreamli — Veilige, persoonlijke 3D-herinneringen';
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Van kindertekening naar duurzaam, schilderbaar 3D-beeldje. Veilige materialen, zorgvuldige modellering en een aandenken om te koesteren.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
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
    { id: 'hero', label: 'Het Begin' },
    { id: 'verhaal', label: 'Mijn Verhaal' },
    { id: 'patroon', label: 'Het Patroon' },
    { id: 'uitdaging', label: 'Nieuwe Uitdaging' },
    { id: 'oplossing', label: 'Waarom Dreamli' },
    { id: 'doe-mee', label: 'Doe Mee' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* Voortgangsindicator */}
      <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="h-full bg-gradient-to-r from-[#8472DF] to-[#C293F6] transition-all duration-300"
          style={{ width: `${Math.min((visibleSection + 1) * 16.67, 100)}%` }}
        />
      </div>

      {/* Zwevende Navigatie */}
      <div className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
        <div className="bg-white rounded-full shadow-lg p-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`block w-3 h-3 rounded-full mb-2 transition-all duration-300 hover:scale-125 ${
                visibleSection >= index ? 'bg-[#8472DF]' : 'bg-gray-300'
              }`}
              title={section.label}
            />
          ))}
        </div>
      </div>

      {/* Hero Sectie */}
      <section 
        id="hero" 
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://readdy.ai/api/search-image?query=Beautiful%20abstract%20flowing%20lines%20and%20particles%20representing%20creativity%20and%20potential%2C%20soft%20purple%20and%20pink%20gradients%2C%20dreamy%20atmosphere%2C%20inspirational%20background%2C%20digital%20art%2C%20flowing%20energy%2C%20sparkling%20particles%2C%20gentle%20light%20rays%2C%20ethereal%20beauty&width=1920&height=1080&seq=why-hero-bg-nl&orientation=landscape"
            alt="Creatieve potentieel achtergrond"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-6 pt-32 pb-20 flex items-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#8472DF] via-[#C293F6] to-[#93C4FF] bg-clip-text text-transparent leading-tight">
                Waarom Dreamli 
                <span className="block text-5xl md:text-6xl mt-2">Bestaat</span>
              </h1>
              
              <p className="text-2xl md:text-3xl mb-12 leading-relaxed" style={{color: '#333333'}}>
                Een verhaal over de ontdekking dat 
                <span className="font-semibold" style={{color: '#8472DF'}}> talent niet wordt geboren—het wordt gekoesterd</span>
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => scrollToSection('verhaal')}
                  className="group text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#7461D1] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                  style={{backgroundColor: '#8472DF'}}
                >
                  <span className="flex items-center">
                    Ontdek Mijn Verhaal
                    <i className="ri-arrow-down-line ml-2 group-hover:translate-y-1 transition-transform duration-300"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="ri-mouse-line text-3xl" style={{color: '#8472DF'}}></i>
        </div>
      </section>

      {/* Persoonlijk Verhaal Sectie */}
      <section 
        id="verhaal" 
        className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-blue-50"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#8472DF] to-[#C293F6] rounded-full"></div>
                  <div className="pl-8">
                    <h2 className="text-4xl font-bold mb-6" style={{color: '#333333'}}>
                      Het Keukentafel Moment
                    </h2>
                    
                    <div className="space-y-6 text-lg leading-relaxed" style={{color: '#333333'}}>
                      <p className="hover:text-[#8472DF] transition-colors duration-300 cursor-default">
                        Toen ik een kind was, noemden mensen mij <span className="font-semibold" style={{color: '#8472DF'}}>"slim."</span> 
                        Leraren prezen mijn talent.
                      </p>
                      
                      <p className="hover:text-[#8472DF] transition-colors duration-300 cursor-default">
                        Maar elke ochtend gaf mijn vader me <span className="font-semibold text-red-500">twee pagina's vol rekensommen.</span> 
                        Ik worstelde, gumde gaten in het papier, voelde me vast zitten.
                      </p>
                      
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                        <p className="text-green-700 font-medium">
                          Toen gebeurde er iets magisch in de klas. Diezelfde sommen voelden 
                          <span className="font-bold"> makkelijk</span>—niet omdat ik begaafd was, 
                          maar omdat <span className="font-bold">ik had geoefend.</span>
                        </p>
                      </div>
                      
                      <p className="text-xl font-semibold hover:scale-105 transition-transform duration-300 cursor-default" style={{color: '#8472DF'}}>
                        Dat keukentafel moment veranderde alles wat ik geloofde over talent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Warm%20kitchen%20scene%20with%20father%20and%20child%20working%20on%20math%20problems%20together%20at%20wooden%20table%2C%20soft%20morning%20light%2C%20educational%20materials%2C%20nurturing%20family%20moment%2C%20cozy%20home%20atmosphere%2C%20books%20and%20pencils%2C%20caring%20guidance%2C%20emotional%20learning%20experience&width=600&height=800&seq=kitchen-moment-nl&orientation=portrait"
                    alt="Vader helpt kind met rekenen"
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

      {/* Het Patroon Sectie */}
      <section 
        id="patroon" 
        className="py-20 bg-white relative"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6" style={{color: '#333333'}}>
                Het Patroon Dat Ik Niet Kon Negeren
              </h2>
              <p className="text-xl" style={{color: '#666666'}}>Naarmate ik groeide, zag ik het overal:</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Happy%20parent%20and%20child%20drawing%20together%20at%20kitchen%20table%2C%20colorful%20art%20supplies%2C%20watercolor%20paints%2C%20creative%20family%20bonding%20moment%2C%20warm%20lighting%2C%20artistic%20development%20through%20daily%20practice&width=400&height=300&seq=artistic-kids-nl&orientation=landscape"
                    alt="Artistieke Kinderen" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C293F6] to-[#FFB067] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C293F6] to-[#FFB067] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-palette-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#8472DF] transition-colors duration-300" style={{color: '#333333'}}>
                  "Artistieke Kinderen"
                </h3>
                <p className="text-lg group-hover:text-[#333333] transition-colors duration-300" style={{color: '#666666'}}>
                  Hun ouders tekenden dagelijks met hen.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Family%20playing%20music%20together%20in%20living%20room%2C%20piano%20keyboard%2C%20children%20learning%20instruments%2C%20musical%20family%20bonding%2C%20parents%20teaching%20kids%20music%2C%20cozy%20home%20environment%2C%20musical%20development&width=400&height=300&seq=musical-kids-nl&orientation=landscape"
                    alt="Muzikale Wonderkinderen" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8472DF] to-[#93C4FF] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8472DF] to-[#93C4FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-music-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#8472DF] transition-colors duration-300" style={{color: '#333333'}}>
                  "Muzikale Wonderkinderen"
                </h3>
                <p className="text-lg group-hover:text-[#333333] transition-colors duration-300" style={{color: '#666666'}}>
                  Families die samen muziek maakten.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Parent%20and%20child%20playing%20sports%20together%20outdoors%2C%20soccer%20ball%2C%20running%20in%20park%2C%20family%20exercise%20time%2C%20active%20lifestyle%2C%20athletic%20development%20through%20play%2C%20joyful%20movement%2C%20sunny%20day&width=400&height=300&seq=athletic-kids-nl&orientation=landscape"
                    alt="Natuurlijke Atleten" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#93C4FF] to-[#17E7F7] opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#93C4FF] to-[#17E7F7] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-trophy-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#8472DF] transition-colors duration-300" style={{color: '#333333'}}>
                  "Natuurlijke Atleten"
                </h3>
                <p className="text-lg group-hover:text-[#333333] transition-colors duration-300" style={{color: '#666666'}}>
                  Ouders die beweging als vreugde lieten voelen.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-[#F3E8FF] to-[#DBEAFE] p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <p className="text-2xl font-bold mb-4" style={{color: '#333333'}}>
                  De Waarheid Onthuld
                </p>
                <p className="text-xl leading-relaxed" style={{color: '#333333'}}>
                  Kinderen worden niet begaafd geboren. Ze worden begaafd door 
                  <span className="font-bold" style={{color: '#8472DF'}}> liefde, oefening en vertrouwen.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* De Nieuwe Uitdaging Sectie */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <img 
          src="https://readdy.ai/api/search-image?query=Happy%20family%20with%20children%20using%20technology%20responsibly%2C%20parents%20and%20kids%20together%2C%20warm%20home%20environment%2C%20balanced%20screen%20time%2C%20creative%20learning%2C%20modern%20family%20life%2C%20cozy%20living%20room%2C%20natural%20lighting%2C%20children%20exploring%20and%20creating&width=1920&height=1080&seq=family-tech-balance-nl&orientation=landscape" 
          alt="Familie balanceert technologie en creativiteit" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              De Echte Uitdaging Voor Onze Kinderen
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold mb-4 text-blue-200">AI is Snel</h3>
                <p className="text-lg text-gray-200">
                  Vandaag de dag kan AI problemen in seconden oplossen.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">❤️</div>
                <h3 className="text-2xl font-bold mb-4 text-pink-200">Maar Kinderen Hebben Meer Nodig</h3>
                <p className="text-lg text-gray-200">
                  Creativiteit, veerkracht en zelfvertrouwen kunnen alleen groeien met oefening en liefde.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-6">🌱</div>
                <h3 className="text-2xl font-bold mb-4 text-green-200">Dit Zijn Menselijke Vaardigheden</h3>
                <p className="text-lg text-gray-200">
                  Geen technologie kan de vreugde van samen creëren en leren vervangen.
                </p>
              </div>
            </div>
            
            <div className="text-2xl md:text-3xl font-bold text-yellow-200 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              ✨ Jouw kind heeft al de vonk. Het enige wat ze nodig hebben is hun kans om te stralen.
            </div>
          </div>
        </div>
      </section>

      {/* Waarom Dreamli Sectie */}
      <section 
        id="oplossing" 
        className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6" style={{color: '#333333'}}>
                Waarom Dreamli
              </h2>
              <p className="text-2xl" style={{color: '#666666'}}>
                Elk kind zijn keukentafel moment geven
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Children%20engaging%20with%20creative%20learning%20kits%2C%20colorful%20educational%20materials%2C%20hands-on%20activities%2C%20happy%20kids%20creating%20and%20building%2C%20bright%20playroom%20environment%2C%20innovative%20learning%20tools%2C%20craft%20supplies%20interactive%20educational%20experience%2C%20joyful%20discovery&width=800&height=600&seq=dreamli-kits-nl&orientation=landscape"
                    alt="Dreamli creatieve kits"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#8472DF] to-[#C293F6] text-white p-6 rounded-2xl shadow-lg animate-pulse">
                  <i className="ri-magic-line text-3xl"></i>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-gift-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{color: '#333333'}}>Creatieve Kits</h3>
                      <p style={{color: '#666666'}}>
                        Onze kits leren niet alleen—ze transformeren 
                        <span className="font-semibold text-red-500">"Dat kan ik niet"</span> naar 
                        <span className="font-semibold text-green-500">"Kijk wat ik heb gemaakt!"</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#17E7F7] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-gamepad-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{color: '#333333'}}>Door Spel</h3>
                      <p style={{color: '#666666'}}>
                        Door spel en oefening ontwikkelen we de uniek menselijke vaardigheden die kinderen zullen helpen bloeien.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#F3E8FF] to-[#DBEAFE] p-8 rounded-3xl border-2 border-[#8472DF]/20 hover:border-[#8472DF]/30 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-rocket-line text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{color: '#8472DF'}}>De Wereld van Morgen</h3>
                      <p className="font-medium" style={{color: '#8472DF'}}>
                        Kinderen voorbereiden op een toekomst waar menselijke creativiteit en veerkracht het belangrijkst zijn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doe Mee Sectie */}
      <section 
        id="doe-mee" 
        className="py-20 bg-gradient-to-r from-[#8472DF] via-[#C293F6] to-[#93C4FF] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://readdy.ai/api/search-image?query=Inspiring%20family%20moments%2C%20parents%20and%20children%20learning%20together%2C%20warm%20home%20environment%2C%20educational%20activities%2C%20nurturing%20relationships%2C%20bright%20future%22C%20hope%20and%20potential%2C%20loving%20family%20bonds%2C%20creative%20learning%20experiences%2C%20joyful%20discovery&width=1920&height=1080&seq=join-us-nl&orientation=landscape"
            alt="Families leren samen"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">
              Doe Mee
            </h2>
            
            <div className="space-y-8 mb-12">
              <p className="text-2xl leading-relaxed">
                Elke dag creëren ouders keukentafel momenten die potentie ontgrendelen.
              </p>
              
              <p className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Doe jij mee?
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 my-12">
                {[ 
                  { text: "De potentie van jouw kind is", highlight: "oneindig", icon: "ri-infinity-line" }, 
                  { text: "Hun toekomst is", highlight: "stralend", icon: "ri-sun-line" }, 
                  { text: "Hun moment", highlight: "wacht", icon: "ri-time-line" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <i className={`${item.icon} text-4xl mb-4 block text-[#FFB067]`}></i>
                    <p className="text-lg mb-2">{item.text}</p>
                    <p className="text-2xl font-bold text-[#FFB067]">{item.highlight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUploadForm(true)}
                className="group bg-white px-12 py-6 rounded-full text-xl font-bold hover:bg-purple-50 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl whitespace-nowrap cursor-pointer"
                style={{color: '#8472DF'}}
              >
                <span className="flex items-center justify-center">
                  <i className="ri-arrow-right-circle-line text-2xl mr-3 group-hover:translate-x-2 transition-transform duration-300"></i>
                  Word vandaag lid van Dreamli en laten we samen de ware potentie van jouw kind ontgrendelen
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
