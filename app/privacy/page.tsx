
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'nl'>('en');

  useEffect(() => {
    if (activeLanguage === 'en') {
      document.title = "Privacy Policy | Dreamli Data Protection & Cookie Policy";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'How Dreamli collects, uses, and protects personal data for families, creators, and partners—your rights and choices explained.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'How Dreamli collects, uses, and protects personal data for families, creators, and partners—your rights and choices explained.';
        document.head.appendChild(meta);
      }
    } else {
      document.title = "Privacybeleid | Dreamli Gegevensbescherming & Cookiebeleid";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Hoe Dreamli persoonlijke gegevens verzamelt, gebruikt en beschermt voor gezinnen, creatievelingen en partners—uw rechten en keuzes uitgelegd.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Hoe Dreamli persoonlijke gegevens verzamelt, gebruikt en beschermt voor gezinnen, creatievelingen en partners—uw rechten en keuzes uitgelegd.';
        document.head.appendChild(meta);
      }
    }
  }, [activeLanguage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="cursor-pointer">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png" 
                alt="Dreamli Logo"
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Language Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveLanguage('en')}
                className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeLanguage === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLanguage('nl')}
                className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeLanguage === 'nl'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nederlands
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* English Version */}
        {activeLanguage === 'en' && (
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <p className="text-xl text-gray-600 mb-12">Last updated: January 2024</p>

            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-8 mb-12 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Dreamli (OmniTechs V.O.F.) respects your privacy and processes personal data in accordance with the General Data Protection Regulation (GDPR) and applicable data protection laws. This privacy policy explains how we collect, use, and protect your personal information.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What Information We Collect</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-user-line text-purple-600 mr-3"></i>
                    Information You Provide
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Personal details (name, email address, phone number)</li>
                    <li>• Shipping and billing addresses</li>
                    <li>• Payment information</li>
                    <li>• Children's drawings and artwork</li>
                    <li>• Communication with customer support</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-computer-line text-purple-600 mr-3"></i>
                    Technical Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• IP address and location data</li>
                    <li>• Browser type and version</li>
                    <li>• Device information</li>
                    <li>• Website usage patterns</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-cookie-line text-purple-600 mr-3"></i>
                    Cookies and Analytics
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Essential cookies for website functionality</li>
                    <li>• Google Analytics data (only with your consent)</li>
                    <li>• Performance and optimization data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Processing</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Create and ship your personalized products</li>
                    <li>• Process payments securely</li>
                    <li>• Provide order updates and tracking</li>
                    <li>• Handle returns and exchanges</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Respond to inquiries and requests</li>
                    <li>• Provide technical assistance</li>
                    <li>• Manage your account</li>
                    <li>• Resolve any issues</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Compliance</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Meet tax and accounting obligations</li>
                    <li>• Comply with legal requirements</li>
                    <li>• Prevent fraud and ensure security</li>
                    <li>• Maintain business records</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing (With Consent)</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Send newsletters and updates</li>
                    <li>• Share product announcements</li>
                    <li>• Provide personalized offers</li>
                    <li>• Improve our services</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Basis for Processing</h2>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="space-y-4 text-gray-700">
                  <p><strong>Contract:</strong> Processing necessary to fulfill your orders and provide our services</p>
                  <p><strong>Legal Obligation:</strong> Compliance with tax laws and other legal requirements</p>
                  <p><strong>Consent:</strong> Analytics, marketing communications, and non-essential cookies</p>
                  <p><strong>Legitimate Interest:</strong> Security measures, fraud prevention, and business operations</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Storage and Retention</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Retention Periods</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Order data:</strong> 7 years (tax law requirements)</li>
                    <li>• <strong>Analytics data:</strong> 14 months maximum</li>
                    <li>• <strong>Account data:</strong> Until you request deletion</li>
                    <li>• <strong>Marketing data:</strong> Until you withdraw consent</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sharing</h2>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-shield-check-line text-xl text-yellow-600 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">We Never Sell Your Data</h3>
                    <p className="text-gray-700">Your personal information is never sold to third parties for marketing purposes.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">We only share data with:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• <strong>Payment processors:</strong> To handle secure transactions</li>
                  <li>• <strong>Shipping companies:</strong> To deliver your orders</li>
                  <li>• <strong>IT and hosting providers:</strong> To maintain our services</li>
                  <li>• <strong>Google Analytics:</strong> Only with your explicit consent</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-eye-line text-purple-600 mr-2"></i>
                      Access
                    </h3>
                    <p className="text-gray-700 text-sm">Request a copy of your personal data</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-edit-line text-purple-600 mr-2"></i>
                      Correction
                    </h3>
                    <p className="text-gray-700 text-sm">Update incorrect or incomplete information</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-delete-bin-line text-purple-600 mr-2"></i>
                      Deletion
                    </h3>
                    <p className="text-gray-700 text-sm">Request removal of your data (where legally possible)</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-close-circle-line text-purple-600 mr-2"></i>
                      Withdraw Consent
                    </h3>
                    <p className="text-gray-700 text-sm">Stop marketing communications or analytics</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-download-line text-purple-600 mr-2"></i>
                      Portability
                    </h3>
                    <p className="text-gray-700 text-sm">Receive your data in a portable format</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-alert-line text-purple-600 mr-2"></i>
                      Complaint
                    </h3>
                    <p className="text-gray-700 text-sm">File a complaint with Autoriteit Persoonsgegevens</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies Policy</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Cookies</h3>
                  <p className="text-gray-700 mb-3">These cookies are necessary for the website to function and cannot be switched off:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Session management and security</li>
                    <li>• Shopping cart functionality</li>
                    <li>• Language preferences</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Cookies (Optional)</h3>
                  <p className="text-gray-700 mb-3">These cookies help us understand how visitors use our website:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Google Analytics (only with your consent)</li>
                    <li>• Page views and user behavior</li>
                    <li>• Performance optimization data</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    You can change your cookie preferences at any time through our cookie banner or by contacting us.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Measures</h2>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start space-x-3">
                  <i className="ri-shield-check-line text-2xl text-green-600 mt-1"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Protect Your Data</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• SSL encryption for all data transmission</li>
                      <li>• Secure servers with restricted access</li>
                      <li>• Regular security updates and monitoring</li>
                      <li>• Staff training on data protection</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4 italic">
                      While we implement industry-standard security measures, no system can be 100% secure. We continuously work to improve our security practices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="bg-gradient-to-r from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Controller</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>OmniTechs V.O.F. (Dreamli)</strong></p>
                      <p>KvK: 93814429</p>
                      <p>Resedastraat 39</p>
                      <p>9713TN Groningen, Netherlands</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center">
                        <i className="ri-mail-line mr-2 text-purple-600"></i>
                        info@dreamli.nl
                      </p>
                      <p className="flex items-center">
                        <i className="ri-phone-line mr-2 text-purple-600"></i>
                        +31 6 4555 9587
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Dutch Version */}
        {activeLanguage === 'nl' && (
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacybeleid</h1>
            <p className="text-xl text-gray-600 mb-12">Laatst bijgewerkt: januari 2024</p>

            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-8 mb-12 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Inleiding</h2>
              <p className="text-gray-700 leading-relaxed">
                Dreamli (OmniTechs V.O.F.) respecteert je privacy en verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) en toepasselijke wetgeving op het gebied van gegevensbescherming. Dit privacybeleid legt uit hoe wij je persoonlijke informatie verzamelen, gebruiken en beschermen.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Welke Informatie We Verzamelen</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-user-line text-purple-600 mr-3"></i>
                    Informatie Die Je Verstrekt
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Persoonlijke gegevens (naam, e-mailadres, telefoonnummer)</li>
                    <li>• Verzend- en factuuradres</li>
                    <li>• Betalingsgegevens</li>
                    <li>• Tekeningen en kunstwerken van kinderen</li>
                    <li>• Communicatie met klantenservice</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-computer-line text-purple-600 mr-3"></i>
                    Technische Informatie
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• IP-adres en locatiegegevens</li>
                    <li>• Browsertype en versie</li>
                    <li>• Apparaatinformatie</li>
                    <li>• Website gebruikspatronen</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-cookie-line text-purple-600 mr-3"></i>
                    Cookies en Analytics
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Essentiële cookies voor websitefunctionaliteit</li>
                    <li>• Google Analytics gegevens (alleen met je toestemming)</li>
                    <li>• Prestatie- en optimalisatiegegevens</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hoe We Je Informatie Gebruiken</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bestellingen Verwerken</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Je gepersonaliseerde producten maken en verzenden</li>
                    <li>• Betalingen veilig verwerken</li>
                    <li>• Bestel-updates en tracking verstrekken</li>
                    <li>• Retouren en omruilen afhandelen</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Klantenservice</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Vragen en verzoeken beantwoorden</li>
                    <li>• Technische ondersteuning bieden</li>
                    <li>• Je account beheren</li>
                    <li>• Problemen oplossen</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Wettelijke Naleving</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Belasting- en boekhoudverplichtingen nakomen</li>
                    <li>• Wettelijke vereisten naleven</li>
                    <li>• Fraude voorkomen en veiligheid waarborgen</li>
                    <li>• Bedrijfsadministratie bijhouden</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing (Met Toestemming)</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Nieuwsbrieven en updates versturen</li>
                    <li>• Productaankondigingen delen</li>
                    <li>• Gepersonaliseerde aanbiedingen bieden</li>
                    <li>• Onze diensten verbeteren</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Rechtsgrondslag voor Verwerking</h2>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="space-y-4 text-gray-700">
                  <p><strong>Overeenkomst:</strong> Verwerking noodzakelijk om je bestellingen te vervullen en onze diensten te leveren</p>
                  <p><strong>Wettelijke Verplichting:</strong> Naleving van belastingwetten en andere wettelijke vereisten</p>
                  <p><strong>Toestemming:</strong> Analytics, marketingcommunicatie en niet-essentiële cookies</p>
                  <p><strong>Gerechtvaardigd Belang:</strong> Veiligheidsmaatregelen, fraudepreventie en bedrijfsvoering</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Gegevensopslag en Bewaarperioden</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bewaarperioden</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Bestelgegevens:</strong> 7 jaar (belastingwetgeving)</li>
                    <li>• <strong>Analytics gegevens:</strong> Maximaal 14 maanden</li>
                    <li>• <strong>Accountgegevens:</strong> Tot je verwijdering aanvraagt</li>
                    <li>• <strong>Marketinggegevens:</strong> Tot je toestemming intrekt</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Gegevens Delen</h2>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-shield-check-line text-xl text-yellow-600 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Wij Verkopen Nooit Je Gegevens</h3>
                    <p className="text-gray-700">Je persoonlijke informatie wordt nooit verkocht aan derden voor marketingdoeleinden.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Wij delen alleen gegevens met:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• <strong>Betalingsverwerkers:</strong> Om veilige transacties af te handelen</li>
                  <li>• <strong>Verzendmaatschappijen:</strong> Om je bestellingen te bezorgen</li>
                  <li>• <strong>IT en hostingproviders:</strong> Om onze diensten te onderhouden</li>
                  <li>• <strong>Google Analytics:</strong> Alleen met je expliciete toestemming</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Jouw Rechten</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-eye-line text-purple-600 mr-2"></i>
                      Inzage
                    </h3>
                    <p className="text-gray-700 text-sm">Vraag een kopie van je persoonsgegevens aan</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-edit-line text-purple-600 mr-2"></i>
                      Correctie
                    </h3>
                    <p className="text-gray-700 text-sm">Onjuiste of onvolledige informatie bijwerken</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-delete-bin-line text-purple-600 mr-2"></i>
                      Verwijdering
                    </h3>
                    <p className="text-gray-700 text-sm">Verzoek om verwijdering van je gegevens (waar wettelijk mogelijk)</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-close-circle-line text-purple-600 mr-2"></i>
                      Toestemming Intrekken
                    </h3>
                    <p className="text-gray-700 text-sm">Stop marketingcommunicatie of analytics</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-download-line text-purple-600 mr-2"></i>
                      Overdraagbaarheid
                    </h3>
                    <p className="text-gray-700 text-sm">Ontvang je gegevens in een overdraagbaar formaat</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <i className="ri-alert-line text-purple-600 mr-2"></i>
                      Klacht
                    </h3>
                    <p className="text-gray-700 text-sm">Dien een klacht in bij de Autoriteit Persoonsgegevens</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookiebeleid</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Essentiële Cookies</h3>
                  <p className="text-gray-700 mb-3">Deze cookies zijn noodzakelijk voor de werking van de website en kunnen niet worden uitgeschakeld:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Sessiebeheer en veiligheid</li>
                    <li>• Winkelwagenfunctionaliteit</li>
                    <li>• Taalvoorkeuren</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Cookies (Optioneel)</h3>
                  <p className="text-gray-700 mb-3">Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken:</p>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Google Analytics (alleen met je toestemming)</li>
                    <li>• Paginaweergaven en gebruikersgedrag</li>
                    <li>• Prestatieoptimalisatiegegevens</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Je kunt je cookievoorkeuren op elk moment wijzigen via onze cookiebanner of door contact met ons op te nemen.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Beveiligingsmaatregelen</h2>
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start space-x-3">
                  <i className="ri-shield-check-line text-2xl text-green-600 mt-1"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoe We Je Gegevens Beschermen</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• SSL-versleuteling voor alle gegevensoverdracht</li>
                      <li>• Veilige servers met beperkte toegang</li>
                      <li>• Regelmatige beveiligingsupdates en monitoring</li>
                      <li>• Personeelstraining over gegevensbescherming</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4 italic">
                      Hoewel wij industriestandaard beveiligingsmaatregelen implementeren, kan geen enkel systeem 100% veilig zijn. Wij werken continu aan het verbeteren van onze beveiligingspraktijken.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contactgegevens</h2>
              <div className="bg-gradient-to-r from-[#FFB6C1]/10 to-[#B9E4C9]/10 rounded-xl p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Verwerkingsverantwoordelijke</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>OmniTechs V.O.F. (Dreamli)</strong></p>
                      <p>KvK: 93814429</p>
                      <p>Resedastraat 39</p>
                      <p>9713TN Groningen, Nederland</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactgegevens</h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center">
                        <i className="ri-mail-line mr-2 text-purple-600"></i>
                        info@dreamli.nl
                      </p>
                      <p className="flex items-center">
                        <i className="ri-phone-line mr-2 text-purple-600"></i>
                        +31 6 4555 9587
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Back to home link */}
        <div className="text-center pt-12 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            <span>{activeLanguage === 'en' ? 'Back to Homepage' : 'Terug naar Homepage'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
