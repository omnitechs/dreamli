
'use client';

import { useState } from 'react';
import { ProjectState, SlotType } from '../../types';
import { actionAssignSlot, actionAssignSlotFromSelection, actionUnassignSlot, actionDeleteImage } from '../actions';
import { ChevronDown, Trash2, X } from 'lucide-react';

interface SlotsGridProps {
  designated: {
    front?: { url?: string; src?: string } | null;
    back?: { url?: string; src?: string } | null;
    side?: { url?: string; src?: string } | null;
    threeQuarter?: { url?: string; src?: string } | null;
    top?: { url?: string; src?: string } | null;
    bottom?: { url?: string; src?: string } | null;
  };
  images: Array<{ id?: string; url?: string; src?: string }>;
  projectId: string;
  headId: string;
  onStateUpdate: (state: ProjectState) => void;
}

export function SlotsGrid({ designated, images, projectId, headId, onStateUpdate }: SlotsGridProps) {
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());
  const [openDropdowns, setOpenDropdowns] = useState<Set<SlotType>>(new Set());

  const slots: { key: SlotType; label: string }[] = [
    { key: 'front', label: 'Front' },
    { key: 'back', label: 'Back' },
    { key: 'side', label: 'Side' },
    { key: 'threeQuarter', label: '¾ View' },
    { key: 'top', label: 'Top' },
    { key: 'bottom', label: 'Bottom' }
  ];

  const getImageUrl = (image: { url?: string; src?: string } | null) => {
    if (!image) return null;
    return image.url || image.src || null;
  };

  const toggleDropdown = (slot: SlotType) => {
    const newOpen = new Set(openDropdowns);
    if (newOpen.has(slot)) {
      newOpen.delete(slot);
    } else {
      newOpen.add(slot);
    }
    setOpenDropdowns(newOpen);
  };

  const handleAssignSlot = async (slot: SlotType, imageUrl: string) => {
    const loadingKey = `${slot}-assign`;
    if (loadingStates.has(loadingKey)) return;

    setLoadingStates(prev => new Set(prev).add(loadingKey));
    try {
      const updatedState = await actionAssignSlot(projectId, headId, slot, imageUrl);
      onStateUpdate(updatedState);
      setOpenDropdowns(prev => {
        const newSet = new Set(prev);
        newSet.delete(slot);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to assign slot:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(loadingKey);
        return newSet;
      });
    }
  };

  const handleAssignFromSelection = async (slot: SlotType) => {
    const loadingKey = `${slot}-fromsel`;
    if (loadingStates.has(loadingKey)) return;

    setLoadingStates(prev => new Set(prev).add(loadingKey));
    try {
      const updatedState = await actionAssignSlotFromSelection(projectId, headId, slot);
      onStateUpdate(updatedState);
      setOpenDropdowns(prev => {
        const newSet = new Set(prev);
        newSet.delete(slot);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to assign from selection:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(loadingKey);
        return newSet;
      });
    }
  };

  const handleUnassignSlot = async (slot: SlotType) => {
    const loadingKey = `${slot}-unassign`;
    if (loadingStates.has(loadingKey)) return;

    setLoadingStates(prev => new Set(prev).add(loadingKey));
    try {
      const updatedState = await actionUnassignSlot(projectId, headId, slot);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to unassign slot:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(loadingKey);
        return newSet;
      });
    }
  };

  const handleDeleteSlotImage = async (slot: SlotType) => {
    const slotData = designated[slot];
    if (!slotData) return;

    const imageUrl = getImageUrl(slotData);
    if (!imageUrl) return;

    const loadingKey = `${slot}-delete`;
    if (loadingStates.has(loadingKey)) return;
    if (!confirm('Are you sure you want to delete this image? It will be removed from all slots and the image pool.')) return;

    setLoadingStates(prev => new Set(prev).add(loadingKey));
    try {
      const updatedState = await actionDeleteImage(projectId, headId, imageUrl);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(loadingKey);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Designated Slots</h3>

      <div className="grid grid-cols-2 gap-4">
        {slots.map(({ key, label }) => {
          const slotData = designated[key];
          const imageUrl = getImageUrl(slotData);
          const hasImage = !!imageUrl;
          const isDropdownOpen = openDropdowns.has(key);

          return (
            <div key={key} className="space-y-2">
              {/* Slot Label */}
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>

              {/* Slot Preview */}
              <div className="relative">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                  {hasImage ? (
                    <img
                      src={imageUrl}
                      alt={`${label} view`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-1" />
                      <span className="text-xs text-gray-400">Empty</span>
                    </div>
                  )}
                </div>

                {/* Loading Overlay */}
                {Array.from(loadingStates).some(state => state.startsWith(key)) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-1">
                {/* Assign Dropdown */}
                {images.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(key)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>Assign from images...</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                        {images.map((image, index) => {
                          const imgUrl = getImageUrl(image);
                          return (
                            <button
                              key={index}
                              onClick={() => imgUrl && handleAssignSlot(key, imgUrl)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                            >
                              <img
                                src={imgUrl}
                                alt={`Image ${index + 1}`}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span>Image {index + 1}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* From Selection Button */}
                <button
                  onClick={() => handleAssignFromSelection(key)}
                  disabled={loadingStates.has(`${key}-fromsel`)}
                  className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  From Sel
                </button>

                {/* Unassign/Delete Buttons */}
                {hasImage && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUnassignSlot(key)}
                      disabled={loadingStates.has(`${key}-unassign`)}
                      className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Unassign
                    </button>
                    <button
                      onClick={() => handleDeleteSlotImage(key)}
                      disabled={loadingStates.has(`${key}-delete`)}
                      className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Delete image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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
