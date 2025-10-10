'use client';

import { GeneratorSnapshot, ProjectState } from '../../types';
import { ModePromptCard } from './ModePromptCard';
import { UploadCard } from './UploadCard';
import { ImagesGrid } from './ImagesGrid';
import { SelectionToolbar } from './SelectionToolbar';
import { SlotsGrid } from './SlotsGrid';
import { Build3DCard } from './Build3DCard';

interface GeneratorPanelProps {
    generator: GeneratorSnapshot;
    headId: string;
    projectId: string;
    onStateUpdate: (state: ProjectState) => void;
}

export function GeneratorPanel({ generator, headId, projectId, onStateUpdate }: GeneratorPanelProps) {
    const isTextMode = generator.type === 'text';
    const isImageMode = generator.type === 'image';
    const selectedCount = generator.selectedUrls?.length || 0;
    const images = generator.images ?? [];

    return (
        <div className="bg-white xl:h-screen flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">Generator</h2>
                    {generator.dirtySinceLastModel && (
                        <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Unsaved changes
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 font-mono">
                    Head: {headId.substring(0, 12)}...
                </div>
            </div>

            {/* Generator Content */}
            <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Mode & (Prompt only in text mode) */}
                <ModePromptCard
                    generator={generator}
                    projectId={projectId}
                    headId={headId}
                    onStateUpdate={onStateUpdate}
                />

                {/* IMAGE MODE ONLY */}
                {isImageMode && (
                    <>
                        {/* Upload Images */}
                        <UploadCard
                            projectId={projectId}
                            headId={headId}
                            onStateUpdate={onStateUpdate}
                        />

                        {/* Images Grid */}
                        {images.length > 0 && (
                            <>
                                <ImagesGrid
                                    images={images}
                                    selectedUrls={generator.selectedUrls || []}
                                    projectId={projectId}
                                    headId={headId}
                                    onStateUpdate={onStateUpdate}
                                />

                                {/* Selection Toolbar */}
                                {selectedCount > 0 && (
                                    <SelectionToolbar
                                        selectedCount={selectedCount}
                                        projectId={projectId}
                                        headId={headId}
                                        onStateUpdate={onStateUpdate}
                                    />
                                )}
                            </>
                        )}

                        {/* Designated Slots */}
                        <SlotsGrid
                            designated={generator.designated}
                            images={images}
                            projectId={projectId}
                            headId={headId}
                            onStateUpdate={onStateUpdate}
                        />
                    </>
                )}

                {/* 3D Build (show in both modes) */}
                <Build3DCard projectId={projectId} headId={headId} />
            </div>
        </div>
    );
}
