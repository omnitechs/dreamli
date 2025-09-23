
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FooterNL() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSubmitStatus('Voer je e-mailadres in.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('b_b5c4e06a78dece913db9a1f79_78ff17c433', '');

      const response = await fetch('https://omnitechs.us12.list-manage.com/subscribe/post?u=b5c4e06a78dece913db9a1f79&id=78ff17c433&f_id=002bc7e8f0', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      setSubmitStatus('Bedankt! Controleer je e-mail om je inschrijving te bevestigen.');
      setEmail('');
    } catch (error) {
      setSubmitStatus('Er is iets misgegaan. Probeer opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div>
            <Link href="/nl" className="cursor-pointer mb-4 inline-block">
              <img 
                src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png" 
                alt="Dreamli Logo"
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Wij brengen kindertekeningen tot leven als prachtige 3D-modellen en bewaren alle speciale momenten voor altijd online.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/dreamli.art"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <i className="ri-instagram-fill text-white text-lg"></i>
              </a>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <i className="ri-facebook-fill text-white text-lg"></i>
              </div>
              <a
                href="https://wa.me/31645559587"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <i className="ri-whatsapp-fill text-white text-lg"></i>
              </a>
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Bedrijfsinfo</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-2">
                <i className="ri-building-2-line text-purple-600"></i>
                <a href="https://omnitechs.nl" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">
                  Omni Techs
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <i className="ri-map-pin-line text-purple-600 mt-1"></i>
                <div className="text-sm">
                  <p>Resedastraat 39</p>
                  <p>9713TN, Groningen</p>
                  <p>Nederland</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-building-line text-purple-600"></i>
                <p className="text-sm">KvK: 93814429</p>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-phone-line text-purple-600"></i>
                <p className="text-sm">+31 6 4555 9587</p>
              </div>
            </div>
          </div>

          {/* Collaboration Hub */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">Samenwerkingshub</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/nl/collaboration" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Partner met Ons
                </Link>
              </li>
              <li>
                <a 
                  href="https://omnitechs.nl/about-founder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Over de Oprichter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription section */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Nieuwsbrief</h3>
            <p className="text-gray-600 text-sm mb-4">
              Blijf op de hoogte van ons laatste nieuws
            </p>

            <form 
              id="mailchimp-subscribe-nl"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <input
                type="email"
                id="EMAIL"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                placeholder="Je e-mailadres"
              />

              <input 
                type="text" 
                name="b_b5c4e06a78dece913db9a1f79_78ff17c433" 
                tabIndex={-1} 
                value="" 
                style={{ position: 'absolute', left: '-5000px' }} 
                readOnly
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8472DF] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7461D1] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Verzenden...' : 'Abonneren'}
              </button>

              {submitStatus && (
                <div className={`text-xs p-2 rounded ${ 
                  submitStatus.includes('Bedankt') 
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {submitStatus}
                </div>
              )}
            </form>

            <p className="text-xs text-gray-500 mt-3">
              We respecteren je privacy. Je kunt je op elk moment uitschrijven.
            </p>
          </div>
        </div>

        {/* Trustpilot Widget - Full Width Section */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-md">
            {/* TrustBox widget - Review Collector */}
            <div className="trustpilot-widget" data-locale="nl-NL" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="68a6edd70d777a86c73f9db9" data-style-height="52px" data-style-width="100%" data-token="2ad89189-9d0c-4c8e-af68-a4bcfe039e48">
              <a href="https://nl.trustpilot.com/review/dreamli.nl" target="_blank" rel="noopener">Trustpilot</a>
            </div>
            {/* End TrustBox widget */}
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              2024 Dreamli. Alle rechten voorbehouden.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-purple-600 transition-colors cursor-pointer">
                Privacybeleid
              </Link>
              <Link href="/terms" className="hover:text-purple-600 transition-colors cursor-pointer">
                Algemene Voorwaarden
              </Link>
              <Link href="#" className="hover:text-purple-600 transition-colors cursor-pointer">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
