// @flow
import * as React from 'react';
import usePrompt from "@/app/(lang)/[lang]/ai/hooks/usePrompt";

type Props = {

};

export function Prompt(props: Props) {
    const {prompt,updatePrompt} = usePrompt()
    return (
        <div className="bg-white rounded-2xl shadow p-4 border">
            <label className="block text-sm text-gray-600 mb-2">Text Prompt</label>
            <textarea value={prompt} onChange={(e) => updatePrompt(e.target.value)}
                      placeholder="Describe your idea…" className="w-full min-h-[90px] rounded-xl border p-3" />
        </div>
    );
};