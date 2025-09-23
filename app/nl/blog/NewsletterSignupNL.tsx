
'use client';

import { useState } from 'react';

export default function NewsletterSignupNL() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-white text-2xl w-8 h-8 flex items-center justify-center"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welkom bij de Dreamli Familie!</h2>
            <p className="text-lg text-white/90">
              Je bent nu ingeschreven voor onze nieuwsbrief. Verwacht binnenkort inspirerende tips en verhalen in je inbox!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-white mb-4">
            Blijf op de Hoogte van <span className="text-yellow-300">Creatieve Tips</span>
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Ontvang wekelijks inspirerende tips, nieuwe activiteitenideeën en exclusieve inzichten om de creativiteit van je kind te stimuleren.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Je e-mailadres"
                required
                className="flex-1 px-6 py-4 text-gray-900 bg-white rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2 w-5 h-5 flex items-center justify-center"></i>
                    Bezig...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Inschrijven
                    <i className="ri-arrow-right-line ml-2 w-5 h-5 flex items-center justify-center"></i>
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6 text-white/80 text-sm">
            <i className="ri-shield-check-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Je privacy is veilig. Geen spam, uitschrijven altijd mogelijk.
          </div>

          <div className="flex items-center justify-center mt-8 space-x-8 text-white/60">
            <div className="flex items-center">
              <i className="ri-mail-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Wekelijks
            </div>
            <div className="flex items-center">
              <i className="ri-user-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              10.000+ ouders
            </div>
            <div className="flex items-center">
              <i className="ri-star-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Exclusieve tips
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
