'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SimpleImageGalleryProps {
  images: {
    src: string;
    alt?: string;
    caption?: string;
  }[];
  className?: string;
}

export default function SimpleImageGallery({ images, className = '' }: SimpleImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-4 ${className}`}>
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt || `Gallery image ${index + 1}`}
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-zoom-in-line text-xl text-gray-700"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyPress}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-200"
              >
                <i className="ri-arrow-right-line text-xl"></i>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt || `Gallery image ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              priority
            />
          </div>

          {/* Caption */}
          {images[selectedImage].caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg max-w-md text-center">
              {images[selectedImage].caption}
            </div>
          )}

          {/* Touch/Mobile Instructions */}
          <div className="absolute bottom-4 right-4 text-white/70 text-xs md:hidden">
            Swipe to navigate
          </div>
        </div>
      )}
    </>
  );
}