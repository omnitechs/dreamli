
'use client';

import { useState, useEffect } from 'react';
import StyleSelector from './configurator/StyleSelector';
import ColorSelector from './configurator/ColorSelector';
import GlobalControls from './configurator/GlobalControls';
import StyleAControls from './configurator/StyleAControls';
import StyleBControls from './configurator/StyleBControls';
import StyleCControls from './configurator/StyleCControls';
import LivePreview from './configurator/LivePreview';
import PriceDisplay from './configurator/PriceDisplay';

export interface KeychainConfig {
  // Tab and basic info
  activeTab: 'name' | 'photo';
  text: string;
  name: string;
  
  // Style selection
  style: 'A' | 'B' | 'C';
  
  // Global settings
  maxSize: number;
  ringPosition: 'left' | 'right' | 'top' | 'custom';
  ringX: number;
  ringY: number;
  nfc: boolean;
  nfcEnabled: boolean;
  nfcUrl: string;
  
  // Colors
  colorMode: 'single' | 'two';
  primaryColor: string;
  secondaryColor: string;
  
  // Style A specific
  twoLines: boolean;
  line1: string;
  line2: string;
  fontA: string;
  textSize: number;
  lineSpacing: number;
  borderThickness: number;
  borderHeight: number;
  textHeight: number;
  ringEnabled: boolean;
  showRingA: boolean;
  outerDiameter: number;
  innerDiameter: number;
  ringHeightA: number;
  adjustX: number;
  adjustY: number;
  colorModeA: 'single' | 'two';
  singleColorA: string;
  baseColorA: string;
  textColorA: string;
  
  // Style B specific
  fontB: string;
  letterSize: number;
  spacingB: number;
  oddHeight: number;
  evenHeight: number;
  showRingB: boolean;
  ringSizeB: number;
  ringHeightB: number;
  ringXB: number;
  ringYB: number;
  useSingleColorB: boolean;
  generalColorB: string;
  ringColorB: string;
  letterColors: string[];
  letterOffsets: number[];
  
  // Style C specific
  fontC: string;
  letterSizeC: number;
  letterReliefHeight: number;
  blockHeight: number;
  blockWidth: number;
  blockLength: number;
  firstElementLink: boolean;
  chamferSize: number;
  outerDiameterC: number;
  innerDiameterC: number;
  linkHeight: number;
  separation: number;
  baseColorC: string;
  letterColorC: string;
  
  // Photo specific
  photo: File | null;
  resinThickness: number;
  cornerRadius: number;
}

const defaultConfig: KeychainConfig = {
  activeTab: 'name',
  text: '',
  name: '',
  style: 'A',
  maxSize: 103,
  ringPosition: 'left',
  ringX: 0,
  ringY: 0,
  nfc: false,
  nfcEnabled: false,
  nfcUrl: '',
  colorMode: 'single',
  primaryColor: '#3B82F6',
  secondaryColor: '#EF4444',
  twoLines: true,
  line1: '',
  line2: '',
  fontA: 'Archivo Black',
  textSize: 12,
  lineSpacing: 1.2,
  borderThickness: 2,
  borderHeight: 3,
  textHeight: 0.5,
  ringEnabled: true,
  showRingA: true,
  outerDiameter: 8,
  innerDiameter: 4,
  ringHeightA: 3,
  adjustX: 0,
  adjustY: 0,
  colorModeA: 'single',
  singleColorA: 'blue',
  baseColorA: 'blue',
  textColorA: 'white',
  fontB: 'Archivo Black',
  letterSize: 12,
  spacingB: 1.0,
  oddHeight: 4,
  evenHeight: 2,
  showRingB: true,
  ringSizeB: 8,
  ringHeightB: 3,
  ringXB: -10,
  ringYB: 0,
  useSingleColorB: true,
  generalColorB: 'blue',
  ringColorB: 'blue',
  letterColors: [],
  letterOffsets: [],
  fontC: 'Archivo Black',
  letterSizeC: 12,
  letterReliefHeight: 0,
  blockHeight: 8,
  blockWidth: 12,
  blockLength: 15,
  firstElementLink: false,
  chamferSize: 0.5,
  outerDiameterC: 6,
  innerDiameterC: 3,
  linkHeight: 4,
  separation: 2,
  baseColorC: 'blue',
  letterColorC: 'white',
  photo: null,
  resinThickness: 2,
  cornerRadius: 3
};

interface KeychainConfiguratorProps {
  onAddToCart?: (price: number) => void;
}

