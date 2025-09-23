
'use client';

import { useState, useEffect } from 'react';

interface UploadFormProps {
  onClose: () => void;
  type: string;
  pricingField: string;
}

interface PricingData {
  standardPrice: number;
  giftPackPrice: number;
  steamGiftPackPrice: number;
  steamPrice: number;
}

export default function UploadFormDE({ onClose, type, pricingField }: UploadFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    couponCode: '',
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Fetch pricing data on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('https://panel.dreamli.nl/api/admin/pricing/types');
        if (response.ok) {
          const data: PricingData = await response.json();
          // Read the price directly from the pricing field
          if (data[pricingField as keyof PricingData]) {
            setCurrentPrice(data[pricingField as keyof PricingData]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchPricing();
  }, [pricingField]);

  const t = {
    title: 'Zeichnung Hochladen',
    uploadLabel: 'Bild oder Video hochladen *',
    uploadText: 'Klicken Sie hier, um ein Bild oder Video hochzuladen',
    supportedFormats: 'Bilder: JPG, PNG, GIF | Videos: MP4, MOV, AVI (Max: 50MB)',
    childName: 'Name des Kindes',
    age: 'Alter',
    email: 'E-Mail-Adresse *',
    phone: 'Telefonnummer',
    couponCode: 'Gutscheincode',
    price: 'Preis',
    loadingPrice: 'Preis wird geladen...',
    guaranteeTitle: 'Ihre Zufriedenheit ist garantiert',
    guaranteeText: 'Wir warten auf Ihre Bestätigung bevor wir drucken. Sollten Sie nach 3 Überarbeitungen nicht zufrieden sein, erstatten wir Ihnen Ihr Geld zurück - ohne Fragen zu stellen.',
    orderButton: 'Jetzt bestellen',
    processingButton: 'Bestellung wird verarbeitet...',
    redirectingButton: 'Weiterleitung zum Checkout...',
    successTitle: 'Anfrage gesendet!',
    successMessage: 'Vielen Dank für Ihre Bestellung! Wir werden uns innerhalb von 24 Stunden mit einer Vorschau und Preisen zur Bestätigung bei Ihnen melden.',
    closeButton: 'Schließen',
    requiredError: 'Bitte füllen Sie alle Pflichtfelder aus.',
    fileSizeError: 'Die Dateigröße muss weniger als 50MB betragen.',
    serverError: 'Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.file) {
      setSubmitStatus(t.requiredError);
      return;
    }

    // File size validation (50MB limit)
    if (formData.file && formData.file.size > 50 * 1024 * 1024) {
      setSubmitStatus(t.fileSizeError);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone || '');
      submitData.append('child_name', formData.childName || '');
      submitData.append('child_age', formData.childAge || '');
      submitData.append('couponCode', formData.couponCode || '');
      submitData.append('language', 'de');
      submitData.append('type', type);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      const response = await fetch('https://panel.dreamli.nl/api/memories/create', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();

        // Check if we received Stripe checkout session data
        if (result.sessionUrl && result.id) {
          setSubmitStatus('redirecting');
          
          // Update button text to show redirecting
          const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (button) {
            button.textContent = t.redirectingButton;
          }
          
          // Small delay to show the "redirecting" status, then redirect
          setTimeout(() => {
            window.location.href = result.sessionUrl;
          }, 1000);
          
        } else {
          // Fallback: regular success message if no Stripe data
          setSubmitStatus('success');
          setFormData({ email: '', phone: '', childName: '', childAge: '', couponCode: '', file: null });
        }
      } else {
        const errorText = await response.text();
        setSubmitStatus(t.serverError + ` (Error ${response.status})`);
      }
    } catch (error) {
      setSubmitStatus(t.serverError + ' (Network Error)');
    } finally {
      // Only set isSubmitting to false if we're not redirecting
      if (submitStatus !== 'redirecting') {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      setSubmitStatus(''); // Clear any previous error messages
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSubmitStatus(''); // Clear any previous error messages
  };

  const getFileIcon = () => {
    if (!formData.file) return 'ri-upload-cloud-2-line';
    
    if (formData.file.type.startsWith('image/')) {
      return 'ri-image-line';
    } else if (formData.file.type.startsWith('video/')) {
      return 'ri-video-line';
    } else {
      return 'ri-file-line';
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determine button text based on status
  const getButtonText = () => {
    if (submitStatus === 'redirecting') return t.redirectingButton;
    if (isSubmitting) return t.processingButton;
    return t.orderButton;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t.title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          {submitStatus !== 'success' ? (
            <form id="dreamli-upload-de" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.uploadLabel}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#B9E4C9] transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <i className={`${getFileIcon()} text-2xl text-gray-400`}></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t.uploadText}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {t.supportedFormats}
                  </p>
                  <input
                    type="file"
                    name="file"
                    accept="image/*,video/*,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.webm"
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B9E4C9] file:text-gray-900 hover:file:bg-[#a8d9b8] file:cursor-pointer cursor-pointer"
                  />
                  {formData.file && (
                    <div className="text-sm text-[#B9E4C9] mt-2">
                      <p className="font-medium">{formData.file.name}</p>
                      <p className="text-xs text-gray-500">{getFileSize(formData.file.size)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-[#B9E4C9]/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{t.price}:</span>
                  {isLoadingPrices ? (
                    <span className="text-sm text-gray-500">{t.loadingPrice}</span>
                  ) : (
                    <span className="text-lg font-bold text-[#B9E4C9]">€{currentPrice}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.childName}
                  </label>
                  <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.age}
                  </label>
                  <input
                    type="number"
                    id="childAge"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleChange}
                    min="3"
                    max="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.couponCode}
                </label>
                <input
                  type="text"
                  id="couponCode"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="Gutscheincode eingeben"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                />
              </div>

              {submitStatus && submitStatus !== 'success' && submitStatus !== 'redirecting' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{submitStatus}</p>
                </div>
              )}

              {submitStatus === 'redirecting' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-blue-600">{t.redirectingButton}</p>
                  </div>
                </div>
              )}

              <div className="bg-[#F6EBD9] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-shield-check-line text-lg text-gray-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t.guaranteeTitle}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {t.guaranteeText}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'redirecting'}
                className="w-full bg-[#B9E4C9] text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-[#a8d9b8] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getButtonText()}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-2xl text-gray-900"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.successTitle}
              </h3>
              <p className="text-gray-600 mb-6">{t.successMessage}</p>
              <button
                onClick={onClose}
                className="bg-[#B9E4C9] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#a8d9b8] transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.closeButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
