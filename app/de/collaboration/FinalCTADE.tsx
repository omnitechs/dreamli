'use client';

import { useState } from 'react';

export default function FinalCTADE() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch('https://dreamli.us12.list-manage.com/subscribe/post?u=b5c4e06a78dece913db9a1f79&id=78ff17c433&f_id=00c5c4e8f0', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      
      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Bereit, unserer Designer-Community beizutreten?
        </h2>
        <p className="text-xl text-indigo-100 mb-12">
          Machen Sie den ersten Schritt, um sich mit anderen Kreativen zu vernetzen und Ihre künstlerische Vision zu präsentieren.
        </p>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="FNAME"
                placeholder="Vorname"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="LNAME"
                placeholder="Nachname"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="EMAIL"
                placeholder="E-Mail-Adresse"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            <input type="hidden" name="tags" value="12756085" />
            <input type="hidden" name="b_b5c4e06a78dece913db9a1f79_78ff17c433" value="" />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {isSubmitting ? 'Beitritt läuft...' : 'Als Designer beitreten'}
            </button>
          </form>
          
          {submitStatus === 'success' && (
            <div className="text-green-200 text-sm text-center mt-4">
              <i className="ri-check-circle-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Erfolgreich beigetreten! Willkommen in unserer Designer-Community.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-200 text-sm text-center mt-4">
              <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}