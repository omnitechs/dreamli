'use client';

import { useState } from 'react';

interface ManufacturerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManufacturerModal({ isOpen, onClose }: ManufacturerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-time-line text-blue-600 text-2xl"></i>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Coming Soon!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Manufacturer partnerships will be launching in <strong>Q1 2026</strong>. 
            We're currently focusing on building our designer community first.
          </p>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}