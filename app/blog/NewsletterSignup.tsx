
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function NewsletterSignup() {
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

      setSubmitStatus('Thank you! Check your email for the free guide.');
      setEmail('');
    } catch (error) {
      setSubmitStatus('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-gift-line text-white w-5 h-5 flex items-center justify-center"></i>
                </div>
                <span className="text-white/90 font-medium">Free Creative Guide</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Get our free guide: 10 Creative Activities to Do with Your Kids
              </h2>
              
              <p className="text-white/90 mb-6 text-lg">
                Screen-free activities that spark imagination and bring families closer together. 
                Plus, get weekly tips delivered to your inbox!
              </p>
              
              {!submitStatus.includes('Thank you') ? (
                <form 
                  id="blog-newsletter-signup"
                  data-readdy-form
                  onSubmit={handleSubmit} 
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    name="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                  
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
                    className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Now'}
                  </button>
                </form>
              ) : (
                <div className="bg-white/20 rounded-xl p-4 flex items-center">
                  <i className="ri-check-line text-white w-5 h-5 flex items-center justify-center mr-3"></i>
                  <span className="text-white font-medium">{submitStatus}</span>
                </div>
              )}
              
              {submitStatus && !submitStatus.includes('Thank you') && (
                <div className="mt-3 bg-red-500/20 rounded-xl p-3 flex items-center">
                  <i className="ri-error-warning-line text-white w-4 h-4 flex items-center justify-center mr-2"></i>
                  <span className="text-white text-sm">{submitStatus}</span>
                </div>
              )}
              
              <div className="flex items-center mt-4 text-white/80 text-sm">
                <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center mr-2"></i>
                No spam, unsubscribe anytime
              </div>
            </div>
            
            <div className="relative h-64 lg:h-full min-h-[300px]">
              <Image 
                src="https://readdy.ai/api/search-image?query=Happy%20family%20doing%20creative%20screen-free%20activities%20together%2C%20parents%20and%20children%20engaged%20in%20art%20crafts%20drawing%2C%20colorful%20activity%20guide%20book%20visible%2C%20bright%20cheerful%20home%20setting%2C%20warm%20natural%20lighting%2C%20joyful%20expressions%2C%20organized%20craft%20supplies&width=500&height=400&seq=newsletter-guide&orientation=portrait"
                alt="Family doing creative activities"
                width={500}
                height={400}
                className="absolute inset-0 w-full h-full object-cover object-top rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
