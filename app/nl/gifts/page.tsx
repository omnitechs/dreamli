'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import FooterNL from '../../components/FooterNL';
import ScatteredCardGallery from '../../../components/ScatteredCardGallery';
import HowItWorksGiftsNL from './HowItWorksGiftsNL';
import PackageOptionsNL from './PackageOptionsNL';
import UploadForm from '../../components/UploadForm';

export default function GiftsPageNL() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormType, setUploadFormType] = useState('gifts');
  const [uploadFormPricingField, setUploadFormPricingField] = useState('giftPackPrice');

  const openUploadForm = (type = 'gifts', pricingField = 'giftPackPrice') => {
    setUploadFormType(type);
    setUploadFormPricingField(pricingField);
    setShowUploadForm(true);
  };

  const closeUploadForm = () => {
    setShowUploadForm(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-32 pb-20 overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-4 animate-fade-in-up">
                <span className="text-sm font-semibold text-purple-700 flex items-center">
                  <i className="ri-star-line mr-2"></i>
                  Premium Cadeau Herinneringen
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#333333] leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Creëer een kernherinnering die je kind 
                <span className="text-[#8472DF] block">een leven lang bijblijft</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-normal max-w-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Transformeer je kind's tekening in betekenisvolle herinneringen die onderdeel worden van het dagelijks leven - een beeldje om te schilderen, een nachtlampje dat gloeit, sleutelhangers om te delen, en een magneet voor de koelkast.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <button onClick={() => openUploadForm('gifts', 'giftPackPrice')} className="bg-gradient-to-r from-[#8472DF] to-[#FF6B9D] text-white px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer transform text-center w-full sm:w-auto whitespace-nowrap relative overflow-hidden group">
                  <span className="relative z-10">Begin Nu →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7A66D9] to-[#E55A8A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="bg-white/80 backdrop-blur-sm text-[#8472DF] border-2 border-[#8472DF] px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#8472DF] hover:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer transform text-center w-full sm:w-auto whitespace-nowrap">Hoe het Werkt</button>
              </div>

              {/* Risk-free promise box */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-transparent bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-2xl p-6 shadow-lg max-w-xl animate-fade-in-up" style={{backgroundClip: 'padding-box', border: '2px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #93C4FF, #ACEEF3)', backgroundOrigin: 'border-box', animationDelay: '0.8s'}}>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-fill text-white text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#333333] text-lg mb-2">100% Risicovrije Belofte</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Deel een foto van je kind met hun 3D creatie en we betalen je volledige bestelling terug. Geen vragen gesteld. Omdat we weten dat ze het geweldig zullen vinden!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Scattered Card Gallery */}
            <div className="relative h-[500px] sm:h-[600px] lg:h-[600px] flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <ScatteredCardGallery 
                className="w-full h-full max-w-lg mx-auto"
              />

              {/* Enhanced decorative elements */}
              <div className="hidden sm:block absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-br from-[#FFA726] to-[#FF8A65] rounded-full animate-bounce opacity-60 shadow-lg" style={{ animationDelay: '0s' }}></div>
              <div className="hidden sm:block absolute bottom-1/3 left-1/6 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce opacity-60 shadow-lg" style={{ animationDelay: '1s' }}></div>
              <div className="hidden sm:block absolute top-1/3 right-1/4 w-7 h-7 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-bounce opacity-60 shadow-lg" style={{ animationDelay: '2s' }}></div>
              <div className="hidden sm:block absolute top-1/2 right-1/6 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce opacity-60 shadow-lg" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Becomes a Core Memory Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
              <span className="text-sm font-semibold text-purple-700">
                De Wetenschap Erachter
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Waarom Dit een Kernherinnering Wordt
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Als we terugkijken op de kindertijd, springen een paar momenten er altijd uit - die momenten die anders voelden, speciaal, gemaakt met liefde. Dreamli is ontworpen om dit soort herinnering voor je kind te creëren.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-heart-3-line text-2xl text-purple-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het is persoonlijk</h4>
                <p className="text-gray-600 leading-relaxed">
                  De herinnering komt uit hun eigen tekening, niet iets dat van de plank gekocht is. Kinderen voelen zich trots wanneer ze hun verbeelding werkelijkheid zien worden.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-team-line text-2xl text-blue-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het wordt gedeeld</h4>
                <p className="text-gray-600 leading-relaxed">
                  Grootouders, ouders en vrienden kunnen allemaal meedoen - samen het beeldje schilderen, sleutelhangers geven, de lithofaan aanzetten. Gedeelde ervaringen zijn wat kinderen het meest onthouden.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-home-smile-line text-2xl text-green-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het is aanwezig in het dagelijks leven</h4>
                <p className="text-gray-600 leading-relaxed">
                  Het beeldje op de plank, het nachtlampje naast het bed, de magneet op de koelkast - herinneringen die het kind elke dag omringen. Herhaling verankert de herinnering.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-book-open-line text-2xl text-orange-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het heeft een verhaal</h4>
                <p className="text-gray-600 leading-relaxed">
                  De tekening, de transformatie, het schilderen - dit wordt een familieverhaal dat wordt verteld op verjaardagen en bij bijeenkomsten. Verhalen zijn hoe herinneringen blijven bestaan.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-cloud-line text-2xl text-pink-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het blijft ook digitaal bestaan</h4>
                <p className="text-gray-600 leading-relaxed">
                  Met de privé Herinneringspagina blijven de tekening en herinnering ook online bestaan. De herinnering kan zelfs jaren later opnieuw bekeken en gedeeld worden.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <i className="ri-magic-line text-2xl text-indigo-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Het voelt magisch</h4>
                <p className="text-gray-600 leading-relaxed">
                  Hun 2D tekening zien veranderen in een 3D object dat ze kunnen vasthouden en schilderen creëert verwondering. Dat magische moment wordt onvergetelijk.
                </p>
              </div>
            </div>

            {/* Call to Action within Core Memory Section */}
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Klaar om Hun Kernherinnering te Creëren?
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Transformeer hun tekening in herinneringen die tientallen jaren gekoesterd zullen worden
              </p>
              <button onClick={() => openUploadForm('gifts', 'giftPackPrice')} className="bg-gradient-to-r from-[#8472DF] to-[#FF6B9D] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap">
                Begin Nu met Creëren →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksGiftsNL />

      {/* Package Options Section */}
      <PackageOptionsNL onOpenUploadForm={openUploadForm} />

      <FooterNL />

      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm 
          onClose={closeUploadForm}
          type={uploadFormType}
          pricingField={uploadFormPricingField}
        />
      )}
    </div>
  );
}