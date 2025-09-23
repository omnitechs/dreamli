'use client';

import { useState } from 'react';

export default function CollaborationHeroDE() {
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
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=creative%20designers%20working%20with%20artistic%20tools%20and%20materials%20in%20a%20modern%20studio%20space%20with%20natural%20lighting%20and%20inspiring%20creative%20atmosphere%20showcasing%20collaboration%20and%20artistic%20innovation%20with%20clean%20professional%20workspace%20design&width=1200&height=800&seq=hero-bg-01&orientation=landscape')`
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="ri-palette-line text-3xl text-indigo-600"></i>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Treten Sie unserer <span className="text-indigo-600">Designer</span>-Community bei
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Vernetzen Sie sich mit gleichgesinnten Designern, präsentieren Sie Ihre Kreativität und werden Sie Teil einer exklusiven Community, die künstlerische Exzellenz und Innovation schätzt.
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
                className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? 'Beitritt läuft...' : 'Als Designer beitreten'}
              </button>
            </form>
            
            {submitStatus === 'success' && (
              <div className="text-green-600 text-sm text-center mt-4">
                <i className="ri-check-circle-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
                Erfolgreich beigetreten! Willkommen in unserer Designer-Community.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="text-red-600 text-sm text-center mt-4">
                <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
                Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}