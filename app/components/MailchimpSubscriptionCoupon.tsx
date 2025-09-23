
'use client';

import { useState, useEffect } from 'react';

export default function MailchimpSubscriptionCoupon() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkShowPopup = () => {
      const hasSubscribed = localStorage.getItem('dreamli_subscribed') === 'true';
      const dismissedAt = localStorage.getItem('dreamli_popup_dismissed');
      const isRegistered = localStorage.getItem('dreamli_user_registered') === 'true';
      
      if (hasSubscribed || isRegistered) {
        return;
      }
      
      if (dismissedAt) {
        const dismissTime = new Date(dismissedAt);
        const now = new Date();
        const tenMinutes = 10 * 60 * 1000;
        
        if (now.getTime() - dismissTime.getTime() < tenMinutes) {
          return;
        }
      }
      
      let hasShown = false;

      // Timer - show after 10 seconds
      const timer = setTimeout(() => {
        if (!hasShown) {
          setIsVisible(true);
          hasShown = true;
        }
      }, 20000); // 20,000 milliseconds = 20 seconds

      // Scroll listener - show when scrolled through half of homepage
      const handleScroll = () => {
        if (hasShown) return;
        
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / documentHeight;
        
        if (scrollPercentage >= 0.5) {
          setIsVisible(true);
          hasShown = true;
          clearTimeout(timer);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    };

    const cleanup = checkShowPopup();
    return cleanup;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    try {
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('COUPON', 'EARLYBIRD50');
      formData.append('b_b5c4e06a78dece913db9a1f79_78ff17c433', '');

      const response = await fetch('https://omnitechs.us12.list-manage.com/subscribe/post?u=b5c4e06a78dece913db9a1f79&id=78ff17c433&f_id=002bc7e8f0', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dreamli_subscribed', 'true');
      }
      
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dreamli_popup_dismissed', new Date().toISOString());
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden"
           style={{background: 'linear-gradient(to bottom right, #DBEAFE, #F3E8FF)'}}>
        
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-bold text-gray-900">LIMITED TIME</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get 50% Off!
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              Join our growing community of parents unlocking their children's creativity. Get exclusive tips and your discount code delivered straight to your inbox.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
              />
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm whitespace-nowrap"
              >
                Get My 50% Discount Now
              </button>
              
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-gray-500 text-xs hover:text-gray-700 transition-colors whitespace-nowrap"
              >
                Maybe later
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-green-600 text-2xl"></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h4>
              <p className="text-gray-700 text-sm">
                Your discount code is on its way to your inbox. Don't forget to check your spam folder!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
