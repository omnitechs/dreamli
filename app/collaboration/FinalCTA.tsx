
'use client';

import { useState } from 'react';

export default function FinalCTA() {
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
          Ready to Join Our Designer Community?
        </h2>
        <p className="text-xl text-indigo-100 mb-12">
          Take the first step towards connecting with fellow creatives and showcasing your artistic vision.
        </p>
        
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="FNAME"
                placeholder="First Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <input
                type="text"
                name="LNAME"
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <input
                type="email"
                name="EMAIL"
                placeholder="Email Address"
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
              {isSubmitting ? 'Joining...' : 'Join as Designer'}
            </button>
          </form>
          
          {submitStatus === 'success' && (
            <div className="text-green-200 text-sm text-center mt-4">
              <i className="ri-check-circle-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Successfully joined! Welcome to our designer community.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-200 text-sm text-center mt-4">
              <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
