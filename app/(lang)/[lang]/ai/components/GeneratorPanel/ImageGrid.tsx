// app/(lang)/[lang]/projects/[projectId]/components/ImagesGrid.tsx
'use client';

import { useEffect, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";

type Img = { id?: string; url?: string; src?: string; meta?: any };
const getUrl = (img: Img) => img.url || img.src || '';
const getId = (img: Img) => img.id || getUrl(img); // fallback to URL if no id yet

export function ImagesGrid() {
    const { images, selectedSet, setSelectedHandler, removeImageById } = useImages();

    const storeImages: Img[] = Array.isArray(images) && images.length ? images : (images ?? []);
    const [localImages, setLocalImages] = useState<Img[]>(storeImages);

    useEffect(() => {
        setLocalImages(storeImages);
    }, [storeImages]);

    const toggle = (img: Img) => {
        const id = String(getId(img));
        if (!id) return;
        const next = new Set(selectedSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedHandler(Array.from(next));
    };

    const handleDelete = (img: Img) => {
        const id = String(getId(img));
        if (!id) return;
        setLocalImages(prev => prev.filter(x => String(getId(x)) !== id));
        removeImageById(id);
    };

    if (localImages.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Images ({localImages.length})</h3>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {localImages.map((image, index) => {
                    const url = getUrl(image);
                    const id = String(getId(image));
                    const isSelected = selectedSet.has(id);
                    const cardKey = `${id}:${url}`; // remount on URL change

                    return (
                        <div
                            key={cardKey}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    key={url}
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgMTZDOC42ODYyOSAxNiA2IDEzLjMxMzcgNiAxMEM2IDYuNjg2MjkgOC42ODYyOSAwIDEyIDRDMTUuMzEzNyA0IDE4IDYuNjg2MjkgMTggMTBDMTggMTMuMzEzNyAxNS4zMTM3IDE2IDEyIDE2WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                                    }}
                                />
                            </div>

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all">
                                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggle(image)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                            isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                        title={isSelected ? 'Unselect' : 'Select'}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image)}
                                        className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {image?.meta?.status && (
                                    <div className="absolute bottom-1 left-1">
                                        <div className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
                                            {image.meta.status}
                                            {image?.meta?.streamId ? ` · ${String(image.meta.streamId).slice(0, 8)}` : ''}
                                        </div>
                                    </div>
                                )}

                                {isSelected && (
                                    <div className="absolute bottom-1 right-1">
                                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3" />
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
