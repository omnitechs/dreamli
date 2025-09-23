
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
    image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/618d433982e6a541bbed58f40346d0ad.webp',
    alt: 'Blonde girl with drawing and 3D toy'
  },
  {
    id: 2,
    image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/e9e64d632489530d3d9873d5ab3b0063.webp',
    alt: 'Boy with robot drawing and 3D toy'
  },
  {
    id: 3,
    image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d1b9f2c73d16581a1d3d8e47828f4689.webp',
    alt: 'Girl with elephant drawing and 3D toy'
  },
  {
    id: 4,
    image: 'https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/a56ecd490581a2e2b26e74b7fbb1e085.webp',
    alt: 'Boy with green robot drawing and 3D toy'
  }
];

export default function ScatteredCardGallery() {
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
