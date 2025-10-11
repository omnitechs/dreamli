// app/(lang)/[lang]/projects/[projectId]/components/ImagesGrid.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectState } from '../../types';
import { actionSelectImage, actionUnselectImage, actionDeleteImage } from '../actions';
import { Check, Trash2 } from 'lucide-react';

interface ImagesGridProps {
    images: Array<{ id?: string; url?: string; src?: string }>;
    selectedUrls: string[];          // server truth
    projectId: string;
    headId: string;
    onStateUpdate: (state: ProjectState) => void;
}

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
    let t: any;
    return (...args: Parameters<F>) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

export function ImagesGrid({ images, selectedUrls, projectId, headId, onStateUpdate }: ImagesGridProps) {
    const getImageUrl = (img: { url?: string; src?: string }) => img.url || img.src || '';

    // ---- server snapshot refs (for no-op checks)
    const serverSelectedRef = useRef<Set<string>>(new Set(selectedUrls));
    useEffect(() => {
        serverSelectedRef.current = new Set(selectedUrls);
    }, [selectedUrls]);

    // ---- optimistic local state
    const [localImages, setLocalImages] = useState(images);
    const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedUrls));

    useEffect(() => setLocalImages(images), [images]);
    useEffect(() => setLocalSelected(new Set(selectedUrls)), [selectedUrls]);

    // ---- per-image debounce / last-intent
    type Pending = { desiredSelected: boolean; seq: number };
    const pendings = useRef<Map<string, Pending>>(new Map());
    const seqRef = useRef(0);

    // single debounced sender per image key
    const senders = useRef<Map<string, (url: string, seq: number, desired: boolean) => void>>(new Map());

    const makeSender = (url: string) =>
        debounce(async (_url: string, seq: number, desired: boolean) => {
            // skip if final intent equals current server state
            const serverHas = serverSelectedRef.current.has(_url);
            if (serverHas === desired) {
                // clear pending entry
                const p = pendings.current.get(_url);
                if (p && p.seq === seq) pendings.current.delete(_url);
                return;
            }

            try {
                const updated = desired
                    ? await actionSelectImage(projectId, headId, _url)
                    : await actionUnselectImage(projectId, headId, _url);

                // ignore stale responses
                const p = pendings.current.get(_url);
                if (!p || p.seq !== seq) return;

                onStateUpdate(updated);
                pendings.current.delete(_url);
            } catch {
                // rollback this image only if still latest
                const p = pendings.current.get(_url);
                if (p && p.seq === seq) {
                    setLocalSelected((prev) => {
                        const next = new Set(prev);
                        desired ? next.delete(_url) : next.add(_url);
                        return next;
                    });
                    pendings.current.delete(_url);
                }
            }
        }, 250);

    const ensureSender = (url: string) => {
        if (!senders.current.has(url)) {
            senders.current.set(url, makeSender(url));
        }
        return senders.current.get(url)!;
    };

    const toggle = (imageUrl: string) => {
        const currentlySelected = localSelected.has(imageUrl);
        const desired = !currentlySelected;

        // optimistic flip
        setLocalSelected((prev) => {
            const next = new Set(prev);
            desired ? next.add(imageUrl) : next.delete(imageUrl);
            return next;
        });

        // record last intent + seq and schedule one send
        seqRef.current += 1;
        const mySeq = seqRef.current;
        pendings.current.set(imageUrl, { desiredSelected: desired, seq: mySeq });

        ensureSender(imageUrl)(imageUrl, mySeq, desired);
    };

    const handleDelete = (imageUrl: string) => {
        // optimistic remove
        const prevImages = localImages;
        setLocalImages((list) => list.filter((img) => getImageUrl(img) !== imageUrl));
        setLocalSelected((s) => {
            const c = new Set(s); c.delete(imageUrl); return c;
        });

        actionDeleteImage(projectId, headId, imageUrl)
            .then(onStateUpdate)
            .catch(() => {
                // rollback list
                setLocalImages(prevImages);
            });
    };

    if (localImages.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Images ({localImages.length})</h3>

            <div className="grid grid-cols-2 gap-3">
                {localImages.map((image, index) => {
                    const url = getImageUrl(image);
                    const isSelected = localSelected.has(url);

                    return (
                        <div
                            key={image.id || url || index}
                            className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgMTZDOC42ODYyOSAxNiA2IDEzLjMxMzcgNiAxMEM2IDYuNjg2MjkgOC42ODYyOSA0IDEyIDRDMTUuMzEzNyA0IDE4IDYuNjg2MjkgMTggMTBDMTggMTMuMzEzNyAxNS4zMTM3IDE2IDEyIDE2WiIgc3Ryb2tlPSIjOUNBNEFGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                                    }}
                                />
                            </div>

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all">
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggle(url)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                            isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                        title={isSelected ? 'Unselect' : 'Select'}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(url)}
                                        className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

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
