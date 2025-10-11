// app/(lang)/[lang]/projects/[projectId]/components/ModePromptCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { GeneratorSnapshot, ProjectState } from '../../types';
import { actionSetMode, actionSetPrompt } from '../actions';
import { AlignLeft, Image } from 'lucide-react';

interface ModePromptCardProps {
    generator: GeneratorSnapshot;
    projectId: string;
    headId: string;
    onStateUpdate: (state: ProjectState) => void;
}

/** Commit-immediately version, but race-safe: always uses the latest headId/mode. */
export function ModePromptCard({ generator, projectId, headId, onStateUpdate }: ModePromptCardProps) {
    const [saving, setSaving] = useState<null | 'mode' | 'prompt'>(null);

    // ---- IMPORTANT: keep live refs for headId and current server mode ----
    const headRef = useRef(headId);
    const serverModeRef = useRef<'text' | 'image'>(generator.type);

    useEffect(() => { headRef.current = headId; }, [headId]);
    useEffect(() => { serverModeRef.current = generator.type; }, [generator.type]);

    // serialize requests to keep order (optional but nice)
    const lockRef = useRef<Promise<any>>(Promise.resolve());
    const run = (fn: () => Promise<any>) => (lockRef.current = lockRef.current.finally(fn));

    const handleMode = async (mode: 'text' | 'image') => {
        // If the server already says we're in this mode *right now*, skip.
        if (mode === serverModeRef.current) return;

        setSaving('mode');
        try {
            await run(async () => {
                // ALWAYS use the latest head id at the moment of sending
                const updated = await actionSetMode(projectId, headRef.current, mode);
                onStateUpdate(updated);
                // after onStateUpdate, parent will pass fresh headId/generator; refs update via useEffect
            });
        } finally {
            setSaving(null);
        }
    };

    const handlePromptChange = async (val: string) => {
        setSaving('prompt');
        try {
            await run(async () => {
                const updated = await actionSetPrompt(projectId, headRef.current, val);
                onStateUpdate(updated);
            });
        } finally {
            setSaving(null);
        }
    };

    const isTextMode = generator.type === 'text';
    const isImageMode = generator.type === 'image';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Mode{isTextMode ? ' & Prompt' : ''}</h3>
                {saving && <span className="text-[11px] text-gray-500 px-2 py-0.5 border rounded">committing…</span>}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => handleMode('text')}
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
                    onClick={() => handleMode('image')}
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
                defaultValue={generator.textPrompt ?? ''}
                onChange={(e) => void handlePromptChange(e.target.value)} // commit each change
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
