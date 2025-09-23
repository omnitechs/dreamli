
'use client';

import { useState, useEffect } from 'react';
import UploadForm from './UploadForm';

export default function RoadmapSection() {
  const [activePhase, setActivePhase] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [showPhase2Modal, setShowPhase2Modal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [email, setEmail] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePhase2Subscribe = async (e: React.FormEvent) => {
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

      setSubmitStatus('Thank you! You\'ll be the first to know about Phase 2 launch.');
      setEmail('');
      setTimeout(() => {
        setShowPhase2Modal(false);
        setSubmitStatus('');
      }, 2000);
    } catch (error) {
      setSubmitStatus('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlistSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistEmail) {
      setWaitlistStatus('Please enter your email address.');
      return;
    }

    setWaitlistSubmitting(true);
    setWaitlistStatus('');

    try {
      const formData = new FormData();
      formData.append('EMAIL', waitlistEmail);
      formData.append('b_b5c4e06a78dece913db9a1f79_78ff17c433', '');

      const response = await fetch('https://omnitechs.us12.list-manage.com/subscribe/post?u=b5c4e06a78dece913db9a1f79&id=78ff17c433&f_id=002bc7e8f0', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      setWaitlistStatus('Thank you! You\'ve joined the waitlist successfully.');
      setWaitlistEmail('');
      setTimeout(() => {
        setShowWaitlistModal(false);
        setWaitlistStatus('');
      }, 2000);
    } catch (error) {
      setWaitlistStatus('Something went wrong. Please try again.');
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const phases = [
    {
      id: 1,
      title: "Create Your World",
      subtitle: "Available Now",
      description: "Transform drawings into magical 3D figures",
      status: "live",
      features: [
        "Turn any drawing into a 3D figure",
        "Professional painting & finishing",
        "Memory timeline documentation",
        "Forever keepsake creation"
      ],
      icon: "ri-magic-line",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5120acd279f854838402fb4c9a1e2a86.jfif"
    },
    {
      id: 2,
      title: "Learn & Earn",
      subtitle: "Coming 2025",
      description: "Gamified creativity platform with rewards",
      status: "coming",
      features: [
        "AI-powered creation challenges",
        "Digital marketplace for creations",
        "Coin rewards system",
        "Money & entrepreneurship skills"
      ],
      icon: "ri-treasure-map-line",
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      image: "https://readdy.ai/api/search-image?query=gamified%20learning%20platform%20children%20earning%20digital%20coins%20and%20badges%20creative%20challenges%20colorful%20interface%20with%20rewards%20treasure%20chests%20modern%20educational%20technology&width=400&height=300&seq=roadmap2&orientation=landscape"
    },
    {
      id: 3,
      title: "Dreamli Academy",
      subtitle: "Vision 2026",
      description: "National after-school creativity program",
      status: "vision",
      features: [
        "Local workshops & events",
        "AI creativity curriculum",
        "National after-school program",
        "Community creator network"
      ],
      icon: "ri-graduation-cap-line",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      image: "https://readdy.ai/api/search-image?query=modern%20academy%20classroom%20children%20learning%20with%20AI%20technology%20creativity%20workshops%20after%20school%20program%20futuristic%20educational%20environment%20colorful%20collaborative%20learning%20space&width=400&height=300&seq=roadmap3&orientation=landscape"
    }
  ];

  // Background sparkles - only render on client
  const sparkles = isClient ? Array.from({ length: 15 }, (_, i) => ({
    left: `${(i * 7 + 10) % 90}%`,
    top: `${(i * 11 + 15) % 85}%`,
    delay: `${(i * 0.4) % 3}s`,
    size: i % 3 === 0 ? 'w-2 h-2' : 'w-1 h-1'
  })) : [];

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
        {/* Background sparkles */}
        <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning={true}>
          {sparkles.map((sparkle, i) => (
            <div
              key={i}
              className="absolute animate-pulse opacity-30"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                animationDelay: sparkle.delay,
                animationDuration: '4s'
              }}
            >
              <div className={`${sparkle.size} bg-gradient-to-r from-purple-300 to-pink-300 rounded-full`}></div>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
              <span className="text-sm font-semibold text-purple-700">Our Adventure Roadmap</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The Dreamli Quest
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join us on an epic adventure to revolutionize how children learn, create, and grow through the magic of imagination
            </p>
          </div>

          {/* Quest Path */}
          <div className="relative">
            {/* Connecting Path */}
            <div className="hidden lg:block absolute top-32 left-0 right-0 h-1">
              <svg className="w-full h-8" viewBox="0 0 800 32" preserveAspectRatio="none">
                <path
                  d="M0,16 Q200,8 400,16 T800,16"
                  stroke="url(#questGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8,4"
                  className="opacity-40"
                />
                <defs>
                  <linearGradient id="questGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Phase Cards */}
            <div className="grid lg:grid-cols-3 gap-8 relative z-10 px-8 py-8">
              {phases.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                    activePhase === phase.id ? 'scale-105' : ''
                  }`}
                  onClick={() => setActivePhase(phase.id)}
                >
                  {/* Status Badge */}
                  <div className="absolute -top-2 left-2 z-20">
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        phase.status === 'live'
                          ? 'bg-green-500 text-white'
                          : phase.status === 'coming'
                          ? 'bg-blue-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {phase.status === 'live' ? ' LIVE' : phase.status === 'coming' ? ' COMING' : ' VISION'}
                    </div>
                  </div>

                  {/* Phase Number */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl`}
                    >
                      {phase.id}
                    </div>
                  </div>

                  {/* Main Card */}
                  <div
                    className={`${phase.bgColor} ${phase.borderColor} border-2 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 h-full`}
                  >
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <i className={`${phase.icon} text-2xl text-white`}></i>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h3>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{phase.subtitle}</p>
                    </div>

                    {/* Image */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl">
                      <img
                        src={phase.image}
                        alt={phase.title}
                        className="w-full h-48 object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-center mb-6 leading-relaxed">
                      {phase.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {phase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <i className="ri-check-line text-white text-sm"></i>
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 text-center">
                      {phase.status === 'live' ? (
                        <button
                          onClick={() => setShowUploadForm(true)}
                          className={`bg-gradient-to-r ${phase.color} text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 cursor-pointer whitespace-nowrap`}
                        >
                          Start Creating Now
                        </button>
                      ) : phase.status === 'coming' ? (
                        <button
                          onClick={() => setShowWaitlistModal(true)}
                          className={`border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-full font-bold hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap`}
                        >
                          Join Waitlist
                        </button>
                      ) : (
                        <button
                          className={`border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-full font-bold hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap`}
                        >
                          Learn More
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin the Adventure?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Start your child's creative journey today with Phase 1, and be the first to know when new phases launch
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-rocket-line"></i>
                    <span>Start Phase 1 Now</span>
                  </div>
                </button>
                <button
                  onClick={() => setShowPhase2Modal(true)}
                  className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-notification-line"></i>
                    <span>Get Phase 2 Updates</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 Updates Modal */}
        {showPhase2Modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl border border-white/20 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowPhase2Modal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-treasure-map-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Phase 2 Updates</h3>
                <p className="text-gray-600">Be the first to know when gamified learning and earning launches!</p>
              </div>

              {/* Subscription Form */}
              <form onSubmit={handlePhase2Subscribe} className="space-y-4">
                <div>
                  <label htmlFor="phase2-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="phase2-email"
                    name="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Get Phase 2 Updates'}
                </button>

                {submitStatus && (
                  <div
                    className={`p-4 rounded-lg text-center text-sm ${
                      submitStatus.includes('Thank you')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {submitStatus}
                  </div>
                )}
              </form>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Modal */}
        {showWaitlistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 mx-4 max-w-md w-full shadow-2xl border border-white/20 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-treasure-map-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Join the Waitlist</h3>
                <p className="text-gray-600">Be the first to know when new features launch!</p>
              </div>

              {/* Subscription Form */}
              <form onSubmit={handleWaitlistSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="waitlist-email"
                    name="EMAIL"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={waitlistSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {waitlistSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>

                {waitlistStatus && (
                  <div
                    className={`p-4 rounded-lg text-center text-sm ${
                      waitlistStatus.includes('Thank you')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {waitlistStatus}
                  </div>
                )}
              </form>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && <UploadForm onClose={() => setShowUploadForm(false)} />}
      </section>
    </>
  );
}
