// @flow
import * as React from 'react';
import {removeImage, toggleSelect} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";

import {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/app/(lang)/[lang]/ai/store";

type Props = {
};

export function ImageGallery(props: Props) {
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? {
        type: 'text', textPrompt: '', images: [], selected: [],
        approvalSet: [], dirtySinceLastModel: false, messages: [],
    };
    const selectedCount = (gen.selected ?? []).length;
    const dispatch = useDispatch();
    const selectedSet = useMemo(() => new Set(gen.selected ?? []), [gen.selected]);
    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">Images ({gen.images.length})</h2>
                <div className="text-sm text-gray-600">Selected: {selectedCount}</div>
            </div>
            {gen.images.length === 0 ? (
                <div className="text-sm text-gray-500">No images yet. Upload or drop files.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gen.images.map((img: any) => (
                        <figure key={img.id}
                                className={`relative group rounded-2xl overflow-hidden border ${selectedSet.has(img.id) ? 'ring-2 ring-black' : ''}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.meta?.name ?? 'image'} className="w-full h-40 object-cover" />

                            <div className="absolute inset-0 flex items-start justify-between p-2">
                                <button onClick={() => dispatch(toggleSelect(img.id))}
                                        className={`px-2 py-1 rounded-md text-xs shadow ${selectedSet.has(img.id) ? 'bg-black text-white' : 'bg-white/90'}`}>
                                    {selectedSet.has(img.id) ? 'Selected' : 'Select'}
                                </button>
                                <button onClick={() => dispatch(removeImage(img.id))}
                                        className="px-2 py-1 rounded-md text-xs bg-white/90 hover:bg-white shadow" title="Remove">
                                    Remove
                                </button>
                            </div>
                            {img.key && (
                                <figcaption className="absolute bottom-0 left-0 right-0 text-[10px] truncate bg-black/60 text-white px-2 py-1">
                                    {img.key}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            )}
        </section>

    );
};