'use client';

import { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface ImageLightboxProps {
  images: {
    original: string;
    thumbnail: string;
    description?: string;
  }[];
  showThumbnails?: boolean;
  showPlayButton?: boolean;
  showBullets?: boolean;
}

export default function ImageLightbox({ 
  images, 
  showThumbnails = true, 
  showPlayButton = false,
  showBullets = true 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlide = (currentIndex: number) => {
    setCurrentIndex(currentIndex);
  };

  return (
    <div className="image-lightbox-container">
      <ImageGallery
        items={images}
        showThumbnails={showThumbnails}
        showPlayButton={showPlayButton}
        showBullets={showBullets}
        showNav={true}
        showFullscreenButton={true}
        useBrowserFullscreen={true}
        onSlide={handleSlide}
        lazyLoad={true}
        slideDuration={300}
        slideInterval={3000}
        additionalClass="custom-image-gallery"
      />
      
      <style jsx global>{`
        .image-lightbox-container .image-gallery {
          background: transparent;
        }
        
        .image-lightbox-container .image-gallery-slide {
          background: transparent;
        }
        
        .image-lightbox-container .image-gallery-image {
          max-height: 70vh;
          object-fit: contain;
          border-radius: 8px;
          cursor: pointer;
        }
        
        .image-lightbox-container .image-gallery-thumbnails {
          padding: 10px 0;
        }
        
        .image-lightbox-container .image-gallery-thumbnail {
          border: 2px solid transparent;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .image-lightbox-container .image-gallery-thumbnail.active {
          border-color: #3b82f6;
        }
        
        .image-lightbox-container .image-gallery-thumbnail:hover {
          border-color: #60a5fa;
        }
        
        .image-lightbox-container .image-gallery-icon {
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        .image-lightbox-container .image-gallery-icon:hover {
          color: #3b82f6;
        }
        
        .image-lightbox-container .image-gallery-fullscreen-button,
        .image-lightbox-container .image-gallery-play-button {
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          padding: 8px;
        }
        
        .image-lightbox-container .image-gallery-fullscreen-button:hover,
        .image-lightbox-container .image-gallery-play-button:hover {
          background: rgba(0,0,0,0.7);
        }
        
        @media (max-width: 768px) {
          .image-lightbox-container .image-gallery-image {
            max-height: 60vh;
          }
          
          .image-lightbox-container .image-gallery-thumbnails {
            display: none;
          }
          
          .image-lightbox-container .image-gallery-bullets {
            bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}