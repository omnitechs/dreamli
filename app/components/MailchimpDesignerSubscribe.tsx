
'use client';

import { useState } from 'react';

export default function MailchimpDesignerSubscribe() {
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
    <div className="bg-white rounded-lg p-8 shadow-lg">
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Join Our Designer Network</h3>
        <p className="text-gray-600 mb-6 text-center">Get exclusive updates and opportunities for designers</p>
        
        <form 
          onSubmit={handleSubmit}
          id="designer-subscribe-form"
          className="space-y-4"
        >
          <div>
            <label htmlFor="designer-fname" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="FNAME"
              id="designer-fname"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your first name"
            />
          </div>
          
          <div>
            <label htmlFor="designer-lname" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="LNAME"
              id="designer-lname"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your last name"
            />
          </div>
          
          <div>
            <label htmlFor="designer-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="EMAIL"
              id="designer-email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <input type="hidden" name="tags" value="12756085" />
          <input type="hidden" name="b_b5c4e06a78dece913db9a1f79_78ff17c433" value="" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Join Designer Network'}
          </button>

          {submitStatus === 'success' && (
            <div className="text-green-600 text-sm text-center mt-3">
              <i className="ri-check-circle-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Successfully subscribed! Welcome to our designer network.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-600 text-sm text-center mt-3">
              <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center inline mr-1"></i>
              Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
