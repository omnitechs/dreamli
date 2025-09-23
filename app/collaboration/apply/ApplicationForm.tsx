'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ApplicationForm() {
  const searchParams = useSearchParams();
  const [applicationType, setApplicationType] = useState('designer');
  const [formData, setFormData] = useState({
    type: 'designer',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    portfolio: '',
    specialties: [],
    motivation: '',
    availability: ''
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'designer' || type === 'manufacturer') {
      setApplicationType(type);
      setFormData(prev => ({ ...prev, type }));
    }
  }, [searchParams]);

  const designerSpecialties = [
    '3D Modeling', 'Character Design', 'Product Design', 'Animation', 'Toy Design', 'Educational Products'
  ];

  const manufacturerSpecialties = [
    'FDM Printing', 'SLA Printing', 'Multi-material', 'Large Scale', 'Post-processing', 'Quality Control'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Application submitted:', formData);
  };

  const currentSpecialties = applicationType === 'designer' ? designerSpecialties : manufacturerSpecialties;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Apply as a {applicationType === 'designer' ? 'Designer' : 'Manufacturer'}
          </h1>
          <p className="text-xl text-gray-700">
            Join the Dreamli platform and help bring children's creativity to life
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-2xl p-2 flex">
                <button
                  onClick={() => setApplicationType('designer')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    applicationType === 'designer'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="ri-palette-line mr-2"></i>
                  Designer
                </button>
                <button
                  onClick={() => setApplicationType('manufacturer')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    applicationType === 'manufacturer'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className="ri-printer-line mr-2"></i>
                  Manufacturer
                </button>
              </div>
            </div>

            <form id="collaboration-application" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Years of Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Portfolio/Website URL *
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://your-portfolio.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Specialties (Select all that apply)
                </label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentSpecialties.map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
                        formData.specialties.includes(specialty)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Why do you want to join Dreamli? *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                  placeholder="Tell us about your motivation and what you hope to achieve..."
                  required
                />
                <div className="text-xs text-gray-500 mt-2">
                  {formData.motivation.length}/500 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Availability *
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm pr-8"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="part-time">Part-time (10-20 hours/week)</option>
                  <option value="full-time">Full-time (30+ hours/week)</option>
                  <option value="project-based">Project-based (flexible)</option>
                  <option value="weekends">Weekends only</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-3"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to Dreamli's Terms of Service and Privacy Policy. I understand that this application will be reviewed and I may be contacted for additional information.
                  </label>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  <i className="ri-send-plane-line mr-3"></i>
                  Submit Application
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  We'll review your application within 5-7 business days
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}