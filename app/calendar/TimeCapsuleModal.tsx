'use client';

import React from 'react';
import Image from 'next/image';

interface TimeCapsule {
  id: string;
  productName: string;
  childName: string;
  returnDate: string;
  code: string;
  coverImage: string;
  isActive: boolean;
}

interface TimeCapsuleModalProps {
  capsule: TimeCapsule | null;
  onClose: () => void;
}

export default function TimeCapsuleModal({ capsule, onClose }: TimeCapsuleModalProps) {
  if (!capsule) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const returnDate = new Date(dateStr);
    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days ago`, isPast: true };
    if (diffDays === 0) return { text: 'Today', isToday: true };
    if (diffDays === 1) return { text: 'Tomorrow', isTomorrow: true };
    return { text: `${diffDays} days from now`, isFuture: true };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const daysInfo = getDaysUntil(capsule.returnDate);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Time Capsule Details</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          {/* Cover Image */}
          <div className="relative mb-6">
            <Image
              src={capsule.coverImage}
              alt={capsule.title}
              width={600}
              height={300}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                Time Capsule
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{capsule.productName}</h2>
            <p className="text-lg text-gray-600">for {capsule.childName}</p>
          </div>

          {/* Return Date */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Return Date</h3>
              <p className="text-xl font-bold text-purple-900 mb-2">{formatDate(capsule.returnDate)}</p>
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                daysInfo.isPast ? 'bg-gray-200 text-gray-700' :
                daysInfo.isToday ? 'bg-yellow-200 text-yellow-800' :
                daysInfo.isTomorrow ? 'bg-orange-200 text-orange-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                <i className={`${
                  daysInfo.isPast ? 'ri-time-line' :
                  daysInfo.isToday ? 'ri-notification-line' :
                  'ri-hourglass-line'
                }`}></i>
                <span>{daysInfo.text}</span>
              </div>
            </div>
          </div>

          {/* Time Capsule Code */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-800">Time Capsule Code</h3>
              <button
                onClick={() => copyToClipboard(capsule.code)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <i className="ri-file-copy-line"></i>
                <span className="text-sm">Copy</span>
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <code className="text-2xl font-mono text-blue-900 text-center block tracking-wider">
                {capsule.code}
              </code>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-shield-check-line text-green-600"></i>
                <span className="font-medium text-gray-800">Status</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                capsule.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {capsule.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <i className="ri-calendar-check-line text-blue-600"></i>
                <span className="font-medium text-gray-800">Created</span>
              </div>
              <span className="text-gray-600">June 15, 2024</span>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-yellow-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Time Capsule Service</h4>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  This Dreamli is scheduled to be returned on the specified date as part of our magical time capsule service. 
                  The physical model will be safely stored and sent back to create a wonderful surprise experience.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
            <button
              onClick={() => {
                window.open(`/memory?id=${capsule.id}`, '_blank');
              }}
              className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              <div className="flex items-center justify-center space-x-2">
                <i className="ri-external-link-line"></i>
                <span>View Memory</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}