'use client';

import { useState } from 'react';

export default function SchoolsLeadFormDE() {
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
            <span className="text-sm font-semibold text-[#FFA726]">Jetzt beginnen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ihr Pilotprojekt anfordern
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Erzählen Sie uns von Ihrer Schule und wir richten eine perfekte Pilotsitzung für Ihre Schüler ein
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-green-800">Anfrage erfolgreich eingereicht!</p>
                  <p className="text-green-700 text-sm">Wir werden Sie innerhalb von 24 Stunden kontaktieren, um Ihr Pilotprojekt zu planen.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-error-warning-fill text-red-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-red-800">Etwas ist schief gelaufen</p>
                  <p className="text-red-700 text-sm">Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="schools-pilot-form">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* School/BSO Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Schule/BSO Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Geben Sie den Namen Ihrer Einrichtung ein"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ihr Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Ihr vollständiger Name"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ihre Rolle *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Wählen Sie Ihre Rolle</option>
                  <option value="teacher">Lehrer</option>
                  <option value="head-teacher">Schulleiter</option>
                  <option value="coordinator">Programmkoordinator</option>
                  <option value="bso-leader">BSO-Leiter</option>
                  <option value="administrator">Administrator</option>
                  <option value="other">Andere</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="ihre.email@schule.de"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefonnummer *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="+49 30 12345678"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stadt + Postleitzahl *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Berlin, 10115"
                />
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bevorzugtes Format *
                </label>
                <select
                  name="format"
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Format auswählen</option>
                  <option value="one-off">Einmaliger Workshop</option>
                  <option value="6-week">6-Wochen-Programm</option>
                  <option value="monthly">Monatlicher Club</option>
                  <option value="unsure">Noch nicht sicher</option>
                </select>
              </div>

              {/* Students per session */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Schüler pro Sitzung *
                </label>
                <select
                  name="studentsPerSession"
                  required
                  value={formData.studentsPerSession}
                  onChange={(e) => setFormData({...formData, studentsPerSession: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Gruppengröße auswählen</option>
                  <option value="8-12">8-12 Schüler</option>
                  <option value="13-18">13-18 Schüler</option>
                  <option value="19-24">19-24 Schüler</option>
                  <option value="varies">Variiert</option>
                </select>
              </div>

              {/* Ages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Schüleralter (alle zutreffenden markieren) *
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
                      <span className="text-sm text-gray-700">{age} Jahre</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Earliest Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Frühestmögliches Datum *
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
                    Ich erlaube die Verwendung von Fotos/Videos unserer Pilotsitzung für Werbezwecke (optional)
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zusätzliche Notizen
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  maxLength={500}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm resize-none"
                  placeholder="Besondere Anforderungen, Fragen oder Ziele für die Pilotsitzung? (max. 500 Zeichen)"
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.notes.length}/500 Zeichen
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
                    <span>Wird eingereicht...</span>
                  </div>
                ) : (
                  'Ein Pilotprojekt anfordern'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}