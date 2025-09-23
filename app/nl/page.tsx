'use client';

import Link from 'next/link';
import Header from '../components/Header';
import FooterNL from '../components/FooterNL';

export default function HomepageNL() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Sectie */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Achtergrond gradiënt */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F3E8FF]/30 to-[#DBEAFE]/20"></div>
        
        {/* Decoratieve elementen */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F3E8FF]/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#DBEAFE]/40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[#ACEEF3]/30 rounded-full animate-float-fast"></div>
        
        <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Linker Inhoud */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="font-bold text-[#2E2E2E] leading-tight" style={{ fontSize: '3rem' }}>
                De kindertijd is kort. De herinneringen vormgeven <span className="text-[#8472DF]">een leven lang</span>.
              </h1>
              
              <h2 className="text-xl md:text-2xl font-bold text-[#8472DF] max-w-2xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                Transformeer de tekening van je kind in aandenken die deel uitmaken van het dagelijks leven—en worden de kernherinneringen die voor altijd blijven.
              </h2>
              
              <p className="text-lg text-[#2E2E2E]/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Deze vroege jaren vormen het geloof, zelfvertrouwen en de kijk op wat mogelijk is van onze kinderen. De meeste kostbare momenten vervagen, maar sommige verdienen om te blijven. Dreamli helpt gezinnen de creativiteit van hun kind om te zetten in betekenisvolle aandenken die onderdeel worden van het dagelijks leven—waarmee kernherinneringen ontstaan die bepalen wie ze worden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/nl/shop" className="bg-[#8472DF] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8472DF]/90 transition-colors whitespace-nowrap cursor-pointer">
                  Bekijk Ons Werk
                </Link>
              </div>
            </div>
            
            {/* Rechter Afbeelding */}
            <div className="relative">
              <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/df777b1f8eba0178c450690e4bc88ed9.webp"
                  alt="Familie die samen herinneringen creëert"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#8472DF]/10 to-transparent"></div>
              </div>
              
              {/* Zwevende elementen rond de afbeelding */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFB067] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#ACEEF3] rounded-full animate-bounce"></div>
              <div className="absolute top-1/3 -right-8 w-6 h-6 bg-[#93C4FF] rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Art Studio Sectie */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#8472DF]/5 via-[#93C4FF]/10 to-[#ACEEF3]/5 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFB067]/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#93C4FF]/20 rounded-full animate-float-medium"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Dreamli Art Studio Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB067] to-[#8472DF] text-white px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-lg">
                <i className="ri-sparkling-2-fill text-xl w-6 h-6 flex items-center justify-center"></i>
                <span>Nieuw!</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Breng Hun <br />
                <span className="text-[#8472DF]">Verbeelding Direct Tot Leven</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto leading-relaxed">
                Probeer de Dreamli AI Art Studio—aangedreven door Magie (en een beetje AI)!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              {/* Linkerkant - Functies */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-upload-cloud-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Upload & Transformeer</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Upload de tekening van je kind of een favoriete familiefoto direct naar onze interactieve Art Studio.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-eye-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Live Voorbeeld Magie</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Zie een live voorbeeld van hoe hun creativiteit transformeert, voor je eigen ogen!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-palette-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Eenvoudige Aanpassing</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Maak aanpassingen of voeg een vleugje kleur toe—geen ontwerpvaardigheden nodig.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-printer-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Bestel of Bewaar</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Krijg het resultaat thuis of bewaar het voor later.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Perfect voor sectie */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#F3E8FF]">
                  <h3 className="text-2xl font-bold text-[#2E2E2E] mb-6 text-center">Perfect voor:</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-home-heart-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Trots tonen fysiek en digitaal</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-gift-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Last-minute cadeaus voor familie</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-heart-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Snelle, magische aandenken—altijd, overal</p>
                    </div>
                  </div>
                </div>

                {/* CTA Knop */}
                <div className="text-center">
                  <Link 
                    href="https://panel.dreamli.nl/create-with-ai"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-magic-line text-xl w-6 h-6 flex items-center justify-center"></i>
                    Begin in de Art Studio
                  </Link>
                  <p className="text-sm text-[#2E2E2E]/60 mt-4 flex items-center justify-center gap-2">
                    <i className="ri-rocket-line text-[#8472DF] w-4 h-4 flex items-center justify-center"></i>
                    Direct toegankelijk. Zie de magie in seconden!
                  </p>
                </div>
              </div>

              {/* Rechterkant - Interactieve voorbeeldmockup */}
              <div className="relative">
                <div className="relative w-full h-[600px] bg-gradient-to-br from-white to-[#F3E8FF]/20 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8FF]">
                  {/* Mock interface */}
                  <div className="absolute inset-0 p-8">
                    {/* Header balk */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-bold text-[#2E2E2E]">Dreamli Art Studio</div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-[#FFB067] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#93C4FF] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#8472DF] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Upload gebied mockup */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-[#8472DF]/30 mb-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#8472DF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-upload-cloud-line text-[#8472DF] text-2xl w-8 h-8 flex items-center justify-center"></i>
                        </div>
                        <p className="text-[#2E2E2E]/70 text-sm">Sleep de tekening van je kind hier</p>
                      </div>
                    </div>
                    
                    {/* Voorbeeld gebied */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 h-80 flex items-center justify-center">
                      <img 
                        src="https://readdy.ai/api/search-image?query=Childs%20colorful%20drawing%20of%20a%20happy%20robot%20character%20with%20simple%20geometric%20shapes%2C%20bright%20colors%20including%20blue%2C%20red%2C%20and%20yellow%2C%20drawn%20with%20crayons%20on%20white%20paper%2C%20cheerful%20and%20innocent%20style%2C%20simple%20background&width=300&height=200&seq=art-studio-preview-1&orientation=landscape"
                        alt="Voorbeeld van kindertekening transformatie"
                        className="max-w-full max-h-full rounded-xl shadow-lg object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Zwevende magische sterretjes */}
                  <div className="absolute top-20 right-20 w-4 h-4 bg-[#FFB067] rounded-full animate-ping"></div>
                  <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#93C4FF] rounded-full animate-pulse"></div>
                  <div className="absolute top-40 left-24 w-2 h-2 bg-[#8472DF] rounded-full animate-bounce"></div>
                </div>
                
                {/* Decoratieve elementen */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-full opacity-30 animate-bounce"></div>
              </div>
            </div>

            {/* Binnenkort Producten Sectie */}
            <div className="bg-gradient-to-br from-[#F3E8FF]/60 to-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#8472DF]/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <i className="ri-time-line text-sm w-4 h-4 flex items-center justify-center"></i>
                  <span>Binnenkort</span>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">Meer Manieren om Tekeningen Tot Leven te Brengen Met AI Studio</h3>
                <p className="text-sm text-[#2E2E2E]/70 mb-6">We voegen spannende nieuwe productopties toe om de creativiteit van je kind te transformeren</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-image-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Lithofanen</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-key-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Sleutelhangers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-fridge-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Koelkastmagneten</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-[#2E2E2E]/60 mb-4">Voor nu kun je ze bestellen uit onze huidige collectie met menselijke ontwerpen:</p>
                <Link 
                  href="/nl/shop"
                  className="inline-flex items-center gap-2 bg-white text-[#8472DF] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#8472DF] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-[#8472DF]/20 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-gift-2-line text-sm w-4 h-4 flex items-center justify-center"></i>
                  Bekijk Cadeau Pakketten
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Probleem Sectie */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#DBEAFE]/30 to-[#F3E8FF]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#93C4FF]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#ACEEF3]/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2E2E2E] mb-4">
                Het Probleem Dat We Oplossen
              </h2>
              <p className="text-lg text-[#2E2E2E]/70 max-w-2xl mx-auto">
                Elke ouder komt deze uitdagingen tegen die kostbare herinneringen doen vervagen
              </p>
            </div>

            {/* Probleem Kaarten */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#FFB067]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-file-paper-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Vergeten Tekeningen
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  De meeste tekeningen belanden verfrommeld in laden, voor altijd verloren ondanks dat ze kostbare uitingen van creativiteit zijn
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#93C4FF]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-gamepad-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Kapot Speelgoed
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Favoriete speelgoed gaat kapot of wordt vergeten naarmate kinderen opgroeien, alleen vervagend herinneringen achterlatend
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#8472DF]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-smartphone-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Verborgen Foto's
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Duizenden foto's blijven begraven in telefoons, nooit afgedrukt of goed gekoesterd met de familie
                </p>
              </div>
            </div>

            {/* Centrale Boodschap */}
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-[#F3E8FF] max-w-3xl mx-auto">
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFB067] via-[#93C4FF] to-[#8472DF] mx-auto rounded-full mb-6"></div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-4">
                  Dit zijn de jaren die bepalen wie onze kinderen worden
                </h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Laat deze kostbare momenten niet verdwijnen. Transformeer ze in blijvende herinneringen die meegroeien met je gezin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oprichter Verhaal Sectie */}
      <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2E2E2E] via-[#2E2E2E]/95 to-[#2E2E2E] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Sectie Titel */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Waarom Ik Dreamli Begon
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#8472DF] to-[#ACEEF3] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Linkerkant - Verhaal inhoud */}
              <div className="space-y-8">
                <div className="text-lg lg:text-xl text-white/90 leading-relaxed space-y-6">
                  <p>
                    Als kind gaf mijn vader me iets zeldzaams en levensveranderends: zijn volledige aandacht. Hij luisterde naar mijn ideeën, behandelde mijn verbeelding als belangrijk, en zorgde ervoor dat ik me echt gezien voelde.
                  </p>
                  <p>
                    Die momenten lieten me niet alleen gewaardeerd voelen—ze maakten me moedig. Weten dat mijn stem ertoe deed gaf me de moed om groter te dromen en uitdagingen aan te gaan die onmogelijk leken.
                  </p>
                  <p>
                    Dat is de kern van Dreamli. Wanneer kinderen hun tekeningen zien transformeren in iets reëels en betekenisvols, krijgen ze niet alleen een aandenken—ze ontdekken dat hun verbeelding kracht heeft.
                  </p>
                  <p>
                    En met dat geloof durven ze de wereld aan.
                  </p>
                </div>
                
                {/* Citaat highlight */}
                <div className="relative">
                  <div className="absolute -left-4 top-0 text-6xl text-[#8472DF]/30 font-serif">"</div>
                  <blockquote className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 ml-8">
                    <p className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-6 italic">
                      Jij doet ertoe. Wat jij je voorstelt doet ertoe. Ga je gang—durf hardop te dromen.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#ACEEF3] rounded-full flex items-center justify-center">
                        <i className="ri-heart-fill text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <Link href="https://omnitechs.nl/about-founder" className="text-white font-bold hover:text-[#93C4FF] transition-colors cursor-pointer">Seyed Sina Sadegh Esfahani</Link>
                        <div className="text-[#93C4FF] text-sm">Oprichter</div>
                      </div>
                    </div>
                  </blockquote>
                </div>
              </div>
              
              {/* Rechterkant - Oprichter afbeelding */}
              <div className="relative">
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5e765cce47897598b55c06921b5227a3.webp"
                    alt="Seyed Sina Sadegh Esfahani, Oprichter van Dreamli"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8472DF]/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Zwevende decoratieve elementen */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#ACEEF3] rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-[#93C4FF] to-[#8472DF] rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute top-1/4 -left-4 w-6 h-6 bg-gradient-to-br from-[#ACEEF3] to-[#8472DF] rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe Kernherinneringen Blijven Hangen Sectie */}
      <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-[#DBEAFE]/20 via-[#F3E8FF]/20 to-[#ACEEF3]/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2E2E2E] mb-6">
              Hoe Kernherinneringen Blijven Hangen
            </h2>
            <div className="w-24 h-1 bg-[#8472DF] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-[#2E2E2E]/70 max-w-3xl mx-auto leading-relaxed font-normal">
              Sterke herinneringen ontstaan wanneer ze persoonlijk zijn, gedeeld, herhaald—en wanneer er aanwijzingen zijn die het verhaal weer tot leven brengen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-user-heart-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Persoonlijk</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Het begint met hun eigen tekening, niet een sjabloon of het idee van iemand anders.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-group-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Gedeeld</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Familie wordt onderdeel van het verhaal—het zien, erover praten, het delen met anderen.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-refresh-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Herhaald</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Het leeft in het dagelijks leven waar ze het elke dag zien, niet verborgen in een doos.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lightbulb-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Aanwijzingen</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Fysieke aandenken en een digitale Memory Page activeren het verhaal voor de komende jaren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe Het Werkt Sectie */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#2E2E2E] mb-6">
                Van Tekening naar Droom in 3 Eenvoudige Stappen
              </h2>
              <div className="w-24 h-1 bg-[#8472DF] mx-auto mb-6 rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DBEAFE] hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-2xl font-bold text-[#8472DF]">01</div>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Upload</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Stuur ons een foto van de tekening van je kind. Elke tekening, elke leeftijd—wij laten het werken.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DBEAFE] hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-eye-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-2xl font-bold text-[#8472DF]">02</div>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Voorbeeld & Bevestig</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Zie precies wat we gaan maken voordat we beginnen. Je hebt volledige controle over het eindresultaat.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DBEAFE] hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-gift-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-2xl font-bold text-[#8472DF]">03</div>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Ontvang & Deel</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Ontvang je aandenken bundel in 5-10 dagen, plus een privé Memory Page om het verhaal levend te houden.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-[#2E2E2E]/70 italic">
                Eenvoudig proces. Betekenisvolle resultaten. Met zorg gemaakt in Nederland.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stille Feiten Sectie */}
      <section className="py-16 bg-gradient-to-r from-[#2E2E2E] via-[#2E2E2E]/95 to-[#2E2E2E]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-map-pin-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Nederlands Gemaakt</div>
                <div className="text-sm text-white/60">Lokaal gemaakt met ervaren handen en veilige materialen</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-shield-check-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Kindveilige Materialen</div>
                <div className="text-sm text-white/60">Niet-giftige PLA+ die ontworpen is voor kleintjes</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-truck-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Gratis Verzending</div>
                <div className="text-sm text-white/60">Geen verborgen kosten overal in Europa</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#8472DF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lock-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Privé Memory Page</div>
                <div className="text-sm text-white/60">Jij bepaalt wat gedeeld wordt en met wie</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#93C4FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-time-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Snelle Levering</div>
                <div className="text-sm text-white/60">5-10 werkdagen van bestelling tot voor de deur</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-share-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Deel & Verdien Credits</div>
                <div className="text-sm text-white/60">Maak van het verhaal van je kind inspiratie. Deel een herinnering, krijg credits, en gebruik ze voor AI creaties of speelgoed.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sectie */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/40 to-[#DBEAFE]/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              Veelgestelde Vragen
            </h2>
            <p className="text-lg text-[#2E2E2E]/70">
              Alles wat je moet weten over het tot leven brengen van de dromen van je kind
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Hoe werkt het proces en hoe lang duurt het?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed">Het is super eenvoudig! Upload gewoon de tekening van je kind, wij laten je een voorbeeld zien van hoe het eruit zal zien als 3D beeldje, je bevestigt de bestelling, en wij maken alles met de hand in Nederland. Het hele proces duurt 5-10 werkdagen voor levering binnen Nederland. Je krijgt onderweg updates zodat je precies weet wanneer je je aandenken bundel kunt verwachten.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Is het veilig voor kinderen en welke materialen gebruiken jullie?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                Absoluut! Al onze producten worden op bestelling gemaakt in Nederland met veilige, kindvriendelijke materialen. We gebruiken voornamelijk PLA+ materiaal voor 3D printen, wat niet-giftig en veilig is voor kinderen. We zijn ook van plan om CE-certificering te verkrijgen zodra we beginnen met verkopen. De veiligheid van je kind is onze topprioriteit, en we volgen alle Nederlandse veiligheidsnormen voor kinderproducten.
              </p>
              <a 
                href="https://blog.dreamli.nl/safe-3d-printing-materials-for-childrens-products-a-complete-parents-guide/" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lees meer 
                <i className="ri-external-link-line w-4 h-4 flex items-center justify-center"></i>
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Wat als ik niet tevreden ben met mijn bestelling?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                Jouw tevredenheid is onze topprioriteit! Als je om welke reden dan ook niet volledig tevreden bent met je Dreamli producten, bieden we een no-questions-asked terugbetalingsbeleid. Neem gewoon contact met ons op en we verwerken je terugbetaling zonder gedoe of ingewikkelde procedures.
              </p>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                We staan achter de kwaliteit van ons werk en willen dat elke familie hun gepersonaliseerde aandenken bundel geweldig vindt. Omdat elk product op bestelling wordt gemaakt specifiek voor de tekening van je kind, besteden we extra zorg aan het voorbeeldproces zodat je precies kunt zien hoe alles eruit zal zien voordat we het maken. Maar als iets niet aan je verwachtingen voldoet, laat het ons gewoon weten en we maken het goed.
              </p>
              <p className="text-[#2E2E2E]/70 leading-relaxed">
                Jouw gemoedsrust is belangrijk voor ons - daarom houden we ons terugbetalingsbeleid eenvoudig en klantvriendelijk.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Wat krijg ik precies in elk pakket en wat zijn de prijzen?</h3>
              <div className="text-[#2E2E2E]/70 leading-relaxed space-y-3">
                <p><strong>Standaard (€89):</strong> Een full-color 3D beeldje van de tekening van je kind</p>
                <p><strong>Steam Pakket (€137):</strong> Twee beeldjes (een om te oefenen, een om in te kleuren), verfset zodat je kind hun creatie kan inkleuren, tap-to-view sleutelhangers, en toegang tot ons "Deel & Verdien" platform waar kinderen beloningen kunnen verdienen</p>
                <p><strong>Cadeau Pakket (€137):</strong> Alles in Standaard PLUS een lithofaan nachtlampje, beschilderbare koelkastmagneet, 5 tap-to-view sleutelhangers, en een privé Memory Page online</p>
                <p><strong>Premium (€238):</strong> Alles in Cadeau Pakket PLUS alles uit het Steam Pakket (extra beeldje om in te kleuren met verfset), je keuze uit elk winkelitem of cadeaubon (met gratis tweede verzending), een tijdcapsule, en toegang tot ons "Deel & Verdien" doorverwijsprogramma</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Finale CTA Sectie */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/30 via-[#DBEAFE]/20 to-[#ACEEF3]/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
            Geef Je Kind het Cadeau van Durven
          </h2>
          <p className="text-xl text-[#2E2E2E]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Elk kind verdient het om te voelen dat hun verbeelding ertoe doet. Begin vandaag hun reis van dromer naar gelovige.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/nl/shop"
              className="bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
            >
              Steam Pakket
            </Link>
            <Link 
              href="/nl/shop"
              className="border-2 border-[#8472DF] text-[#8472DF] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8472DF] hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Cadeau Pakket
            </Link>
          </div>
        </div>
      </section>

      <FooterNL />
    </div>
  );
}