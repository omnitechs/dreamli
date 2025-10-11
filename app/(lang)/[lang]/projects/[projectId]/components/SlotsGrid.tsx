// app/(lang)/[lang]/projects/[projectId]/components/SlotsGrid.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectState, SlotType } from '../../types';
import {
    actionAssignSlot,
    actionAssignSlotFromSelection,
    actionUnassignSlot,
    actionDeleteImage,
    actionCreateImages,
} from '../actions';
import { enqueue } from '@/app/(lang)/[lang]/projects/state/RequestQueue';
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
    headId: string; // kept for header display, but NOT used in mutations anymore
    onStateUpdate: (state: ProjectState) => void;
}

export function SlotsGrid({
                              designated,
                              images,
                              projectId,
                              headId, // eslint-disable-line @typescript-eslint/no-unused-vars
                              onStateUpdate,
                          }: SlotsGridProps) {
    const getUrl = (x?: { url?: string; src?: string } | null) => (x?.url || x?.src || null);

    const slots: { key: SlotType; label: string }[] = useMemo(
        () => [
            { key: 'front', label: 'Front' },
            { key: 'back', label: 'Back' },
            { key: 'side', label: 'Side' },
            { key: 'threeQuarter', label: '¾ View' },
            { key: 'top', label: 'Top' },
            { key: 'bottom', label: 'Bottom' },
        ],
        []
    );

    // ---- server snapshot (what parent says right now)
    const serverSlotUrlRef = useRef<Record<SlotType, string | null>>({
        front: getUrl(designated.front),
        back: getUrl(designated.back),
        side: getUrl(designated.side),
        threeQuarter: getUrl(designated.threeQuarter),
        top: getUrl(designated.top),
        bottom: getUrl(designated.bottom),
    });

    // ---- local optimistic mirror (what we render)
    const [localSlotUrl, setLocalSlotUrl] = useState<Record<SlotType, string | null>>(
        serverSlotUrlRef.current
    );

    // ---- track per-slot pending requests and recent local changes (cool-down)
    type Pending = { desiredUrl: string | null; seq: number };
    const pendings = useRef<Map<SlotType, Pending>>(new Map());
    const seqRef = useRef(0);

    const localChangedAtRef = useRef<Record<SlotType, number>>({
        front: 0,
        back: 0,
        side: 0,
        threeQuarter: 0,
        top: 0,
        bottom: 0,
    });
    const RECENT_MS = 800;

    // ---- per-slot desired state + timers for "bounce" coalescing
    const desiredUrlRef = useRef<Record<SlotType, string | null>>({
        front: serverSlotUrlRef.current.front,
        back: serverSlotUrlRef.current.back,
        side: serverSlotUrlRef.current.side,
        threeQuarter: serverSlotUrlRef.current.threeQuarter,
        top: serverSlotUrlRef.current.top,
        bottom: serverSlotUrlRef.current.bottom,
    });
    const timersRef = useRef<Record<SlotType, any>>({
        front: null,
        back: null,
        side: null,
        threeQuarter: null,
        top: null,
        bottom: null,
    });
    const BOUNCE_MS = 750; // send only the last change per slot within this window

    // ✅ Reconcile parent updates: only for slots with NO pending op and NOT changed very recently
    useEffect(() => {
        const nextServer: Record<SlotType, string | null> = {
            front: getUrl(designated.front),
            back: getUrl(designated.back),
            side: getUrl(designated.side),
            threeQuarter: getUrl(designated.threeQuarter),
            top: getUrl(designated.top),
            bottom: getUrl(designated.bottom),
        };
        serverSlotUrlRef.current = nextServer;

        const now = Date.now();
        setLocalSlotUrl((prev) => {
            const updated = { ...prev };
            for (const { key } of slots) {
                const pending = pendings.current.has(key);
                const recentlyChanged = now - (localChangedAtRef.current[key] || 0) < RECENT_MS;
                if (!pending && !recentlyChanged) {
                    updated[key] = nextServer[key];
                }
            }
            return updated;
        });
    }, [designated, slots]);

    // ---- dropdown UI state
    const [openDropdowns, setOpenDropdowns] = useState<Set<SlotType>>(new Set());
    const toggleDropdown = (slot: SlotType) => {
        setOpenDropdowns((prev) => {
            const ns = new Set(prev);
            ns.has(slot) ? ns.delete(slot) : ns.add(slot);
            return ns;
        });
    };

    // ---- per-slot scheduler: only 1 request after bounce window, last-intent wins
    const scheduleSend = (slot: SlotType, seq: number) => {
        if (timersRef.current[slot]) clearTimeout(timersRef.current[slot]);

        timersRef.current[slot] = setTimeout(async () => {
            timersRef.current[slot] = null;

            const desired = desiredUrlRef.current[slot];

            // no-op if desired equals current server truth
            if (serverSlotUrlRef.current[slot] === desired) {
                const p = pendings.current.get(slot);
                if (p && p.seq === seq) pendings.current.delete(slot);
                localChangedAtRef.current[slot] = 0;
                return;
            }

            // SERIALIZE this mutation with others for the same project
            await enqueue(projectId, async () => {
                let updated: ProjectState;

                // ⚠️ DO NOT pass headId; let server use the latest head
                if (desired === null) {
                    updated = await actionUnassignSlot(projectId, undefined as any, slot);
                } else {
                    updated = await actionAssignSlot(projectId, undefined as any, slot, desired);
                }

                // ignore stale response
                const p = pendings.current.get(slot);
                if (!p || p.seq !== seq) return updated;

                onStateUpdate(updated);

                // refresh server snapshot for this slot from response
                const newServerUrl =
                    (updated.generator?.designated as any)?.[slot]?.url ||
                    (updated.generator?.designated as any)?.[slot]?.src ||
                    null;

                serverSlotUrlRef.current[slot] = newServerUrl;

                // If still latest for this slot, adopt server value and clear pending + recent flags
                if (pendings.current.get(slot)?.seq === seq) {
                    setLocalSlotUrl((prev) => ({ ...prev, [slot]: newServerUrl }));
                    pendings.current.delete(slot);
                    localChangedAtRef.current[slot] = 0;
                    desiredUrlRef.current[slot] = newServerUrl;
                }

                return updated;
            });
        }, BOUNCE_MS);
    };

    // ---- optimistic setter: reflect instantly, record desired, coalesce send
    const assignSlotOptimistic = (slot: SlotType, url: string | null) => {
        // instantaneous local reflect
        setLocalSlotUrl((prev) => ({ ...prev, [slot]: url }));
        localChangedAtRef.current[slot] = Date.now();

        // record final desired and coalesce within bounce window
        desiredUrlRef.current[slot] = url;
        seqRef.current += 1;
        const mySeq = seqRef.current;
        pendings.current.set(slot, { desiredUrl: url, seq: mySeq });

        scheduleSend(slot, mySeq); // ONLY one request after BOUNCE_MS (per slot)
    };

    const handleAssignSlot = (slot: SlotType, imageUrl: string) => {
        assignSlotOptimistic(slot, imageUrl);
        setOpenDropdowns((prev) => {
            const ns = new Set(prev);
            ns.delete(slot);
            return ns;
        });
    };

    const handleAssignFromSelection = async (slot: SlotType) => {
        // Also run through the queue so it can't interleave with other slot mutations
        seqRef.current += 1;
        const mySeq = seqRef.current;
        pendings.current.set(slot, { desiredUrl: 'PENDING' as any, seq: mySeq });
        localChangedAtRef.current[slot] = Date.now();

        await enqueue(projectId, async () => {
            // ⚠️ DO NOT pass headId; let server use latest head
            const updated = await actionAssignSlotFromSelection(projectId, undefined as any, slot);

            // stale?
            if (pendings.current.get(slot)?.seq !== mySeq) return updated;

            onStateUpdate(updated);

            const newServerUrl =
                (updated.generator?.designated as any)?.[slot]?.url ||
                (updated.generator?.designated as any)?.[slot]?.src ||
                null;

            serverSlotUrlRef.current[slot] = newServerUrl;

            if (pendings.current.get(slot)?.seq === mySeq) {
                setLocalSlotUrl((prev) => ({ ...prev, [slot]: newServerUrl }));
                pendings.current.delete(slot);
                localChangedAtRef.current[slot] = 0;
                desiredUrlRef.current[slot] = newServerUrl;
            }

            setOpenDropdowns((prev) => {
                const ns = new Set(prev);
                ns.delete(slot);
                return ns;
            });

            return updated;
        });
    };

    const handleUnassignSlot = (slot: SlotType) => {
        assignSlotOptimistic(slot, null);
    };

    const handleDeleteSlotImage = async (slot: SlotType) => {
        const url = serverSlotUrlRef.current[slot];
        if (!url) return;

        const prev = localSlotUrl[slot];
        setLocalSlotUrl((prevMap) => ({ ...prevMap, [slot]: null }));
        localChangedAtRef.current[slot] = Date.now();
        desiredUrlRef.current[slot] = null;

        await enqueue(projectId, async () => {
            try {
                // ⚠️ DO NOT pass headId; let server use latest head
                const updated = await actionDeleteImage(projectId, undefined as any, url);
                onStateUpdate(updated);

                const newServerUrl =
                    (updated.generator?.designated as any)?.[slot]?.url ||
                    (updated.generator?.designated as any)?.[slot]?.src ||
                    null;

                serverSlotUrlRef.current[slot] = newServerUrl;

                if (!pendings.current.has(slot)) {
                    setLocalSlotUrl((prevMap) => ({ ...prevMap, [slot]: newServerUrl }));
                    localChangedAtRef.current[slot] = 0;
                    desiredUrlRef.current[slot] = newServerUrl;
                }
                return updated;
            } catch (e) {
                setLocalSlotUrl((prevMap) => ({ ...prevMap, [slot]: prev ?? null }));
                localChangedAtRef.current[slot] = 0;
                desiredUrlRef.current[slot] = serverSlotUrlRef.current[slot] ?? null;
                throw e;
            }
        });
    };

    // ---- (Optional) per-slot prompt -> generate & assign first output
    const [prompts, setPrompts] = useState<Record<SlotType, string>>({
        front: '',
        back: '',
        side: '',
        threeQuarter: '',
        top: '',
        bottom: '',
    });

    const handleGenerateForSlot = async (slot: SlotType) => {
        const prompt = (prompts[slot] || '').trim();
        if (!prompt) {
            alert('Enter a prompt for this slot.');
            return;
        }
        await enqueue(projectId, async () => {
            // ⚠️ DO NOT pass headId; let server use latest head
            const updated = await actionCreateImages(projectId, undefined as any, {
                prompt,
                n: 1,
                size: '1024x1024',
                assignSlot: slot,
            });
            onStateUpdate(updated);
            setPrompts((prev) => ({ ...prev, [slot]: '' }));
            return updated;
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Designated Slots</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map(({ key, label }) => {
                    const imageUrl = localSlotUrl[key];
                    const isDropdownOpen = openDropdowns.has(key);

                    return (
                        <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{label}</label>

                            <div className="relative">
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imageUrl} alt={`${label} view`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-1" />
                                            <span className="text-xs text-gray-400">Empty</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                {images.length > 0 && (
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleDropdown(key)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <span>Assign from images...</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
                                                {images.map((image, index) => {
                                                    const url = image.url || image.src;
                                                    if (!url) return null;
                                                    return (
                                                        <button
                                                            key={url + index}
                                                            onClick={() => handleAssignSlot(key, url)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={url} alt={`Image ${index + 1}`} className="w-8 h-8 object-cover rounded" />
                                                            <span className="truncate">Image {index + 1}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleAssignFromSelection(key)}
                                    className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                >
                                    From Sel
                                </button>

                                {imageUrl && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleUnassignSlot(key)}
                                            className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <X className="w-3 h-3" />
                                            Unassign
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlotImage(key)}
                                            className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                                            title="Delete image"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Optional per-slot prompt generator */}
                            <div className="space-y-1">
                                <label className="block text-xs text-gray-600">
                                    Prompt for {label} (uses up to 2 selected images as references if any)
                                </label>
                                <textarea
                                    rows={2}
                                    className="w-full text-xs border rounded px-2 py-1 resize-none"
                                    placeholder={`e.g., ${label.toLowerCase()} view, consistent with selected images…`}
                                    value={prompts[key] || ''}
                                    onChange={(e) => setPrompts((prev) => ({ ...prev, [key]: e.target.value }))}
                                />
                                <button
                                    onClick={() => handleGenerateForSlot(key)}
                                    className="w-full text-xs rounded px-3 py-1 border hover:bg-gray-50"
                                >
                                    Generate & Assign
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
