'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  image: string;
  alt: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    image: 'https://readdy.ai/api/search-image?query=Happy%20German%20child%20holding%20colorful%20STEAM%20robot%20drawing%20next%20to%20matching%203D%20printed%20toy%20figurine%2C%20educational%20STEM%20learning%20environment%2C%20bright%20classroom%20setting%2C%20engineering%20and%20technology%20focus%2C%20child%20development%20through%20creative%20play&width=400&height=500&seq=de-steam-1&orientation=portrait',
    alt: 'Kind mit STEAM-Roboter-Zeichnung und 3D-Spielzeug'
  },
  {
    id: 2,
    image: 'https://readdy.ai/api/search-image?query=German%20student%20with%20science%20experiment%20drawing%20and%20corresponding%203D%20model%2C%20laboratory%20educational%20setting%2C%20chemistry%20and%20physics%20learning%2C%20hands-on%20STEM%20education%2C%20colorful%20scientific%20illustration%20brought%20to%20life&width=400&height=500&seq=de-steam-2&orientation=portrait',
    alt: 'Schüler mit Wissenschafts-Zeichnung und 3D-Modell'
  },
  {
    id: 3,
    image: 'https://readdy.ai/api/search-image?query=German%20child%20with%20engineering%20bridge%20drawing%20and%20physical%203D%20model%2C%20construction%20and%20architecture%20learning%2C%20STEM%20education%20through%20building%20and%20design%2C%20educational%20toy%20transformation%20from%202D%20to%203D&width=400&height=500&seq=de-steam-3&orientation=portrait',
    alt: 'Kind mit Ingenieur-Brücken-Zeichnung und Modell'
  },
  {
    id: 4,
    image: 'https://readdy.ai/api/search-image?query=German%20learner%20with%20geometry%20drawing%20and%203D%20mathematical%20shape%2C%20mathematics%20visualization%2C%20spatial%20learning%20and%20geometry%20education%2C%20abstract%20mathematical%20concepts%20made%20tangible%20through%203D%20printing&width=400&height=500&seq=de-steam-4&orientation=portrait',
    alt: 'Lernender mit Geometrie-Zeichnung und 3D-Form'
  }
];

export default function SteamScatteredCardGalleryDE() {
  const [selectedId, setSelectedId] = useState(1);

  const getCardPosition = (id: number, isSelected: boolean) => {
    if (isSelected) {
      return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 10 };
    }

    const positions = {
      1: { x: -120, y: -80, rotate: -12, scale: 0.85, zIndex: 1 },
      2: { x: 150, y: -60, rotate: 8, scale: 0.8, zIndex: 2 },
      3: { x: -140, y: 100, rotate: -5, scale: 0.82, zIndex: 3 },
      4: { x: 130, y: 120, rotate: 15, scale: 0.78, zIndex: 4 }
    };

    return positions[id as keyof typeof positions] || { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 };
  };

  return (
    <div className="relative h-[500px] md:h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center overflow-hidden">
      <div className="relative w-80 h-96">
        {galleryItems.map((item) => {
          const isSelected = item.id === selectedId;
          const position = getCardPosition(item.id, isSelected);
          
          return (
            <motion.div
              key={item.id}
              className={`absolute cursor-pointer ${isSelected ? '' : 'hover:scale-105'}`}
              style={{ zIndex: position.zIndex }}
              animate={{
                x: position.x,
                y: position.y,
                rotate: position.rotate,
                scale: position.scale,
              }}
              whileHover={!isSelected ? { 
                rotate: position.rotate + (Math.random() > 0.5 ? 3 : -3),
                scale: position.scale + 0.05
              } : {}}
              whileTap={{ scale: isSelected ? 0.98 : position.scale - 0.05 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.6
              }}
              onClick={() => setSelectedId(item.id)}
            >
              <div className={`relative w-80 h-96 rounded-2xl overflow-hidden shadow-xl ${
                isSelected 
                  ? 'ring-4 ring-blue-500 ring-opacity-70' 
                  : 'ring-2 ring-white ring-opacity-50'
              }`}>
                {!isSelected && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 z-10 transition-opacity duration-300" />
                )}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}