
'use client';

import { useState } from 'react';
import { ProjectState } from '../../types';
import { actionSelectImage, actionUnselectImage, actionDeleteImage } from '../actions';
import { Check, Trash2 } from 'lucide-react';

interface ImagesGridProps {
  images: Array<{ id?: string; url?: string; src?: string }>;
  selectedUrls: string[];
  projectId: string;
  headId: string;
  onStateUpdate: (state: ProjectState) => void;
}

export function ImagesGrid({ images, selectedUrls, projectId, headId, onStateUpdate }: ImagesGridProps) {
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());

  const getImageUrl = (image: { url?: string; src?: string }) => {
    return image.url || image.src || '';
  };

  const handleToggleSelection = async (imageUrl: string) => {
    if (loadingStates.has(imageUrl)) return;

    setLoadingStates(prev => new Set(prev).add(imageUrl));
    try {
      const isSelected = selectedUrls.includes(imageUrl);
      const updatedState = isSelected 
        ? await actionUnselectImage(projectId, headId, imageUrl)
        : await actionSelectImage(projectId, headId, imageUrl);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to toggle selection:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (loadingStates.has(imageUrl)) return;
    if (!confirm('Are you sure you want to delete this image?')) return;

    setLoadingStates(prev => new Set(prev).add(imageUrl));
    try {
      const updatedState = await actionDeleteImage(projectId, headId, imageUrl);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Images ({images.length})</h3>

      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image);
          const isSelected = selectedUrls.includes(imageUrl);
          const isLoading = loadingStates.has(imageUrl);

          return (
            <div
              key={image.id || index}
              className={`
                relative group rounded-xl overflow-hidden border-2 transition-all
                ${isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${isLoading ? 'opacity-50' : ''}
              `}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                  }}
                />
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Selection Toggle */}
                  <button
                    onClick={() => handleToggleSelection(imageUrl)}
                    disabled={isLoading}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title={isSelected ? 'Unselect' : 'Select'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteImage(imageUrl)}
                    disabled={isLoading}
                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute bottom-2 left-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
