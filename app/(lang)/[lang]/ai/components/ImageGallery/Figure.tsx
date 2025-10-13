// @flow
import * as React from 'react';
import {removeImage, toggleSelect} from "@/app/(lang)/[lang]/ai/store/slices/generatorSlice";
import {Image} from "@/app/(lang)/[lang]/ai/types";
import {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/app/(lang)/[lang]/ai/store";

type Props = {
    image: Image
};

export function Figure(props: Props) {
    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? {
        type: 'text', textPrompt: '', images: [], selected: [],
        approvalSet: [], dirtySinceLastModel: false, messages: [],
    };
    const dispatch = useDispatch();
    const selectedSet = useMemo(() => new Set(gen.selected ?? []), [gen.selected]);
    const {image} = props;
    return (
        <figure key={image.id}
                className={`relative group rounded-2xl overflow-hidden border ${selectedSet.has(image.id) ? 'ring-2 ring-black' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.meta?.name ?? 'image'} className="w-full h-40 object-cover" />

            <div className="absolute inset-0 flex items-start justify-between p-2">
                <button onClick={() => dispatch(toggleSelect(image.id))}
                        className={`px-2 py-1 rounded-md text-xs shadow ${selectedSet.has(image.id) ? 'bg-black text-white' : 'bg-white/90'}`}>
                    {selectedSet.has(image.id) ? 'Selected' : 'Select'}
                </button>
                <button onClick={() => dispatch(removeImage(image.id))}
                        className="px-2 py-1 rounded-md text-xs bg-white/90 hover:bg-white shadow" title="Remove">
                    Remove
                </button>
            </div>
            {image.key && (
                <figcaption className="absolute bottom-0 left-0 right-0 text-[10px] truncate bg-black/60 text-white px-2 py-1">
                    {image.key}
                </figcaption>
            )}
        </figure>
    );
};