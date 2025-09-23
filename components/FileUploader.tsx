
'use client';

import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export default function FileUploader({ 
  onFileSelect, 
  accept = '.stl',
  maxSize = 50 * 1024 * 1024 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    if (file.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Please select a valid STL file');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <i className="ri-upload-cloud-2-line text-4xl text-gray-400"></i>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload STL File
        </h3>
        
        <p className="text-gray-600 mb-4">
          Drag and drop your STL file here, or click to browse
        </p>
        
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          onClick={openFileDialog}
        >
          Choose File
        </button>
        
        <p className="text-sm text-gray-500 mt-2">
          Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
