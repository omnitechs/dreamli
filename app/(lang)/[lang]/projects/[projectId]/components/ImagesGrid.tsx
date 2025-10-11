'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectState } from '../../types';
import {
    actionSelectImage,
    actionUnselectImage,
    actionDeleteImage,
} from '../actions';
import { enqueue } from '@/app/(lang)/[lang]/projects/state/RequestQueue';
import { Check, Trash2 } from 'lucide-react';

interface ImagesGridProps {
    images: Array<{ id?: string; url?: string; src?: string }>;
    selectedUrls: string[];          // server truth
    projectId: string;
    headId: string;                  // not used for mutations (avoid stale parent)
    onStateUpdate: (state: ProjectState) => void;
}

/** simple debounce */
function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
    let t: any;
    return (...args: Parameters<F>) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

export function ImagesGrid({
                               images,
                               selectedUrls,
                               projectId,
                               headId, // eslint-disable-line @typescript-eslint/no-unused-vars
                               onStateUpdate,
                           }: ImagesGridProps) {
    const getUrl = (img: { url?: string; src?: string }) => img.url || img.src || '';

    // ---------- server snapshot refs ----------
    const serverSelectedRef = useRef<Set<string>>(new Set(selectedUrls));
    useEffect(() => {
        serverSelectedRef.current = new Set(selectedUrls);
        // If we still have pending intents, merge them on top so UI doesn't revert
        if (pendingCountRef.current > 0) {
            setLocalSelected((prev) => {
                let merged = new Set(serverSelectedRef.current);
                for (const [url, desired] of pendingDesiredRef.current.entries()) {
                    if (desired === true) merged.add(url);
                    if (desired === false) merged.delete(url);
                }
                return merged;
            });
        } else {
            setLocalSelected(new Set(selectedUrls));
        }
    }, [selectedUrls]);

    // ---------- optimistic local state ----------
    const [localImages, setLocalImages] = useState(images);
    const [localSelected, setLocalSelected] = useState<Set<string>>(
        new Set(selectedUrls)
    );

    useEffect(() => {
        setLocalImages(images);
    }, [images]);

    // ---------- pending intents (guards against revert) ----------
    // url -> true (selected) | false (unselected)
    const pendingDesiredRef = useRef<Map<string, boolean>>(new Map());
    const pendingCountRef = useRef<number>(0);

    const addPending = (url: string, desired: boolean) => {
        if (!pendingDesiredRef.current.has(url)) pendingCountRef.current += 1;
        pendingDesiredRef.current.set(url, desired);
    };
    const resolvePending = (url: string) => {
        if (pendingDesiredRef.current.has(url)) {
            pendingDesiredRef.current.delete(url);
            pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
        }
    };
    const clearAllPending = () => {
        pendingDesiredRef.current.clear();
        pendingCountRef.current = 0;
    };

    // ---------- per-image debounce senders ----------
    type PendingMeta = { desired: boolean; seq: number };
    const BOUNCE_MS = 250;
    const pendings = useRef<Map<string, PendingMeta>>(new Map());
    const seqRef = useRef(0);

    const senders = useRef<
        Map<string, (url: string, seq: number, desired: boolean) => void>
    >(new Map());

    const makeSender = (url: string) =>
        debounce(async (_url: string, seq: number, desired: boolean) => {
            // If final desired equals current server truth, nothing to send
            const serverHas = serverSelectedRef.current.has(_url);
            if (serverHas === desired) {
                // still clear pending to stop merge overrides
                const pm = pendings.current.get(_url);
                if (pm && pm.seq === seq) {
                    pendings.current.delete(_url);
                    resolvePending(_url);
                }
                return;
            }

            await enqueue(projectId, async () => {
                try {
                    // do NOT pass headId (avoid stale-parent overwrites in service)
                    const updated = desired
                        ? await actionSelectImage(projectId, undefined as any, _url)
                        : await actionUnselectImage(projectId, undefined as any, _url);

                    // stale response guard
                    const pm = pendings.current.get(_url);
                    if (!pm || pm.seq !== seq) return updated;

                    // apply server state, but preserve other pending intents by merging
                    onStateUpdate(updated);
                    pendings.current.delete(_url);
                    resolvePending(_url);
                    return updated;
                } catch (e) {
                    // rollback only if this is still the latest intent
                    const pm = pendings.current.get(_url);
                    if (pm && pm.seq === seq) {
                        setLocalSelected((prev) => {
                            const next = new Set(prev);
                            desired ? next.delete(_url) : next.add(_url);
                            return next;
                        });
                        pendings.current.delete(_url);
                        resolvePending(_url);
                    }
                }
            });
        }, BOUNCE_MS);

    const ensureSender = (url: string) => {
        if (!senders.current.has(url)) {
            senders.current.set(url, makeSender(url));
        }
        return senders.current.get(url)!;
    };

    const toggle = (imageUrl: string) => {
        const currently = localSelected.has(imageUrl);
        const desired = !currently;

        // optimistic flip immediately
        setLocalSelected((prev) => {
            const next = new Set(prev);
            desired ? next.add(imageUrl) : next.delete(imageUrl);
            return next;
        });

        // remember pending intent (prevents later server snapshot from reverting)
        addPending(imageUrl, desired);

        // sequence & send (debounced per-image)
        seqRef.current += 1;
        const mySeq = seqRef.current;
        pendings.current.set(imageUrl, { desired, seq: mySeq });
        ensureSender(imageUrl)(imageUrl, mySeq, desired);
    };

    const handleDelete = async (imageUrl: string) => {
        // optimistic removal
        const prevImages = localImages;
        const prevSelected = localSelected;

        setLocalImages((list) => list.filter((img) => getUrl(img) !== imageUrl));
        setLocalSelected((s) => {
            const c = new Set(s);
            c.delete(imageUrl);
            return c;
        });
        // a delete nullifies any pending select/unselect for this url
        if (pendingDesiredRef.current.has(imageUrl)) {
            resolvePending(imageUrl);
            pendings.current.delete(imageUrl);
        }

        await enqueue(projectId, async () => {
            try {
                const updated = await actionDeleteImage(projectId, undefined as any, imageUrl);
                onStateUpdate(updated);
                return updated;
            } catch (e) {
                // rollback fully
                setLocalImages(prevImages);
                setLocalSelected(prevSelected);
                throw e;
            }
        });
    };

    if (localImages.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Images ({localImages.length})</h3>

            {/* smaller thumbnails: more columns = ~half size */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {localImages.map((image, index) => {
                    const url = getUrl(image);
                    const isSelected = localSelected.has(url);

                    return (
                        <div
                            key={image.id || url || index}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300'
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
                                        onClick={() => toggle(url)}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                            isSelected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                        }`}
                                        title={isSelected ? 'Unselect' : 'Select'}
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(url)}
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
