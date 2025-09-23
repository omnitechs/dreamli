
'use client';

import { useState } from 'react';

export default function StepInterface() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [previewComplete, setPreviewComplete] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelComplete, setModelComplete] = useState(false);
  const [styleInput, setStyleInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 25 * 1024 * 1024) { // 25MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        startPreviewGeneration();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 25 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        startPreviewGeneration();
      };
      reader.readAsDataURL(file);
    }
  };

  const startPreviewGeneration = () => {
    setPreviewProgress(0);
    setStatusMessage('Generating digital preview...');
    
    const interval = setInterval(() => {
      setPreviewProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPreviewComplete(true);
          setStatusMessage('');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const continueToStep2 = () => {
    setCurrentStep(2);
    startModelGeneration();
  };

  const startModelGeneration = () => {
    setModelProgress(0);
    setStatusMessage('Processing preview...');
    
    const messages = [
      'Processing preview...',
      'Creating 3D geometry...',
      'Optimizing for printing...'
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      setModelProgress(prev => {
        const newProgress = prev + Math.random() * 8;
        
        if (newProgress > 33 && messageIndex === 0) {
          messageIndex = 1;
          setStatusMessage(messages[1]);
        } else if (newProgress > 66 && messageIndex === 1) {
          messageIndex = 2;
          setStatusMessage(messages[2]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setModelComplete(true);
          setStatusMessage('');
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const sendStyleRequest = () => {
    if (styleInput.trim()) {
      // Here you would send the style request to your API
      setStyleInput('');
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? (
                  <i className="ri-check-line"></i>
                ) : (
                  '1'
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep >= 1 ? 'text-green-600' : 'text-gray-500'
              }`}>
                Upload & Preview
              </span>
            </div>
            
            <div className={`h-px flex-1 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {modelComplete ? (
                  <i className="ri-check-line"></i>
                ) : (
                  '2'
                )}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                currentStep >= 2 ? 'text-green-600' : 'text-gray-500'
              }`}>
                Create Your 3D Model
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload & Preview */}
        {currentStep === 1 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Side - Upload */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Image</h3>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:border-green-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-upload-cloud-2-line text-2xl text-gray-400"></i>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">Click to upload or drag image</p>
                      <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 25MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Preview */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Digital Preview</h3>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {!uploadedImage ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <i className="ri-image-line text-2xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-500">Upload an image to see the preview</p>
                  </div>
                ) : !previewComplete ? (
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${previewProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{statusMessage}</span>
                      <span className="text-sm font-medium text-green-600">{Math.round(previewProgress)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <img 
                        src={uploadedImage} 
                        alt="Preview" 
                        className="w-full max-h-48 object-contain rounded"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Describe the style you want (e.g., cartoon, realistic, watercolor)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={styleInput}
                          onChange={(e) => setStyleInput(e.target.value)}
                          placeholder="Enter style description..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={sendStyleRequest}
                          disabled={!styleInput.trim()}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          <i className="ri-send-plane-line"></i>
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={continueToStep2}
                      className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors whitespace-nowrap"
                    >
                      Continue to 3D Modeling
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Create 3D Model */}
        {currentStep === 2 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Side - Confirmed Preview */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Confirmed Preview</h3>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <img 
                  src={uploadedImage || ''} 
                  alt="Confirmed Preview" 
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Right Side - 3D Model Generation */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Generated 3D Model</h3>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {!modelComplete ? (
                  <div className="space-y-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${modelProgress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{statusMessage}</span>
                      <span className="text-sm font-medium text-green-600">{Math.round(modelProgress)}%</span>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        <i className="ri-information-line mr-2"></i>
                        Generation takes 2–5 minutes depending on complexity
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-900 rounded-lg p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                      <div className="relative text-center">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300"></div>
                        <div className="mt-6 space-y-2">
                          <div className="flex justify-center space-x-4 text-white/60">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <i className="ri-zoom-in-line"></i>
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <i className="ri-refresh-line"></i>
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <i className="ri-drag-move-line"></i>
                            </button>
                          </div>
                          <p className="text-white/80 text-sm">Click and drag to rotate</p>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors whitespace-nowrap">
                      Confirm and Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* About 3D Model Generation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">About 3D Model Generation</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <i className="ri-check-line text-green-500 mt-1"></i>
              <span className="text-sm text-gray-600">Your preview is converted directly to 3D model</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-check-line text-green-500 mt-1"></i>
              <span className="text-sm text-gray-600">Models optimized for safe printing</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-check-line text-green-500 mt-1"></i>
              <span className="text-sm text-gray-600">Realistic detail style for high-quality output</span>
            </div>
            <div className="flex items-start space-x-3">
              <i className="ri-check-line text-green-500 mt-1"></i>
              <span className="text-sm text-gray-600">Generation time: 2–5 minutes</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <i className="ri-shield-check-line text-green-500"></i>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-flag-line text-orange-500"></i>
              <span>Made in the Netherlands</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-truck-line text-blue-500"></i>
              <span>7–10 day delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
