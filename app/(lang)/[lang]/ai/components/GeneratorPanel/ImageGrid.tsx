// app/(lang)/[lang]/projects/[projectId]/components/ImagesGrid.tsx
'use client';

import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { Check, Trash2 } from 'lucide-react';
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";



type Img = { id?: string; url?: string; src?: string };
const getUrl = (img: Img) => img.url || img.src || '';
const getId = (img: Img) => img.id || getUrl(img); // fallback to URL if no id yet (optimistic)

export function ImagesGrid() {
    const dispatch = useDispatch();
    const {images,selected,selectedSet,setSelectedHandler,removeImageById} = useImages()


    // Prefer Redux state; fall back to props if store empty (just in case)
    const storeImages: Img[] = Array.isArray(images) && images.length ? images : images ?? [];
    const storeSelectedIds: string[] =
        Array.isArray(selected) && selected.length
            ? selected
            : []; // ignore selectedUrls prop to avoid mixing ids/urls

    // Local view state mirrors the store for snappy UI (no server queue anymore)
    const [localImages, setLocalImages] = useState<Img[]>(storeImages);
    useEffect(() => setLocalImages(storeImages), [storeImages]);


    // Toggle by ID; if an image has no id yet (optimistic add), we fallback to its URL as a temporary id
    const toggle = (img: Img) => {
        const id = String(getId(img));
        if (!id) return;
        const next = new Set(selectedSet);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedHandler(Array.from(next));
    };

    // Delete image locally and in Redux store
    const handleDelete = (img: Img) => {
        const id = String(getId(img));
        if (!id) return;
        // local optimistic remove for instant UI
        setLocalImages((prev) => prev.filter((x) => String(getId(x)) !== id));
        // Redux remove
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

                    return (
                        <div
                            key={id || url || index}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgMTZDOC42ODYyOSAxNiA2IDEzLjMxMzcgNiAxMEM2IDYuNjg2MjkgOC42ODYyOSA0IDEyIDRDMTUuMzEzNyA0IDE4IDYuNjg2MjkgMTggMTBDMTggMTMuMzEzNyAxNS4zMTM3IDE2IDEyIDE2WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
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

                                {isSelected && (
                                    <div className="absolute bottom-1 left-1">
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
