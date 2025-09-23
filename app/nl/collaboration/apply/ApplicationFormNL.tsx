'use client';

import { useState } from 'react';

interface FormData {
  fullName: string;
  businessName: string;
  email: string;
  country: string;
  partnerType: 'manufacturer' | 'seller' | 'designer' | '';
  
  // Manufacturer fields
  capabilities: string[];
  productCategories: string[];
  productionCapacity: string;
  certifications: string;
  manufacturerFile: File | null;
  
  // Seller fields
  businessType: string;
  storeLocation: string;
  orderVolume: string;
  regionsServed: string[];
  
  // Designer fields
  designTypes: string[];
  portfolioLink: string;
  designerFile: File | null;
  originalWorkConfirm: boolean;
  
  // Final fields
  collaborationNotes: string;
  contactMethod: string;
  termsConsent: boolean;
  gdprConsent: boolean;
}

export default function ApplicationFormNL() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    businessName: '',
    email: '',
    country: '',
    partnerType: '',
    capabilities: [],
    productCategories: [],
    productionCapacity: '',
    certifications: '',
    manufacturerFile: null,
    businessType: '',
    storeLocation: '',
    orderVolume: '',
    regionsServed: [],
    designTypes: [],
    portfolioLink: '',
    designerFile: null,
    originalWorkConfirm: false,
    collaborationNotes: '',
    contactMethod: '',
    termsConsent: false,
    gdprConsent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = [
    'Nederland', 'Duitsland', 'België', 'Frankrijk', 'Verenigd Koninkrijk', 
    'Verenigde Staten', 'Canada', 'Australië', 'Anders'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentArray, value]);
    } else {
      handleInputChange(field, currentArray.filter(item => item !== value));
    }
  };

  const handleFileChange = (field: 'manufacturerFile' | 'designerFile', file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'Bestandsgrootte moet onder 10MB zijn' }));
      return;
    }
    handleInputChange(field, file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic info validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Volledige naam is verplicht';
    if (!formData.businessName.trim()) newErrors.businessName = 'Bedrijfsnaam is verplicht';
    if (!formData.email.trim()) newErrors.email = 'E-mail is verplicht';
    if (!formData.country) newErrors.country = 'Land is verplicht';
    if (!formData.partnerType) newErrors.partnerType = 'Partnertype is verplicht';

    // Partner type specific validation
    if (formData.partnerType === 'designer') {
      if (!formData.originalWorkConfirm) {
        newErrors.originalWorkConfirm = 'U moet bevestigen dat u rechten heeft op origineel werk';
      }
    }

    // Final fields validation
    if (formData.collaborationNotes.length > 300) {
      newErrors.collaborationNotes = 'Notities moeten onder 300 tekens zijn';
    }
    if (!formData.contactMethod) newErrors.contactMethod = 'Contactmethode is verplicht';
    if (!formData.termsConsent) newErrors.termsConsent = 'U moet akkoord gaan met de voorwaarden';
    if (!formData.gdprConsent) newErrors.gdprConsent = 'AVG-toestemming is vereist';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-2xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aanvraag Verzonden!</h2>
          <p className="text-gray-600 mb-6">
            Bedankt voor uw interesse in een partnerschap met Dreamli. We hebben uw aanvraag 
            ontvangen en zullen deze binnen 3-5 werkdagen beoordelen. U hoort binnenkort van ons!
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Nog Een Aanvraag Indienen
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Step 1 - Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Stap 1 — Basisinformatie</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volledige Naam *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Uw volledige naam"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrijfs-/Merknaam *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Uw bedrijfsnaam"
            />
            {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="uw@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land *
            </label>
            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8 appearance-none"
              >
                <option value="">Selecteer uw land</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Partnertype *
          </label>
          <div className="space-y-3">
            {[
              { value: 'manufacturer', label: 'Fabrikant' },
              { value: 'seller', label: 'Verkoper/Retailer' },
              { value: 'designer', label: 'Designer/Maker' }
            ].map(type => (
              <label key={type.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="partnerType"
                  value={type.value}
                  checked={formData.partnerType === type.value}
                  onChange={(e) => handleInputChange('partnerType', e.target.value)}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.partnerType && <p className="text-red-500 text-sm mt-1">{errors.partnerType}</p>}
        </div>
      </div>

      {/* Step 2 - Conditional Details */}
      {formData.partnerType && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Stap 2 — Details</h3>

          {/* Manufacturer Fields */}
          {formData.partnerType === 'manufacturer' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Mogelijkheden
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['3D Printen', 'Spuitgieten', 'Verpakking', 'Montage', 'Anders'].map(capability => (
                    <label key={capability} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.capabilities.includes(capability)}
                        onChange={(e) => handleCheckboxChange('capabilities', capability, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{capability}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Productcategorieën
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Kits', 'Speelgoed', 'Educatieve Producten', 'Accessoires', 'Anders'].map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.productCategories.includes(category)}
                        onChange={(e) => handleCheckboxChange('productCategories', category, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productiecapaciteit per Maand
                  </label>
                  <input
                    type="text"
                    value={formData.productionCapacity}
                    onChange={(e) => handleInputChange('productionCapacity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="bijv. 1000 stuks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificeringen (optioneel)
                  </label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="bijv. CE, EN71, ISO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bestand Uploaden (optioneel, max 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('manufacturerFile', e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG formaten geaccepteerd</p>
                {errors.manufacturerFile && <p className="text-red-500 text-sm mt-1">{errors.manufacturerFile}</p>}
              </div>
            </div>
          )}

          {/* Seller Fields */}
          {formData.partnerType === 'seller' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrijfstype
                </label>
                <div className="relative">
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8 appearance-none"
                  >
                    <option value="">Selecteer bedrijfstype</option>
                    <option value="online">Online</option>
                    <option value="brick-and-mortar">Fysieke Winkel</option>
                    <option value="both">Beide</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Winkel URL of Locatie
                </label>
                <input
                  type="text"
                  value={formData.storeLocation}
                  onChange={(e) => handleInputChange('storeLocation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Website URL of fysiek adres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maandelijks Bestelvolume
                </label>
                <div className="relative">
                  <select
                    value={formData.orderVolume}
                    onChange={(e) => handleInputChange('orderVolume', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8 appearance-none"
                  >
                    <option value="">Selecteer bestelvolume</option>
                    <option value="<50">Minder dan 50</option>
                    <option value="50-200">50 - 200</option>
                    <option value="200-500">200 - 500</option>
                    <option value="500+">500+</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Bediende Regio's
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Nederland', 'EU', 'VK', 'VS', 'Anders'].map(region => (
                    <label key={region} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.regionsServed.includes(region)}
                        onChange={(e) => handleCheckboxChange('regionsServed', region, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Designer Fields */}
          {formData.partnerType === 'designer' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Wat ontwerpt u?
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['3D Modellen', 'Illustraties', 'Verpakking', 'Educatieve Inhoud'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.designTypes.includes(type)}
                        onChange={(e) => handleCheckboxChange('designTypes', type, e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={(e) => handleInputChange('portfolioLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://uwportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Uploaden (optioneel, max 10MB)
                </label>
                <input
                  type="file"
                  accept=".zip,.pdf,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileChange('designerFile', e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">ZIP, PDF, PNG, JPG formaten geaccepteerd</p>
                {errors.designerFile && <p className="text-red-500 text-sm mt-1">{errors.designerFile}</p>}
              </div>

              <div>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.originalWorkConfirm}
                    onChange={(e) => handleInputChange('originalWorkConfirm', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                  />
                  <span className="ml-3 text-gray-700">
                    Ik bevestig dat dit mijn originele werk is of dat ik rechten heb om het te licentiëren. *
                  </span>
                </label>
                {errors.originalWorkConfirm && <p className="text-red-500 text-sm mt-1">{errors.originalWorkConfirm}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Final Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Laatste Details</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Samenwerkingsnotities
            </label>
            <textarea
              value={formData.collaborationNotes}
              onChange={(e) => handleInputChange('collaborationNotes', e.target.value)}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              placeholder="Vertel ons over uw samenwerkingsinteresses of vragen..."
            />
            <p className="text-sm text-gray-500 mt-1">{formData.collaborationNotes.length}/300 karakters</p>
            {errors.collaborationNotes && <p className="text-red-500 text-sm mt-1">{errors.collaborationNotes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voorkeur Contactmethode *
            </label>
            <div className="relative">
              <select
                value={formData.contactMethod}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8 appearance-none"
              >
                <option value="">Selecteer contactmethode</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefoon</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
            {errors.contactMethod && <p className="text-red-500 text-sm mt-1">{errors.contactMethod}</p>}
          </div>

          <div className="space-y-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsConsent}
                onChange={(e) => handleInputChange('termsConsent', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
              />
              <span className="ml-3 text-gray-700">
                Ik ga akkoord met Dreamli's Voorwaarden & Privacybeleid. *
              </span>
            </label>
            {errors.termsConsent && <p className="text-red-500 text-sm mt-1">{errors.termsConsent}</p>}

            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gdprConsent}
                onChange={(e) => handleInputChange('gdprConsent', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
              />
              <span className="ml-3 text-gray-700">
                Ik stem ermee in gecontacteerd te worden over mijn aanvraag. *
              </span>
            </label>
            {errors.gdprConsent && <p className="text-red-500 text-sm mt-1">{errors.gdprConsent}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg whitespace-nowrap"
        >
          Aanvraag Indienen
        </button>
      </div>
    </form>
  );
}