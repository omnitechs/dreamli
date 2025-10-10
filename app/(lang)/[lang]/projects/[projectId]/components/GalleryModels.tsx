// app/projects/[projectId]/components/ModelsGallery.tsx
'use client';

import { useEffect } from 'react';
import LazyGlb from "@/components/GlbViewer";

type ModelFormatUrls = {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
    [k: string]: string | undefined;
};

type GeneratorModel3D = {
    id: string;
    provider: 'meshy';
    taskId: string;
    kind: 'text' | 'image' | 'multi';
    stage?: 'preview' | 'refine';
    prompt?: string;
    imageUrls?: string[];
    modelUrls: ModelFormatUrls;
    textureUrls?: Array<Record<string, string>>;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    createdAt: string; // ISO
    sourceCommitId?: string;
};

export default function ModelsGallery({ models }: { models: GeneratorModel3D[] }) {
    // Load the custom element on the client

    if (!models?.length) {
        return (
            <div className="rounded-xl border p-4 text-sm opacity-70">
                No models yet. Generate one to see it here.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {models.map((m) => {
                const { glb, fbx, obj, usdz } = m.modelUrls || {};
                const previewSrc = glb; // <model-viewer> prefers glTF/GLB
                const created = new Date(m.createdAt).toLocaleString();

                return (
                    <div key={m.id} className="rounded-xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="font-medium">
                                    Model #{m.id.slice(0, 8)} — {m.kind}
                                    {m.stage ? ` / ${m.stage}` : ''}
                                </div>
                                <div className="text-xs opacity-70">
                                    Created: {created}
                                    {m.sourceCommitId ? ` • Source commit: ${m.sourceCommitId}` : ''}
                                </div>
                                {m.prompt ? (
                                    <div className="mt-1 text-xs italic opacity-70">“{m.prompt}”</div>
                                ) : null}
                            </div>
                            {/* downloads */}
                            <div className="flex flex-wrap gap-2">
                                {glb && (
                                    <a
                                        className="text-xs underline"
                                        href={glb}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Download GLB
                                    </a>
                                )}
                                {fbx && (
                                    <a className="text-xs underline" href={fbx} download target="_blank" rel="noreferrer">
                                        Download FBX
                                    </a>
                                )}
                                {obj && (
                                    <a className="text-xs underline" href={obj} download target="_blank" rel="noreferrer">
                                        Download OBJ
                                    </a>
                                )}
                                {usdz && (
                                    <a className="text-xs underline" href={usdz} target="_blank" rel="noreferrer">
                                        USDZ (iOS AR)
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Preview area */}
                        {previewSrc ? (
                            <div className="mt-3 overflow-hidden rounded-lg border">
                                <LazyGlb modelUrl={previewSrc}/>
                            </div>
                        ) : (
                            <div className="mt-3 rounded-lg border p-3 text-sm opacity-70">
                                No GLB available for inline preview. Use the download links above.
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
