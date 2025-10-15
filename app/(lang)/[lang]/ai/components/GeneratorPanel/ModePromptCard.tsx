// app/(lang)/[lang]/projects/[projectId]/components/ModePromptCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

import { AlignLeft, Image } from 'lucide-react';
import useMode from '@/app/(lang)/[lang]/ai/hooks/useMode';
import usePrompt from '@/app/(lang)/[lang]/ai/hooks/usePrompt';
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";



/** Redux version: race-safe UI, no server actions. */
export function ModePromptCard() {
    const { modeType, toggleMode } = useMode();
    const { prompt, updatePrompt } = usePrompt();

    // mimic the old "committing…" pill without server calls
    const [saving, setSaving] = useState<null | 'mode' | 'prompt'>(null);


    const setMode = async (target: 'text' | 'image') => {
        if (target === modeType) return;
        setSaving('mode');
        try {
            // your hook only toggles; toggle when different
            toggleMode();
        } finally {
            // brief visual feedback
            setTimeout(() => setSaving(null), 200);
        }
    };


    const isTextMode = modeType === 'text';
    const isImageMode = modeType === 'image';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Mode{isTextMode ? ' & Prompt' : ''}</h3>
                {saving && (
                    <span className="text-[11px] text-gray-500 px-2 py-0.5 border rounded">committing…</span>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setMode('text')}
                    disabled={saving !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${isTextMode ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}
            ${saving ? 'opacity-60 cursor-wait' : ''}`}
                >
                    <AlignLeft className="w-4 h-4" />
                    Text mode
                </button>

                <button
                    onClick={() => setMode('image')}
                    disabled={saving !== null}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${isImageMode ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}
            ${saving ? 'opacity-60 cursor-wait' : ''}`}
                >
                    <Image className="w-4 h-4" />
                    Image mode
                </button>
            </div>

            {isTextMode && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Text Prompt</label>
                    <div className="relative">
            <textarea
                value={prompt ?? ''}
                onChange={(event)=>updatePrompt(event.target.value)}
                placeholder="Describe what you want to create in 3D..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
                disabled={saving === 'prompt'}
            />
                        {saving === 'prompt' && (
                            <span className="absolute bottom-2 right-2 text-[11px] text-gray-500">committing…</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
