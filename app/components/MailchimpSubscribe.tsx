'use client';

import { useState } from 'react';

export default function MailchimpSubscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setSubmitStatus('Please enter your email address.');
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

      // Since we're using no-cors mode, we can't read the response
      // We'll assume success if no error is thrown
      setSubmitStatus('Thank you! Please check your email to confirm your subscription.');
      setEmail('');
    } catch (error) {
      setSubmitStatus('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#D4E7FB] to-[#FBD4D4]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-700">
              Subscribe to get the latest updates and special offers from Dreamli
            </p>
          </div>

          <form 
            id="mailchimp-subscribe"
            data-readdy-form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="EMAIL" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="EMAIL"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                placeholder="Enter your email address"
              />
            </div>

            {/* Hidden honeypot field */}
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
              className="w-full bg-[#B9E4C9] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#a8d9b8] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>

            {submitStatus && (
              <div className={`p-4 rounded-lg text-center ${
                submitStatus.includes('Thank you') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {submitStatus}
              </div>
            )}
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}