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

// simple debounce helper
function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
    let t: any;
    return (...args: Parameters<F>) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

export function ModePromptCard({ generator, projectId, headId, onStateUpdate }: ModePromptCardProps) {
    // ---------- local optimistic state ----------
    const [localMode, setLocalMode] = useState<'text' | 'image'>(generator.type);
    const [prompt, setPrompt] = useState(generator.textPrompt ?? '');

    // current server mode ref (kept in sync with props)
    const serverModeRef = useRef<'text' | 'image'>(generator.type);

    // cosmetic hints (non-blocking)
    const [syncHint, setSyncHint] = useState<string | null>(null);
    const [savingPrompt, setSavingPrompt] = useState(false);

    // ---------- reconcile on external changes ----------
    useEffect(() => {
        serverModeRef.current = generator.type;
        setLocalMode(generator.type);
        setPrompt(generator.textPrompt ?? '');
        setSyncHint(null);
        pendingDesiredModeRef.current = null;
    }, [generator.type, generator.textPrompt, headId]);

    // ---------- MODE: coalesce & send only last intent ----------
    // last desired mode not yet sent
    const pendingDesiredModeRef = useRef<'text' | 'image' | null>(null);
    // increasing sequence for stale-response guard
    const seqRef = useRef(0);

    const sendMode = async (desired: 'text' | 'image', seq: number) => {
        try {
            const updated = await actionSetMode(projectId, headId, desired);
            // ignore stale responses
            if (seq === seqRef.current) {
                onStateUpdate(updated);
                setSyncHint(null);
            }
        } catch (e) {
            if (seq === seqRef.current) {
                // keep local optimistic UI; just show tiny hint (no blocking)
                setSyncHint('mode sync failed');
            }
        }
    };

    // debounce sender so rapid toggles collapse to just the last one
    const debouncedSendMode = useRef(
        debounce((desired: 'text' | 'image', seq: number) => {
            // ✅ NEW: if final desired mode already equals server mode, skip the call
            if (desired === serverModeRef.current) {
                if (seq === seqRef.current) {
                    setSyncHint(null);
                    pendingDesiredModeRef.current = null;
                }
                return;
            }
            void sendMode(desired, seq);
        }, 750) // your chosen delay
    ).current;

    const handleModeSwitch = (mode: 'text' | 'image') => {
        // if nothing pending and local already matches, do nothing
        if (mode === localMode && pendingDesiredModeRef.current === null) return;

        // optimistic flip immediately
        setLocalMode(mode);
        setSyncHint('syncing…');

        // remember last desired mode and schedule one send
        pendingDesiredModeRef.current = mode;
        seqRef.current += 1;
        const mySeq = seqRef.current;

        // any further flips before debounce window will cancel/replace this
        debouncedSendMode(mode, mySeq);
    };

    // ---------- PROMPT: background save (debounced) ----------
    const debouncedSavePrompt = useRef(
        debounce(async (next: string) => {
            setSavingPrompt(true);
            try {
                const updated = await actionSetPrompt(projectId, headId, next);
                onStateUpdate(updated);
            } catch {
                // rollback only the prompt text
                setPrompt(generator.textPrompt ?? '');
            } finally {
                setSavingPrompt(false);
            }
        }, 450)
    ).current;

    const onPromptBlur = () => {
        if (localMode !== 'text') return;
        if (prompt !== (generator.textPrompt ?? '')) debouncedSavePrompt(prompt);
    };

    const onPromptKeyDown = (e: React.KeyboardEvent) => {
        // Enter saves, Shift+Enter makes a new line
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            debouncedSavePrompt(prompt);
        }
    };

    const isTextMode = localMode === 'text';
    const isImageMode = localMode === 'image';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Mode{isTextMode ? ' & Prompt' : ''}</h3>
                {syncHint && (
                    <span className="text-[11px] text-gray-500 px-2 py-0.5 border rounded">{syncHint}</span>
                )}
            </div>

            {/* Mode Toggle — never disabled */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleModeSwitch('text')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${isTextMode ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                >
                    <AlignLeft className="w-4 h-4" />
                    Text mode
                </button>
                <button
                    onClick={() => handleModeSwitch('image')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${isImageMode ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                >
                    <Image className="w-4 h-4" />
                    Image mode
                </button>
            </div>

            {/* Prompt — ONLY in text mode. Background-save, non-blocking. */}
            {isTextMode && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Text Prompt</label>
                    <div className="relative">
            <textarea
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                    debouncedSavePrompt(e.target.value); // autosave in background
                }}
                onBlur={onPromptBlur}
                onKeyDown={onPromptKeyDown}
                placeholder="Describe what you want to create in 3D..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={3}
            />
                        {(prompt !== (generator.textPrompt ?? '') || savingPrompt) && (
                            <span className="absolute bottom-2 right-2 text-[11px] text-gray-500">saving…</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
