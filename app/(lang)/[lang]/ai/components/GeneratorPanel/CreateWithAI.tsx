'use client';

import { useCallback, useEffect, useState } from 'react';
import useImages from '@/app/(lang)/[lang]/ai/hooks/useImages';
import { Wand2 } from 'lucide-react';

type ImgSize = '512x512' | '1024x1024' | '2048x2048';

export default function CreateWithAI() {
    const {
        buildHttpRefsFromSelection,
        generateAIImages,
        activeStreams,
        images,
    } = useImages();

    const [prompt, setPrompt] = useState('');
    const [size, setSize] = useState<ImgSize>('1024x1024');
    const [n, setN] = useState<number>(1);

    // ✅ refCount must be resolved asynchronously
    const [refCount, setRefCount] = useState(0);
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const refs = await buildHttpRefsFromSelection();
                if (alive) setRefCount(refs.length);
            } catch {
                if (alive) setRefCount(0);
            }
        })();
        return () => { alive = false; };
    }, [buildHttpRefsFromSelection, images]);

    const onGenerate = useCallback(async () => {
        const refs = await buildHttpRefsFromSelection(); // ✅ await here
        const streamId = await generateAIImages({ prompt, refs, size, n });
        // (optional) track UI status here if you want
    }, [prompt, size, n, buildHttpRefsFromSelection, generateAIImages]);

    return (
        <div className="pt-2 border-t border-gray-100 space-y-3" role="group" aria-labelledby="create-with-ai">
            <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span id="create-with-ai" className="text-sm font-medium text-gray-900">
          Create with AI
        </span>
            </div>

            <div className="flex flex-col gap-2">
                <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what to create (uses selected images as references)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value as ImgSize)}
                        className="px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    >
                        <option value="512x512">512×512</option>
                        <option value="1024x1024">1024×1024</option>
                        <option value="2048x2048">2048×2048</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600">Count</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={n}
                            onChange={(e) => setN(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onGenerate}
                        disabled={!prompt.trim()}
                        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        Generate
                    </button>
                </div>

                <p className="text-xs text-gray-500">
                    Using <span className="font-medium">{refCount}</span> selected reference image{refCount === 1 ? '' : 's'} (HTTPS only).
                </p>
            </div>

            {activeStreams.length > 0 && (
                <div className="mt-2 space-y-2">
                    <p className="text-xs font-medium text-gray-700">Active jobs</p>
                    <ul className="space-y-1">
                        {activeStreams.map((id) => (
                            <li key={id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                <div className="min-w-0">
                                    <p className="truncate text-xs text-gray-600">
                                        <span className="font-mono text-[10px] text-gray-500">{id.slice(0, 8)}</span>
                                        {' '}– Working…
                                    </p>
                                </div>
                                <div className="flex items-center gap-2" />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
