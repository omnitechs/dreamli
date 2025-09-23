
'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsPage() {
  const [language, setLanguage] = useState<'en' | 'nl'>('en');

  useEffect(() => {
    if (language === 'en') {
      document.title = "Terms & Conditions | Dreamli Purchase Terms & Return Policy";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Orders, payments, production, shipping, returns, and user responsibilities—our service terms in plain language.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Orders, payments, production, shipping, returns, and user responsibilities—our service terms in plain language.';
        document.head.appendChild(meta);
      }
    } else {
      document.title = "Algemene Voorwaarden | Dreamli Aankoopvoorwaarden & Retourbeleid";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Bestellingen, betalingen, productie, verzending, retouren en gebruikersverantwoordelijkheden—onze servicevoorwaarden in duidelijke taal.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'Bestellingen, betalingen, productie, verzending, retouren en gebruikersverantwoordelijkheden—onze servicevoorwaarden in duidelijke taal.';
        document.head.appendChild(meta);
      }
    }
  }, [language]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Language Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('nl')}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  language === 'nl'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Nederlands
              </button>
            </div>
          </div>

          {/* English Version */}
          {language === 'en' && (
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
                <p className="text-xl text-gray-600">Dreamli.nl</p>
                <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
              </div>

              <div className="space-y-8">
                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-building-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Company Information</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Dreamli is part of OmniTechs V.O.F. (KvK 93814429, Resedastraat 39, 9713TN Groningen, info@dreamli.nl). 
                    These terms apply to all orders placed via Dreamli.nl.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-gift-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We create personalized 3D-printed creative kits based on children's drawings. Each kit is custom-made 
                    and may vary slightly in color or shape due to the handcrafted nature of our products.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-shopping-cart-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Orders & Payment</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    A contract is made once you place an order and we confirm it. Payment is required at checkout through 
                    iDEAL, Stripe, or card. Prices include VAT unless stated otherwise.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-truck-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Delivery</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Custom kits are usually shipped within 5–10 business days via PostNL/DHL. We are not responsible 
                    for delays caused by carriers.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-arrow-go-back-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Returns</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Under EU law you have a 14-day right of withdrawal, except for personalized products (Article 6:230p BW). 
                    Since our kits are made-to-order, they cannot be returned unless faulty. If a product arrives damaged 
                    or defective, we will replace or refund it.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-shield-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Liability</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We are not liable for misuse of our products or for minor variations due to the production process. 
                    Our liability is limited to the order value.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-copyright-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Intellectual Property</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    All website and product designs belong to Dreamli. By uploading a drawing, you confirm you have 
                    the right to use it and it does not infringe on third-party rights.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-lock-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Privacy & Cookies</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We handle your data according to our Privacy Policy. Please review our privacy practices for 
                    detailed information about data collection and usage.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-scales-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Law & Disputes</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    These terms are governed by Dutch law. Disputes will be handled by Dutch courts.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-refresh-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Changes</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We may update these terms. The version at the time of your order applies. Continued use of our 
                    services after changes constitutes acceptance of new terms.
                  </p>
                </section>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-12">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Contact Information</h3>
                  <div className="text-purple-800 space-y-1">
                    <p><strong>OmniTechs V.O.F. (Dreamli.nl)</strong></p>
                    <p>KvK: 93814429</p>
                    <p>Address: Resedastraat 39, 9713TN Groningen</p>
                    <p>Email: info@dreamli.nl</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dutch Version */}
          {language === 'nl' && (
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Algemene Voorwaarden</h1>
                <p className="text-xl text-gray-600">Dreamli.nl</p>
                <p className="text-sm text-gray-500 mt-2">Laatst bijgewerkt: December 2024</p>
              </div>

              <div className="space-y-8">
                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-building-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Bedrijfsinformatie</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Dreamli maakt deel uit van OmniTechs V.O.F. (KvK 93814429, Resedastraat 39, 9713TN Groningen, info@dreamli.nl). 
                    Deze voorwaarden gelden voor alle bestellingen via Dreamli.nl.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-gift-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Producten</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Wij maken gepersonaliseerde 3D-geprinte creatieve kits gebaseerd op kindertekeningen. Elke kit wordt 
                    op maat gemaakt en kan iets variëren in kleur of vorm vanwege het handgemaakte karakter van onze producten.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-shopping-cart-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Bestellingen & Betaling</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Een overeenkomst ontstaat zodra u een bestelling plaatst en wij deze bevestigen. Betaling is vereist 
                    bij het afrekenen via iDEAL, Stripe of kaart. Prijzen zijn inclusief BTW tenzij anders vermeld.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-truck-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Levering</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Aangepaste kits worden meestal binnen 5-10 werkdagen verzonden via PostNL/DHL. Wij zijn niet 
                    verantwoordelijk voor vertragingen veroorzaakt door vervoerders.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-arrow-go-back-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Retourneren</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Onder EU-wetgeving heeft u een herroepingsrecht van 14 dagen, behalve voor gepersonaliseerde producten 
                    (Artikel 6:230p BW). Omdat onze kits op bestelling worden gemaakt, kunnen ze niet worden geretourneerd 
                    tenzij defect. Als een product beschadigd of defect aankomt, vervangen of vergoeden wij het.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-shield-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Aansprakelijkheid</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Wij zijn niet aansprakelijk voor misbruik van onze producten of voor kleine variaties door het 
                    productieproces. Onze aansprakelijkheid is beperkt tot de bestelwaarde.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-copyright-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Intellectueel Eigendom</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Alle website- en productontwerpen behoren tot Dreamli. Door een tekening te uploaden, bevestigt u 
                    dat u het recht heeft deze te gebruiken en dat het geen inbreuk maakt op rechten van derden.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-lock-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Privacy & Cookies</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Wij behandelen uw gegevens volgens ons Privacybeleid. Bekijk onze privacypraktijken voor 
                    gedetailleerde informatie over gegevensverzameling en gebruik.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-scales-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Recht & Geschillen</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Deze voorwaarden vallen onder Nederlands recht. Geschillen worden behandeld door Nederlandse rechtbanken.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-refresh-line text-purple-600"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Wijzigingen</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Wij kunnen deze voorwaarden bijwerken. De versie ten tijde van uw bestelling is van toepassing. 
                    Voortgezet gebruik van onze diensten na wijzigingen betekent acceptatie van nieuwe voorwaarden.
                  </p>
                </section>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-12">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Contactinformatie</h3>
                  <div className="text-purple-800 space-y-1">
                    <p><strong>OmniTechs V.O.F. (Dreamli.nl)</strong></p>
                    <p>KvK: 93814429</p>
                    <p>Adres: Resedastraat 39, 9713TN Groningen</p>
                    <p>E-mail: info@dreamli.nl</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
