
'use client';

import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate message length
    if (formData.message.length > 500) {
      setSubmitStatus('Bericht mag maximaal 500 tekens bevatten.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submitData = new URLSearchParams();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);

      const response = await fetch('https://readdy.ai/api/form/d207tgj09ltv4mm46cjg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: submitData
      });

      if (response.ok) {
        setSubmitStatus('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('Er is iets misgegaan. Probeer het later opnieuw.');
      }
    } catch (error) {
      setSubmitStatus('Er is iets misgegaan. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#F6EBD9] to-[#FBD4D4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Neem contact op
          </h2>
          <p className="text-xl text-gray-700">
            Heb je vragen? We helpen je graag verder!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Naam
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Bericht
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                maxLength={500}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm resize-none"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.message.length}/500
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formData.message.length > 500}
              className="w-full bg-[#B9E4C9] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#a8d9b8] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Versturen...' : 'Verstuur bericht'}
            </button>
          </form>

          {submitStatus && (
            <div className="mt-4 p-4 bg-[#D4E7FB] text-gray-700 rounded-lg">
              {submitStatus}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-700 mb-4">Volg ons op Instagram:</p>
          <a
            href="https://instagram.com/dreamli.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-instagram-line text-xl"></i>
            </div>
            <span className="font-medium">@dreamli.nl</span>
          </a>
        </div>
      </div>
    </section>
  );
}
