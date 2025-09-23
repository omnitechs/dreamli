'use client';

import { useState } from 'react';

export default function SchoolsLeadForm() {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    format: '',
    studentsPerSession: '',
    ages: [],
    earliestDate: '',
    mediaPermission: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        schoolName: '',
        contactName: '',
        role: '',
        email: '',
        phone: '',
        location: '',
        format: '',
        studentsPerSession: '',
        ages: [],
        earliestDate: '',
        mediaPermission: false,
        notes: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgeChange = (age: string) => {
    const currentAges = formData.ages as string[];
    if (currentAges.includes(age)) {
      setFormData({
        ...formData,
        ages: currentAges.filter(a => a !== age)
      });
    } else {
      setFormData({
        ...formData,
        ages: [...currentAges, age]
      });
    }
  };

  return (
    <section className="py-24 bg-[#F9FBFF]" id="request-pilot">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#FFA726]/10 to-[#FF9800]/10 rounded-full px-6 py-3 mb-6 border border-[#FFA726]/20">
            <span className="text-sm font-semibold text-[#FFA726]">Get Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Request Your Pilot
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your school and we'll set up a perfect pilot session for your students
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-green-800">Request submitted successfully!</p>
                  <p className="text-green-700 text-sm">We'll contact you within 24 hours to schedule your pilot.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-error-warning-fill text-red-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-red-800">Something went wrong</p>
                  <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="schools-pilot-form">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* School/BSO Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School/BSO Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Enter your institution name"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Your full name"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Role *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Select your role</option>
                  <option value="teacher">Teacher</option>
                  <option value="head-teacher">Head Teacher</option>
                  <option value="coordinator">Program Coordinator</option>
                  <option value="bso-leader">BSO Leader</option>
                  <option value="administrator">Administrator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="your.email@school.nl"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="+31 6 12345678"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City + Postcode *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Groningen, 9700 AB"
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Format *
                </label>
                <select
                  name="format"
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Select format</option>
                  <option value="one-off">One-Off Workshop</option>
                  <option value="6-week">6-Week Program</option>
                  <option value="monthly">Monthly Club</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>

              {/* Students per session */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Students per Session *
                </label>
                <select
                  name="studentsPerSession"
                  required
                  value={formData.studentsPerSession}
                  onChange={(e) => setFormData({...formData, studentsPerSession: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Select group size</option>
                  <option value="8-12">8-12 students</option>
                  <option value="13-18">13-18 students</option>
                  <option value="19-24">19-24 students</option>
                  <option value="varies">Varies</option>
                </select>
              </div>

              {/* Ages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Student Ages (check all that apply) *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {['6-7', '7-8', '8-9', '9-10', '10-11', '11-12'].map((age) => (
                    <label key={age} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.ages as string[]).includes(age)}
                        onChange={() => handleAgeChange(age)}
                        className="w-4 h-4 text-[#FFA726] border-gray-300 rounded focus:ring-[#FFA726]"
                      />
                      <span className="text-sm text-gray-700">{age} years</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Earliest Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Earliest Possible Date *
                </label>
                <input
                  type="date"
                  name="earliestDate"
                  required
                  value={formData.earliestDate}
                  onChange={(e) => setFormData({...formData, earliestDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                />
              </div>

              {/* Media Permission */}
              <div className="md:col-span-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="mediaPermission"
                    checked={formData.mediaPermission}
                    onChange={(e) => setFormData({...formData, mediaPermission: e.target.checked})}
                    className="mt-1 w-4 h-4 text-[#FFA726] border-gray-300 rounded focus:ring-[#FFA726]"
                  />
                  <span className="text-sm text-gray-700">
                    I give permission to use photos/videos of our pilot session for promotional purposes (optional)
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  maxLength={500}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm resize-none"
                  placeholder="Any specific requirements, questions, or goals for the pilot session? (max 500 characters)"
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.notes.length}/500 characters
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFA726] text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Request a Pilot'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}