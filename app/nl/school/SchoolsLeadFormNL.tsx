'use client';

import { useState } from 'react';

export default function SchoolsLeadFormNL() {
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
    <section className="py-24 bg-[#F9FBFF]" id="vraag-pilot-aan">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#FFA726]/10 to-[#FF9800]/10 rounded-full px-6 py-3 mb-6 border border-[#FFA726]/20">
            <span className="text-sm font-semibold text-[#FFA726]">Aan de Slag</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Vraag Je Pilot Aan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vertel ons over je school en we zetten een perfecte pilotsessie op voor je leerlingen
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-checkbox-circle-fill text-green-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-green-800">Aanvraag succesvol ingediend!</p>
                  <p className="text-green-700 text-sm">We nemen binnen 24 uur contact met je op om je pilot in te plannen.</p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-error-warning-fill text-red-500 text-xl"></i>
                <div>
                  <p className="font-semibold text-red-800">Er is iets misgegaan</p>
                  <p className="text-red-700 text-sm">Probeer het opnieuw of neem direct contact met ons op.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="scholen-pilot-formulier">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* School/BSO Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School/BSO Naam *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Voer je instelling naam in"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jouw Naam *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="Je volledige naam"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jouw Functie *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Selecteer je functie</option>
                  <option value="leerkracht">Leerkracht</option>
                  <option value="hoofd-leerkracht">Hoofd Leerkracht</option>
                  <option value="coordinator">Programma Coördinator</option>
                  <option value="bso-leiding">BSO Leiding</option>
                  <option value="beheerder">Beheerder</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm"
                  placeholder="jouw.email@school.nl"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefoonnummer *
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
                  Stad + Postcode *
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
                  Gewenst Formaat *
                </label>
                <select
                  name="format"
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Selecteer formaat</option>
                  <option value="eenmalig">Eenmalige Workshop</option>
                  <option value="6-weken">6-Weken Programma</option>
                  <option value="maandelijks">Maandelijkse Club</option>
                  <option value="onzeker">Nog niet zeker</option>
                </select>
              </div>

              {/* Students per session */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leerlingen per Sessie *
                </label>
                <select
                  name="studentsPerSession"
                  required
                  value={formData.studentsPerSession}
                  onChange={(e) => setFormData({...formData, studentsPerSession: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm pr-8"
                >
                  <option value="">Selecteer groepsgrootte</option>
                  <option value="8-12">8-12 leerlingen</option>
                  <option value="13-18">13-18 leerlingen</option>
                  <option value="19-24">19-24 leerlingen</option>
                  <option value="varieert">Varieert</option>
                </select>
              </div>

              {/* Ages */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Leerling Leeftijden (selecteer alle die van toepassing zijn) *
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
                      <span className="text-sm text-gray-700">{age} jaar</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Earliest Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vroegst Mogelijke Datum *
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
                    Ik geef toestemming om foto's/video's van onze pilotsessie te gebruiken voor promotiedoeleinden (optioneel)
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Extra Opmerkingen
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  maxLength={500}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFA726] focus:border-transparent text-sm resize-none"
                  placeholder="Specifieke vereisten, vragen of doelen voor de pilotsessie? (max 500 tekens)"
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.notes.length}/500 tekens
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
                    <span>Indienen...</span>
                  </div>
                ) : (
                  'Vraag een Pilot Aan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}