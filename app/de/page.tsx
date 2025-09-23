'use client';

import Link from 'next/link';
import HeaderDE from './components/HeaderDE';
import FooterDE from './components/FooterDE';

export default function HomePageDE() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderDE />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F3E8FF]/30 to-[#DBEAFE]/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F3E8FF]/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#DBEAFE]/40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[#ACEEF3]/30 rounded-full animate-float-fast"></div>
        
        <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="font-bold text-[#2E2E2E] leading-tight" style={{ fontSize: '3rem' }}>
                Die Kindheit ist kurz. Die Erinnerungen prägen <span className="text-[#8472DF]">ein Leben lang</span>.
              </h1>
              
              <h2 className="text-xl md:text-2xl font-bold text-[#8472DF] max-w-2xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left">
                Verwandeln Sie die Zeichnungen Ihres Kindes in Erinnerungsstücke, die im täglichen Leben leben—und zu den Kernerinnerungen werden, die für immer bleiben.
              </h2>
              
              <p className="text-lg text-[#2E2E2E]/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Diese frühen Jahre formen die Überzeugungen, das Selbstvertrauen und die Sicht unserer Kinder auf das, was möglich ist. Die meisten kostbaren Momente verblassen, aber einige verdienen es zu bleiben. Dreamli hilft Familien dabei, die Kreativität ihres Kindes in bedeutungsvolle Erinnerungsstücke zu verwandeln, die Teil des täglichen Lebens werden—und Kernerinnerungen schaffen, die prägen, wer sie werden.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="https://panel.dreamli.nl/create-with-ai"
                  className="bg-[#8472DF] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8472DF]/90 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Unsere Arbeit ansehen
                </Link>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/df777b1f8eba0178c450690e4bc88ed9.webp"
                  alt="Familie beim gemeinsamen Schaffen von Erinnerungen"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#8472DF]/10 to-transparent"></div>
              </div>
              
              {/* Floating elements around the image */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFB067] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#ACEEF3] rounded-full animate-bounce"></div>
              <div className="absolute top-1/3 -right-8 w-6 h-6 bg-[#93C4FF] rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Art Studio Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#8472DF]/5 via-[#93C4FF]/10 to-[#ACEEF3]/5 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#FFB067]/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#93C4FF]/20 rounded-full animate-float-medium"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Dreamli Art Studio Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB067] to-[#8472DF] text-white px-6 py-3 rounded-full text-lg font-bold mb-6 shadow-lg">
                <i className="ri-sparkling-2-fill text-xl w-6 h-6 flex items-center justify-center"></i>
                <span>Neu!</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-6 leading-tight">
                Erwecken Sie ihre <br />
                <span className="text-[#8472DF]">Fantasie sofort zum Leben</span>
              </h2>
              <p className="text-xl text-[#2E2E2E]/80 max-w-3xl mx-auto leading-relaxed">
                Probieren Sie das Dreamli AI Art Studio—angetrieben von Magie (und ein wenig KI)!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              {/* Left side - Features */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-upload-cloud-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Hochladen & Verwandeln</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Laden Sie die Zeichnung Ihres Kindes oder ein liebstes Familienfoto direkt in unser interaktives Art Studio hoch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-eye-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Live-Vorschau Magie</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Sehen Sie eine Live-Vorschau davon, wie sich ihre Kreativität verwandelt, direkt vor Ihren Augen!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-palette-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Einfache Anpassung</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Nehmen Sie Anpassungen vor oder fügen Sie einen Farbtupfer hinzu—keine Designkenntnisse erforderlich.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-printer-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">Bestellen oder Speichern</h3>
                      <p className="text-[#2E2E2E]/70 leading-relaxed">
                        Erhalten Sie das Ergebnis zu Hause oder speichern Sie es für später.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Perfect for section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#F3E8FF]">
                  <h3 className="text-2xl font-bold text-[#2E2E2E] mb-6 text-center">Perfekt für:</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-home-heart-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Stolze Ausstellung physisch und digital</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-gift-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Last-Minute-Geschenke für die Familie</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#FFB067] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <i className="ri-heart-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-[#2E2E2E]">Schnelle, magische Erinnerungsstücke—jederzeit, überall</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link 
                    href="https://panel.dreamli.nl/create-with-ai"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-magic-line text-xl w-6 h-6 flex items-center justify-center"></i>
                    Im Art Studio loslegen
                  </Link>
                  <p className="text-sm text-[#2E2E2E]/60 mt-4 flex items-center justify-center gap-2">
                    <i className="ri-rocket-line text-[#8472DF] w-4 h-4 flex items-center justify-center"></i>
                    Sofort zugänglich. Sehen Sie die Magie in Sekunden!
                  </p>
                </div>
              </div>

              {/* Right side - Interactive preview mockup */}
              <div className="relative">
                <div className="relative w-full h-[600px] bg-gradient-to-br from-white to-[#F3E8FF]/20 rounded-3xl overflow-hidden shadow-2xl border border-[#F3E8FF]">
                  {/* Mock interface */}
                  <div className="absolute inset-0 p-8">
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-bold text-[#2E2E2E]">Dreamli Art Studio</div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-[#FFB067] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#93C4FF] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#8472DF] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Upload area mockup */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-[#8472DF]/30 mb-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#8472DF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-upload-cloud-line text-[#8472DF] text-2xl w-8 h-8 flex items-center justify-center"></i>
                        </div>
                        <p className="text-[#2E2E2E]/70 text-sm">Zeichnung Ihres Kindes hier ablegen</p>
                      </div>
                    </div>
                    
                    {/* Preview area */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 h-80 flex items-center justify-center">
                      <img 
                        src="https://readdy.ai/api/search-image?query=Childs%20colorful%20drawing%20of%20a%20happy%20robot%20character%20with%20simple%20geometric%20shapes%2C%20bright%20colors%20including%20blue%2C%20red%2C%20and%20yellow%2C%20drawn%20with%20crayons%20on%20white%20paper%2C%20cheerful%20and%20innocent%20style%2C%20simple%20background&width=300&height=200&seq=art-studio-preview-1&orientation=landscape"
                        alt="Vorschau der Kinderzzeichnung Verwandlung"
                        className="max-w-full max-h-full rounded-xl shadow-lg object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Floating magic sparkles */}
                  <div className="absolute top-20 right-20 w-4 h-4 bg-[#FFB067] rounded-full animate-ping"></div>
                  <div className="absolute bottom-32 left-16 w-3 h-3 bg-[#93C4FF] rounded-full animate-pulse"></div>
                  <div className="absolute top-40 left-24 w-2 h-2 bg-[#8472DF] rounded-full animate-bounce"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-[#FFB067] to-[#8472DF] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-[#93C4FF] to-[#ACEEF3] rounded-full opacity-30 animate-bounce"></div>
              </div>
            </div>

            {/* Coming Soon Products Section */}
            <div className="bg-gradient-to-br from-[#F3E8FF]/60 to-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#8472DF]/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <i className="ri-time-line text-sm w-4 h-4 flex items-center justify-center"></i>
                  <span>Demnächst</span>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">Weitere Möglichkeiten, Zeichnungen mit dem AI Studio zum Leben zu erwecken</h3>
                <p className="text-sm text-[#2E2E2E]/70 mb-6">Wir fügen aufregende neue Produktoptionen hinzu, um die Kreativität Ihres Kindes zu verwandeln</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-image-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Lithophane</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-key-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Schlüsselanhänger</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <i className="ri-fridge-line text-[#8472DF] text-lg w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <p className="text-xs font-medium text-[#2E2E2E]">Kühlschrankmagnete</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-[#2E2E2E]/60 mb-4">Für jetzt können Sie sie aus unserer aktuellen Kollektion mit menschlichen Designs bestellen:</p>
                <Link 
                  href="/de/gifts"
                  className="inline-flex items-center gap-2 bg-white text-[#8472DF] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#8472DF] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-[#8472DF]/20 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-gift-2-line text-sm w-4 h-4 flex items-center justify-center"></i>
                  Geschenkpakete ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-[#DBEAFE]/30 to-[#F3E8FF]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#93C4FF]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#ACEEF3]/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2E2E2E] mb-4">
                Das Problem, das wir lösen
              </h2>
              <p className="text-lg text-[#2E2E2E]/70 max-w-2xl mx-auto">
                Jeder Elternteil steht vor diesen Herausforderungen, die kostbare Erinnerungen verblassen lassen
              </p>
            </div>

            {/* Problem Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#FFB067]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-file-paper-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Vergessene Zeichnungen
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Die meisten Zeichnungen landen zerknittert in Schubladen, für immer verloren, obwohl sie wertvolle Ausdrücke der Kreativität sind
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#93C4FF]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-gamepad-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Kaputtes Spielzeug
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Lieblingsspielzeug geht kaputt oder wird vergessen, wenn Kinder wachsen, und hinterlässt nur verblassende Erinnerungen
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#8472DF]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="ri-smartphone-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 text-center">
                  Versteckte Fotos
                </h3>
                <p className="text-[#2E2E2E]/70 text-center leading-relaxed">
                  Tausende von Fotos bleiben in Handys vergraben, werden nie gedruckt oder richtig mit der Familie geschätzt
                </p>
              </div>
            </div>

            {/* Central Message */}
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-[#F3E8FF] max-w-3xl mx-auto">
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFB067] via-[#93C4FF] to-[#8472DF] mx-auto rounded-full mb-6"></div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E2E2E] mb-4">
                  Das sind die Jahre, die prägen, wer unsere Kinder werden
                </h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Lassen Sie diese kostbaren Momente nicht verschwinden. Verwandeln Sie sie in bleibende Erinnerungen, die mit Ihrer Familie wachsen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2E2E2E] via-[#2E2E2E]/95 to-[#2E2E2E] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Warum ich Dreamli gegründet habe
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#8472DF] to-[#ACEEF3] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Story content */}
              <div className="space-y-8">
                <div className="text-lg lg:text-xl text-white/90 leading-relaxed space-y-6">
                  <p>
                    Als Kind gab mir mein Vater etwas Seltenes und Lebensveränderndes: seine vollständige Aufmerksamkeit. Er hörte meinen Ideen zu, behandelte meine Fantasie als wichtig und sorgte dafür, dass ich mich wirklich gesehen fühlte.
                  </p>
                  <p>
                    Diese Momente ließen mich nicht nur geschätzt fühlen—sie machten mich mutig. Zu wissen, dass meine Stimme wichtig war, gab mir den Mut, größer zu träumen und Herausforderungen anzugehen, die unmöglich schienen.
                  </p>
                  <p>
                    Das ist das Herz von Dreamli. Wenn Kinder sehen, wie ihre Zeichnungen in etwas Reales und Bedeutungsvolles verwandelt werden, bekommen sie nicht nur ein Erinnerungsstück—sie entdecken, dass ihre Fantasie Macht hat.
                  </p>
                  <p>
                    Und mit diesem Glauben wagen sie es, die Welt zu erobern.
                  </p>
                </div>
                
                {/* Quote highlight */}
                <div className="relative">
                  <div className="absolute -left-4 top-0 text-6xl text-[#8472DF]/30 font-serif">"</div>
                  <blockquote className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 ml-8">
                    <p className="text-xl lg:text-2xl text-white font-medium leading-relaxed mb-6 italic">
                      Du bist wichtig. Was du dir vorstellst, ist wichtig. Los—wage es, laut zu träumen.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#ACEEF3] rounded-full flex items-center justify-center">
                        <i className="ri-heart-fill text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <Link href="https://omnitechs.nl/about-founder" className="text-white font-bold hover:text-[#93C4FF] transition-colors cursor-pointer">Seyed Sina Sadegh Esfahani</Link>
                        <div className="text-[#93C4FF] text-sm">Gründer</div>
                      </div>
                    </div>
                  </blockquote>
                </div>
              </div>
              
              {/* Right side - Founder image */}
              <div className="relative">
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5e765cce47897598b55c06921b5227a3.webp"
                    alt="Seyed Sina Sadegh Esfahani, Gründer von Dreamli"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8472DF]/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#8472DF] to-[#ACEEF3] rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-[#93C4FF] to-[#8472DF] rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute top-1/4 -left-4 w-6 h-6 bg-gradient-to-br from-[#ACEEF3] to-[#8472DF] rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Core Memories Stick Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-[#DBEAFE]/20 via-[#F3E8FF]/20 to-[#ACEEF3]/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#2E2E2E] mb-6">
              Wie Kernerinnerungen haften bleiben
            </h2>
            <div className="w-24 h-1 bg-[#8472DF] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-[#2E2E2E]/70 max-w-3xl mx-auto leading-relaxed font-normal">
              Starke Erinnerungen entstehen, wenn sie persönlich, geteilt, wiederholt sind—und wenn es Hinweise gibt, die die Geschichte wieder zum Leben erwecken.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-user-heart-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Persönlich</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Es beginnt mit ihrer eigenen Zeichnung, nicht mit einer Vorlage oder der Idee von jemand anderem.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-group-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Geteilt</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Die Familie wird Teil der Geschichte—sie sehen es, sprechen darüber, teilen es mit anderen.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-refresh-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Wiederholt</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Es lebt im täglichen Leben, wo sie es jeden Tag sehen, nicht versteckt in einer Kiste.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lightbulb-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Hinweise</h3>
                <p className="text-[#2E2E2E]/70 leading-relaxed">
                  Physische Erinnerungsstücke und eine digitale Erinnerungsseite lösen die Geschichte jahrelang aus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#2E2E2E] mb-6">
                Von der Zeichnung zum Traum in 3 einfachen Schritten
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
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Hochladen</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Senden Sie uns ein Foto der Zeichnung Ihres Kindes. Jede Zeichnung, jedes Alter—wir machen es möglich.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DBEAFE] hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-eye-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-2xl font-bold text-[#8472DF]">02</div>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Vorschau & Bestätigen</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Sehen Sie genau, was wir erstellen werden, bevor wir anfangen. Sie haben die vollständige Kontrolle über das Endergebnis.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DBEAFE] hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-gift-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-2xl font-bold text-[#8472DF]">03</div>
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Erhalten & Teilen</h3>
                <p className="text-lg text-[#2E2E2E]/70 leading-relaxed">
                  Erhalten Sie Ihr Erinnerungspaket in 5-10 Tagen, plus eine private Erinnerungsseite, um die Geschichte am Leben zu halten.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-[#2E2E2E]/70 italic">
                Einfacher Prozess. Bedeutungsvolle Ergebnisse. Mit Sorgfalt in den Niederlanden hergestellt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Facts Section */}
      <section className="py-16 bg-gradient-to-r from-[#2E2E2E] via-[#2E2E2E]/95 to-[#2E2E2E]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8472DF] to-[#8472DF]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-map-pin-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Hergestellt in den Niederlanden</div>
                <div className="text-sm text-white/60">Lokal gefertigt mit erfahrenen Händen und sicheren Materialien</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#ACEEF3]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-shield-check-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Kindersichere Materialien</div>
                <div className="text-sm text-white/60">Ungiftiges PLA+, das für Kleine entwickelt wurde</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#93C4FF]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-truck-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Kostenloser Versand</div>
                <div className="text-sm text-white/60">Keine versteckten Kosten überall in Europa</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#93C4FF] to-[#8472DF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-lock-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Private Erinnerungsseite</div>
                <div className="text-sm text-white/60">Sie kontrollieren, was geteilt und mit wem geteilt wird</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ACEEF3] to-[#93C4FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-time-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Schnelle Lieferung</div>
                <div className="text-sm text-white/60">5-10 Werktage von der Bestellung bis vor die Haustür</div>
              </div>

              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFB067] to-[#FFB067]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <i className="ri-share-line text-3xl text-white w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-white font-semibold mb-2">Teilen & Credits verdienen</div>
                <div className="text-sm text-white/60">Verwandeln Sie die Geschichte Ihres Kindes in Inspiration. Teilen Sie eine Erinnerung, erhalten Sie Credits und nutzen Sie sie für KI-Kreationen oder Spielzeug.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/40 to-[#DBEAFE]/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              Häufig gestellte Fragen
            </h2>
            <p className="text-lg text-[#2E2E2E]/70">
              Alles, was Sie wissen müssen, um die Träume Ihres Kindes zum Leben zu erwecken
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Wie funktioniert der Prozess und wie lange dauert es?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed">Es ist super einfach! Laden Sie einfach die Zeichnung Ihres Kindes hoch, wir zeigen Ihnen eine Vorschau davon, wie sie als 3D-Figur aussehen wird, Sie bestätigen die Bestellung, und wir erstellen alles von Hand in den Niederlanden. Der gesamte Prozess dauert 5-10 Werktage für die Lieferung innerhalb der Niederlande. Sie erhalten unterwegs Updates, damit Sie genau wissen, wann Sie Ihr Erinnerungspaket erwarten können.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Ist es sicher für Kinder und welche Materialien verwenden Sie?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                Absolut! Alle unsere Produkte werden auf Bestellung in den Niederlanden mit sicheren, kinderfreundlichen Materialien hergestellt. Wir verwenden hauptsächlich PLA+ Material für den 3D-Druck, das ungiftig und sicher für Kinder ist. Wir planen auch, eine CE-Zertifizierung zu erhalten, sobald wir mit dem Verkauf beginnen. Die Sicherheit Ihres Kindes ist unsere oberste Priorität, und wir befolgen alle niederländischen Sicherheitsstandards für Kinderprodukte.
              </p>
              <a 
                href="https://blog.dreamli.nl/safe-3d-printing-materials-for-childrens-products-a-complete-parents-guide/" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium text-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mehr lesen 
                <i className="ri-external-link-line w-4 h-4 flex items-center justify-center"></i>
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Was ist, wenn ich mit meiner Bestellung nicht zufrieden bin?</h3>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                Ihre Zufriedenheit ist unsere oberste Priorität! Wenn Sie aus irgendeinem Grund nicht vollständig zufrieden mit Ihren Dreamli Produkten sind, bieten wir eine Rückerstattungsrichtlinie ohne Fragen. Kontaktieren Sie uns einfach und wir werden Ihre Rückerstattung ohne Komplikationen oder komplizierte Verfahren bearbeiten.
              </p>
              <p className="text-[#2E2E2E]/70 leading-relaxed mb-4">
                Wir stehen hinter der Qualität unserer Arbeit und möchten, dass jede Familie ihr personalisiertes Erinnerungspaket liebt. Da jedes Produkt speziell für die Zeichnung Ihres Kindes hergestellt wird, legen wir besondere Sorgfalt in den Vorschau-Prozess, damit Sie genau sehen können, wie alles aussehen wird, bevor wir es erstellen. Aber wenn etwas Ihren Erwartungen nicht entspricht, lassen Sie es uns einfach wissen und wir werden es richtig machen.
              </p>
              <p className="text-[#2E2E2E]/70 leading-relaxed">
                Ihr Seelenfrieden ist uns wichtig - deshalb halten wir unsere Rückerstattungsrichtlinie einfach und kundenfreundlich.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DBEAFE]">
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Was genau bekomme ich in jedem Paket und wie hoch sind die Preise?</h3>
              <div className="text-[#2E2E2E]/70 leading-relaxed space-y-3">
                <p><strong>Standard (€89):</strong> Eine vollfarbige 3D-Figur der Zeichnung Ihres Kindes</p>
                <p><strong>Steam Paket (€137):</strong> Zwei Figuren (eine zum Üben, eine zum Bemalen), Malset damit Ihr Kind seine Kreation bemalen kann, Tap-to-View Schlüsselanhänger und Zugang zu unserer "Teilen & Verdienen" Plattform, wo Kinder Belohnungen verdienen können</p>
                <p><strong>Geschenkpaket (€137):</strong> Alles aus Standard PLUS ein Lithophan-Nachtlicht, bemalbare Kühlschrankmagnete, 5 Tap-to-View Schlüsselanhänger und eine private Erinnerungsseite online</p>
                <p><strong>Premium (€238):</strong> Alles aus Geschenkpaket PLUS alles aus dem Steam Paket (zusätzliche Figur zum Bemalen mit Malset), Ihre Wahl eines beliebigen Shop-Artikels oder Geschenkgutscheins (mit kostenloser zweiter Sendung), eine Zeitkapsel und Zugang zu unserem "Teilen & Verdienen" Empfehlungsprogramm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#F3E8FF]/30 via-[#DBEAFE]/20 to-[#ACEEF3]/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-6 leading-tight">
            Geben Sie Ihrem Kind das Geschenk des Mutes
          </h2>
          <p className="text-xl text-[#2E2E2E]/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Jedes Kind verdient es zu fühlen, dass seine Fantasie wichtig ist. Beginnen Sie heute seine Reise vom Träumer zum Gläubigen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/de/steam"
              className="bg-gradient-to-r from-[#8472DF] to-[#93C4FF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#8472DF]/90 hover:to-[#93C4FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
            >
              Steam Paket
            </Link>
            <Link 
              href="/de/gifts"
              className="border-2 border-[#8472DF] text-[#8472DF] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8472DF] hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              Geschenkpaket
            </Link>
          </div>
        </div>
      </section>

      <FooterDE />
    </div>
  );
}