export default function KeychainConfigurator({ onAddToCart }: KeychainConfiguratorProps) {
  const [config, setConfig] = useState<KeychainConfig>(defaultConfig);
  const [activePanel, setActivePanel] = useState<'design' | 'style' | 'colors' | 'settings'>('design');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateConfig = (updates: Partial<KeychainConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    
    // Clear related errors when fields are updated
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  // Validation
  const validateConfig = () => {
    const newErrors: Record<string, string> = {};
    
    if (config.activeTab === 'name') {
      const nameText = config.text || config.name || config.line1;
      if (!nameText || nameText.trim().length === 0) {
        newErrors.text = 'Please enter a name';
      }
    } else if (config.activeTab === 'photo') {
      if (!config.photo) {
        newErrors.photo = 'Please upload a photo';
      }
      // Validate photo file type and size
      if (config.photo) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(config.photo.type)) {
          newErrors.photo = 'Please upload a valid image file (JPG, PNG, WEBP)';
        }
        if (config.photo.size > 10 * 1024 * 1024) { // 10MB limit
          newErrors.photo = 'File size must be less than 10MB';
        }
      }
    }
    
    if (config.nfcEnabled && (!config.nfcUrl || !config.nfcUrl.trim())) {
      newErrors.nfcUrl = 'Please enter a valid URL for NFC';
    }
    
    if (config.nfcEnabled && config.nfcUrl && !isValidUrl(config.nfcUrl)) {
      newErrors.nfcUrl = 'Please enter a valid URL (must start with http:// or https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return string.startsWith('http://') || string.startsWith('https://');
    } catch (_) {
      return false;  
    }
  };

  const isNameValid = (config.text || config.name || config.line1).length > 0;
  const isPhotoValid = config.photo !== null;
  const isConfigValid = config.activeTab === 'name' ? isNameValid : isPhotoValid;
  
  const basePrice = config.activeTab === 'name' ? 15 : 20;
  const nfcPrice = config.nfcEnabled ? 5 : 0;
  const totalPrice = basePrice + nfcPrice;

  const handleAddToCart = () => {
    if (validateConfig()) {
      onAddToCart?.(totalPrice);
    }
  };

  return (
    <section id="configurator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Your Custom Keychain</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your style and personalize every detail with our live preview
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-2">
            {/* Tab Selection */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => updateConfig({ activeTab: 'name' })}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  config.activeTab === 'name'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Name (€15)
              </button>
              <button
                onClick={() => updateConfig({ activeTab: 'photo' })}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  config.activeTab === 'photo'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Photo + Resin (€20)
              </button>
            </div>

            {/* Panel Navigation */}
            <div className="flex bg-gray-50 p-1 rounded-lg mb-6 overflow-x-auto">
              <button
                onClick={() => setActivePanel('design')}
                className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePanel === 'design'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-edit-line w-4 h-4 flex items-center justify-center inline mr-2"></i>
                Design
              </button>
              <button
                onClick={() => setActivePanel('style')}
                className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePanel === 'style'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-palette-line w-4 h-4 flex items-center justify-center inline mr-2"></i>
                Style
              </button>
              <button
                onClick={() => setActivePanel('colors')}
                className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePanel === 'colors'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-paint-brush-line w-4 h-4 flex items-center justify-center inline mr-2"></i>
                Colors
              </button>
              <button
                onClick={() => setActivePanel('settings')}
                className={`flex-1 min-w-0 py-2 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePanel === 'settings'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-settings-3-line w-4 h-4 flex items-center justify-center inline mr-2"></i>
                Settings
              </button>
            </div>

            {/* Panel Content */}
            <div className="bg-white rounded-lg border p-6 min-h-[400px]">
              {activePanel === 'design' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Design Your Keychain</h3>
                  
                  {config.activeTab === 'name' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Text
                        </label>
                        <input
                          type="text"
                          value={config.text}
                          onChange={(e) => updateConfig({ text: e.target.value, name: e.target.value })}
                          placeholder="Enter your text (English letters only)"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            errors.text ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxLength={20}
                        />
                        {errors.text && (
                          <p className="text-red-500 text-xs mt-1">{errors.text}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Only English letters and spaces • Max 20 characters
                        </p>
                      </div>
                      
                      <StyleSelector 
                        selected={config.style} 
                        onSelect={(style) => updateConfig({ style })} 
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Photo
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="photo-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              updateConfig({ photo: file });
                            }}
                          />
                          <label
                            htmlFor="photo-upload"
                            className={`block border-2 border-dashed ${
                              errors.photo ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer`}
                          >
                            {config.photo ? (
                              <div className="space-y-4">
                                <div className="mx-auto w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(config.photo)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{config.photo.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(config.photo.size / 1024 / 1024).toFixed(1)} MB
                                  </p>
                                </div>
                                <p className="text-xs text-blue-600">Click to change photo</p>
                              </div>
                            ) : (
                              <>
                                <i className="ri-image-add-line w-12 h-12 flex items-center justify-center mx-auto text-gray-400 mb-4"></i>
                                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                              </>
                            )}
                          </label>
                        </div>
                        {errors.photo && (
                          <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
                        )}
                      </div>

                      {/* Resin Settings for Photo */}
                      {config.photo && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                            <i className="ri-drop-line w-4 h-4 flex items-center justify-center text-blue-600"></i>
                            Resin Protection Settings
                          </h4>
                          
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-800 mb-3">
                              Your photo will be sealed in protective resin for durability and waterproofing.
                            </p>
                            
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="resinThickness" className="block text-sm font-medium text-gray-700 mb-2">
                                  Resin Thickness: {config.resinThickness}mm
                                </label>
                                <input
                                  id="resinThickness"
                                  type="range"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  value={config.resinThickness}
                                  onChange={(e) => updateConfig({ resinThickness: parseFloat(e.target.value) })}
                                  className="w-full cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>1mm (Minimal)</span>
                                  <span>5mm (Maximum)</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {config.resinThickness <= 2 ? 'Thin profile, basic protection' :
                                   config.resinThickness <= 3.5 ? 'Balanced protection and size' :
                                   'Maximum protection, thicker profile'}
                                </p>
                              </div>

                              <div>
                                <label htmlFor="cornerRadius" className="block text-sm font-medium text-gray-700 mb-2">
                                  Corner Style: {config.cornerRadius === 0 ? 'Square' : `${config.cornerRadius}mm radius`}
                                </label>
                                <input
                                  id="cornerRadius"
                                  type="range"
                                  min="0"
                                  max="10"
                                  step="0.5"
                                  value={config.cornerRadius}
                                  onChange={(e) => updateConfig({ cornerRadius: parseFloat(e.target.value) })}
                                  className="w-full cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Square</span>
                                  <span>Very Rounded</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {config.cornerRadius === 0 ? 'Sharp corners, modern look' :
                                   config.cornerRadius <= 5 ? 'Slightly rounded, comfortable grip' :
                                   'Very rounded, smooth feel'}
                                </p>
                              </div>
                              
                              <div className="bg-white rounded-md p-3 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <i className="ri-information-line w-4 h-4 flex items-center justify-center text-blue-600"></i>
                                  <span className="text-sm font-medium text-gray-900">Final Dimensions</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Base size: {config.maxSize}mm × {config.maxSize}mm<br/>
                                  With resin: {config.maxSize + (config.resinThickness * 2)}mm × {config.maxSize + (config.resinThickness * 2)}mm<br/>
                                  Total thickness: ~{3 + config.resinThickness}mm
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'style' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Style Settings</h3>
                  
                  {config.style === 'A' && (
                    <StyleAControls config={config} onUpdate={updateConfig} errors={errors} />
                  )}
                  {config.style === 'B' && (
                    <StyleBControls config={config} onUpdate={updateConfig} />
                  )}
                  {config.style === 'C' && (
                    <StyleCControls config={config} onUpdate={updateConfig} />
                  )}
                </div>
              )}

              {activePanel === 'colors' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Color Settings</h3>
                  
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button
                      onClick={() => updateConfig({ colorMode: 'single' })}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        config.colorMode === 'single'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Single Color
                    </button>
                    <button
                      onClick={() => updateConfig({ colorMode: 'two' })}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        config.colorMode === 'two'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Two Colors
                    </button>
                  </div>

                  {config.colorMode === 'single' ? (
                    <ColorSelector
                      label="Primary Color"
                      value={config.primaryColor}
                      onChange={(color) => updateConfig({ primaryColor: color })}
                    />
                  ) : (
                    <div className="space-y-4">
                      <ColorSelector
                        label="Primary Color"
                        value={config.primaryColor}
                        onChange={(color) => updateConfig({ primaryColor: color })}
                      />
                      <ColorSelector
                        label="Secondary Color"
                        value={config.secondaryColor}
                        onChange={(color) => updateConfig({ secondaryColor: color })}
                      />
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Global Settings</h3>
                  <GlobalControls config={config} onUpdate={updateConfig} errors={errors} />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview and Price */}
          <div className="space-y-6">
            {/* Live Preview */}
            <LivePreview config={config} />

            {/* Price and Add to Cart */}
            <PriceDisplay
              price={totalPrice}
              nfcEnabled={config.nfcEnabled}
              isValid={isConfigValid}
              onAddToCart={handleAddToCart}
            />

            {/* Quick Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Guide</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use the tabs above to switch between panels</li>
                <li>• Design: Add your text or photo</li>
                <li>• Style: Choose and customize your style</li>
                <li>• Colors: Pick your color scheme</li>
                <li>• Settings: Adjust size and extras</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
