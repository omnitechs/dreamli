
'use client';

import { useState } from 'react';

interface ClaimFormProps {
  productId: string | null;
  onSuccess: () => void;
}

export default function ClaimForm({ productId, onSuccess }: ClaimFormProps) {
  const [formData, setFormData] = useState({
    childName: '',
    ownerName: '',
    dedicationMessage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call to claim the product
      const submitData = new FormData();
      submitData.append('productId', productId || '');
      submitData.append('childName', formData.childName);
      submitData.append('ownerName', formData.ownerName);
      submitData.append('dedicationMessage', formData.dedicationMessage);
      
      // For demo purposes, simulate success after 2 seconds
      setTimeout(() => {
        setSubmitStatus('success');
        onSuccess();
        setIsSubmitting(false);
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitStatus === 'success') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-3xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your Dreamli!</h3>
          <p className="text-gray-600 mb-6">
            Your magical model has been claimed. You can now add photos, videos, and create lasting memories.
          </p>
          <button
            onClick={() => window.location.href = '/memory?id=' + productId}
            className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Go to Your Memory Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Claim Your Dreamli
        </h2>
        
        <form id="dreamli-claim" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="childName" className="block text-sm font-semibold text-gray-700 mb-2">
              Child's Name (optional)
            </label>
            <input
              type="text"
              id="childName"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              placeholder="e.g., Emma"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50"
            />
          </div>

          <div>
            <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name (optional)
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="e.g., Sarah Johnson"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50"
            />
          </div>

          <div>
            <label htmlFor="dedicationMessage" className="block text-sm font-semibold text-gray-700 mb-2">
              Dedication Message (optional)
            </label>
            <textarea
              id="dedicationMessage"
              name="dedicationMessage"
              value={formData.dedicationMessage}
              onChange={handleChange}
              placeholder="e.g., For Mila, from Dad"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.dedicationMessage.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-4 rounded-full text-lg font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 animate-spin">
                  <i className="ri-loader-4-line text-lg"></i>
                </div>
                <span>Claiming...</span>
              </div>
            ) : (
              'Claim and Continue'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl border border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <i className="ri-information-line text-lg text-gray-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Once claimed, this page becomes yours. You'll be able to add photos, videos, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
