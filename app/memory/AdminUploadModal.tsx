
'use client';

import { useState } from 'react';

interface Post {
  title: string;
  content: string;
  image: string;
  video?: string;
  type: 'update' | 'milestone' | 'announcement';
}

interface AdminUploadModalProps {
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

export default function AdminUploadModal({ onClose, onSubmit }: AdminUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'update' as 'update' | 'milestone' | 'announcement',
    file: null as File | null,
    fileType: 'image' as 'image' | 'video'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload - in real implementation, upload to your storage service
      let imageUrl = '';
      let videoUrl = '';
      
      if (formData.file) {
        const timestamp = Date.now();
        const fileName = formData.file.name.toLowerCase();
        
        if (formData.file.type.startsWith('image/')) {
          const prompt = `${formData.title.toLowerCase()} ${formData.content.substring(0, 100).toLowerCase()} professional photography, high quality, bright lighting, detailed view`;
          imageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=600&height=400&seq=adminpost${timestamp}&orientation=landscape`;
        } else if (formData.file.type.startsWith('video/')) {
          // For videos, create a thumbnail image
          const prompt = `${formData.title} video thumbnail, professional workshop update, bright lighting, high quality photography`;
          imageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=600&height=400&seq=adminvideo${timestamp}&orientation=landscape`;
          // In real implementation, you would upload the video file and get its URL
          videoUrl = `video-${timestamp}-${fileName}`;
        } else {
          // For other files, use a generic image
          imageUrl = `https://readdy.ai/api/search-image?query=professional%20workshop%20update%20announcement%2C%20clean%20modern%20design%2C%20soft%20lighting&width=600&height=400&seq=adminpost${timestamp}&orientation=landscape`;
        }
      } else {
        // Generate image based on post content
        const prompt = `${formData.title} ${formData.content.substring(0, 100)} professional update announcement, workshop environment, high quality photography`;
        imageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D&width=600&height=400&seq=adminpost${Date.now()}&orientation=landscape`;
      }

      const post: Post = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        image: imageUrl,
        ...(videoUrl && { video: videoUrl })
      };

      onSubmit(post);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'update',
        file: null,
        fileType: 'image'
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 50 * 1024 * 1024) { // 50MB limit for videos
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      setFormData({ ...formData, file, fileType });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.size <= 50 * 1024 * 1024) {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      setFormData({ ...formData, file, fileType });
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const postTypeConfig = {
    update: {
      label: 'Progress Update',
      color: 'bg-blue-100 text-blue-800',
      icon: 'ri-information-line'
    },
    milestone: {
      label: 'Milestone',
      color: 'bg-green-100 text-green-800',
      icon: 'ri-flag-line'
    },
    announcement: {
      label: 'Announcement',
      color: 'bg-purple-100 text-purple-800',
      icon: 'ri-megaphone-line'
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Create Admin Post</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(postTypeConfig).map(([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type as any })}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      formData.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
                        <i className={`${config.icon} text-lg`}></i>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{config.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Production Started!, Quality Check Complete"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share updates about the creation process, milestones, or important announcements..."
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                rows={4}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Share details about the creation progress</p>
                <p className="text-xs text-gray-500">{formData.content.length}/500</p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo or Video (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <i className={`${
                    formData.file 
                      ? formData.fileType === 'video' 
                        ? 'ri-video-line text-purple-500' 
                        : 'ri-image-line text-green-500'
                      : 'ri-upload-cloud-2-line text-gray-400'
                  } text-2xl`}></i>
                </div>
                
                {formData.file ? (
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{formData.file.name}</p>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.fileType === 'video' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {formData.fileType === 'video' ? 'Video' : 'Image'}
                      </span>
                      <span className="text-xs text-gray-500">{getFileSize(formData.file.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, file: null })}
                      className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop a photo or video here, or click to select
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Images: PNG, JPG, GIF up to 10MB<br />
                      Videos: MP4, MOV, AVI up to 50MB
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.fileType === 'video' 
                  ? 'Upload videos to show creation progress in action. A thumbnail will be automatically generated.'
                  : 'If no image is uploaded, one will be automatically generated based on your post content'
                }
              </p>
            </div>

            {/* Preview */}
            {(formData.title || formData.content) && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${postTypeConfig[formData.type].color}`}>
                      {postTypeConfig[formData.type].label}
                    </div>
                    <span className="text-xs text-gray-500">Just now</span>
                    {formData.file && formData.fileType === 'video' && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center space-x-1">
                        <i className="ri-video-line text-xs"></i>
                        <span>Video</span>
                      </div>
                    )}
                  </div>
                  {formData.title && (
                    <h5 className="font-bold text-gray-800 mb-2">{formData.title}</h5>
                  )}
                  {formData.content && (
                    <p className="text-gray-600 text-sm">{formData.content}</p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim() || !formData.content.trim() || isUploading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </div>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
