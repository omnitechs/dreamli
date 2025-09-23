'use client';

import { useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const openZoom = () => {
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  return (
    <>
      <img 
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={openZoom}
      />
      
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeZoom}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-close-line text-2xl"></i>
              </div>
            </button>
            <img 
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}