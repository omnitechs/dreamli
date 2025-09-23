
'use client';

import { useState } from 'react';

interface TimelineStep {
  id: number;
  title: string;
  icon: string;
  description: string;
  image: string;
  date: string;
  isVisible: boolean;
  completed: boolean;
}

interface CreationTimelineProps {
  isOwner?: boolean;
  isPreview?: boolean;
  isAdmin?: boolean;
  timelineVisibility?: { [key: number]: boolean };
  onVisibilityChange?: (stepId: number, visible: boolean) => void;
}

export default function CreationTimeline({
  isOwner = false,
  isPreview = false,
  isAdmin = false,
  timelineVisibility = {},
  onVisibilityChange
}: CreationTimelineProps) {
  const [steps, setSteps] = useState<TimelineStep[]>([
    {
      id: 1,
      title: 'Drawing Received',
      icon: 'ri-pencil-line',
      description: 'Your beautiful drawing has arrived and has stolen our hearts',
      image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/58302476f81ce005c42f0f651c9d3f94.jfif',
      date: 'June 15, 2024',
      completed: true,
      isVisible: timelineVisibility[1] ?? true
    },
    {
      id: 2,
      title: '3D Design Created',
      icon: 'ri-computer-line',
      description: 'Our designers transform the drawing into a detailed 3D model',
      image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/c92bbad9f05d6f8d199fe034c8cbee7d.png',
      date: 'November 16, 2024',
      completed: false,
      isVisible: timelineVisibility[2] ?? true
    },
    {
      id: 3,
      title: 'Printed & Painted',
      icon: 'ri-brush-line',
      description: 'Your Dreamli is 3D printed and lovingly hand-painted',
      image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/81963d9fc0186eb0ec9cec0d0a2dd373.jfif',
      date: 'June 20, 2024',
      completed: true,
      isVisible: timelineVisibility[3] ?? true
    }
  ]);

  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStepForUpload, setSelectedStepForUpload] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New timeline post creation state
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    icon: 'ri-star-line',
    date: new Date().toISOString().split('T')[0]
  });

  const iconOptions = [
    { value: 'ri-pencil-line', label: 'Drawing' },
    { value: 'ri-computer-line', label: 'Design' },
    { value: 'ri-brush-line', label: 'Painting' },
    { value: 'ri-scissors-line', label: 'Cutting' },
    { value: 'ri-hammer-line', label: 'Assembly' },
    { value: 'ri-gift-line', label: 'Packaging' },
    { value: 'ri-truck-line', label: 'Shipping' },
    { value: 'ri-star-line', label: 'Milestone' },
    { value: 'ri-heart-line', label: 'Special' },
    { value: 'ri-magic-line', label: 'Magic' }
  ];

  const toggleVisibility = (stepId: number) => {
    if (onVisibilityChange) {
      const step = steps.find(s => s.id === stepId);
      if (step) {
        onVisibilityChange(stepId, !step.isVisible);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!uploadFile || !selectedStepForUpload) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the step with new image
    setSteps(steps.map(step => 
      step.id === selectedStepForUpload 
        ? { ...step, image: uploadPreview || step.image }
        : step
    ));
    
    // Reset upload state
    setUploadFile(null);
    setUploadPreview(null);
    setSelectedStepForUpload(null);
    setShowUploadModal(false);
    setIsUploading(false);
  };

  const handleCreateTimelinePost = async () => {
    if (!newPost.title.trim() || !newPost.description.trim() || !uploadFile) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate image URL if no file uploaded
    let imageUrl = uploadPreview;
    if (!imageUrl) {
      imageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28newPost.title%20%20%20%20%20%20%20newPost.description%20%20%20%20dreamli%20creation%20process%20workshop%20crafting%29%7D&width=800&height=400&seq=timeline${Date.now()}&orientation=landscape`;
    }
    
    // Create new timeline step
    const newStep: TimelineStep = {
      id: Math.max(...steps.map(s => s.id)) + 1,
      title: newPost.title,
      icon: newPost.icon,
      description: newPost.description,
      image: imageUrl,
      date: new Date(newPost.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      completed: true,
      isVisible: true
    };
    
    // Add new step and sort by date
    setSteps(prevSteps => [...prevSteps, newStep].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    // Reset form
    setNewPost({
      title: '',
      description: '',
      icon: 'ri-star-line',
      date: new Date().toISOString().split('T')[0]
    });
    setUploadFile(null);
    setUploadPreview(null);
    setShowCreateModal(false);
    setIsUploading(false);
  };

  const openUploadModal = (stepId: number) => {
    setSelectedStepForUpload(stepId);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedStepForUpload(null);
    setUploadFile(null);
    setUploadPreview(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPost({
      title: '',
      description: '',
      icon: 'ri-star-line',
      date: new Date().toISOString().split('T')[0]
    });
    setUploadFile(null);
    setUploadPreview(null);
  };

  const visibleSteps = isPreview ? steps.filter(step => step.isVisible) : steps;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Creation Timeline</h2>

        <div className="flex items-center space-x-4">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-add-line"></i>
                  <span>Add Timeline Post</span>
                </div>
              </button>
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <i className="ri-admin-line mr-1"></i>
                Admin Mode
              </div>
            </>
          )}
          
          {isOwner && !isPreview && (
            <div className="text-sm text-gray-600">
              <i className="ri-information-line mr-1"></i>
              Set visibility for shared view
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {visibleSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Timeline line */}
            {index < visibleSteps.length - 1 && (
              <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-[#FFB6C1] to-[#B9E4C9]"></div>
            )}

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                      <i className={`${step.icon} text-2xl text-white`}></i>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{step.date}</span>

                        {isAdmin && (
                          <button
                            onClick={() => openUploadModal(step.id)}
                            className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors cursor-pointer"
                            title="Upload Image"
                          >
                            <i className="ri-upload-2-line text-blue-600 text-sm"></i>
                          </button>
                        )}

                        {isOwner && !isPreview && (
                          <button
                            onClick={() => toggleVisibility(step.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              step.isVisible
                                ? 'bg-green-100 hover:bg-green-200'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <i className={`${step.isVisible ? 'ri-eye-line text-green-600' : 'ri-eye-off-line text-gray-600'} text-sm`}></i>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{step.description}</p>

                    <div className="relative">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-48 object-cover object-center rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => {
                          setExpandedStep(expandedStep === step.id ? null : step.id);
                          setSelectedImage(step.image);
                        }}
                      />

                      <button
                        onClick={() => {
                          setExpandedStep(expandedStep === step.id ? null : step.id);
                          setSelectedImage(step.image);
                        }}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-lg"
                      >
                        <i className={`ri-${expandedStep === step.id ? 'close' : 'zoom-in'}-line text-lg text-gray-600`}></i>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => openUploadModal(step.id)}
                          className="absolute top-3 left-3 w-10 h-10 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer shadow-lg"
                          title="Replace Image"
                        >
                          <i className="ri-camera-line text-white text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Timeline Post Modal */}
      {showCreateModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Timeline Post</h3>
                <button
                  onClick={closeCreateModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Title *
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="e.g., Quality Check Complete"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newPost.title.length}/100 characters
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newPost.description}
                    onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                    placeholder="Describe this timeline step in detail..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {newPost.description.length}/500 characters
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Icon
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {iconOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setNewPost({...newPost, icon: option.value})}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          newPost.icon === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <i className={`${option.value} text-xl text-gray-600`}></i>
                        <div className="text-xs text-gray-500 mt-1">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Date
                  </label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="timeline-create-upload"
                    />
                    <label htmlFor="timeline-create-upload" className="cursor-pointer">
                      {uploadPreview ? (
                        <div className="space-y-4">
                          <img
                            src={uploadPreview}
                            alt="Upload preview"
                            className="w-full h-48 object-cover rounded-xl mx-auto"
                          />
                          <p className="text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <i className="ri-upload-cloud-2-line text-2xl text-gray-400"></i>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Click to upload timeline image</p>
                            <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeCreateModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTimelinePost}
                    disabled={!newPost.title.trim() || !newPost.description.trim() || !uploadFile || isUploading}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Timeline Post'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Modal (for existing posts) */}
      {showUploadModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Timeline Image</h3>
                <button
                  onClick={closeUploadModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {steps.find(s => s.id === selectedStepForUpload)?.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Upload a new image for this timeline step
                  </p>
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="timeline-upload"
                  />
                  <label htmlFor="timeline-upload" className="cursor-pointer">
                    {uploadPreview ? (
                      <div className="space-y-4">
                        <img
                          src={uploadPreview}
                          alt="Upload preview"
                          className="w-full h-32 object-cover rounded-xl mx-auto"
                        />
                        <p className="text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <i className="ri-upload-cloud-2-line text-2xl text-gray-400"></i>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Click to upload image</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Current Image Preview */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Current Image</h5>
                  <img
                    src={steps.find(s => s.id === selectedStepForUpload)?.image}
                    alt="Current"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={closeUploadModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadImage}
                    disabled={!uploadFile || isUploading}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      'Upload Image'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Image Modal */}
      {expandedStep && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setExpandedStep(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-white"></i>
            </button>

            <img
              src={selectedImage}
              alt="Expanded view"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
