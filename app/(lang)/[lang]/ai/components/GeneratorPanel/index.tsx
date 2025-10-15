'use client';

import { useEffect, useRef } from 'react';
import useModels from '@/app/(lang)/[lang]/ai/hooks/useModels';
import ModelsGallery from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModelGallery";
import Build3DCard from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/Build3DCard";
import useMode from "@/app/(lang)/[lang]/ai/hooks/useMode";
import {ModePromptCard} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ModePromptCard";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import {UploadCard} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/UploadCard";
import {ImagesGrid} from "@/app/(lang)/[lang]/ai/components/GeneratorPanel/ImageGrid"; // ✅ from new system


export function GeneratorPanel(props: {projectId: string}) {
    const {projectId} = props;

    // ✅ useModels for live Redux-based models
    const { models } = useModels();
    const {modeType} = useMode()
    const {images,selectedCount} = useImages()
    const isImageMode = modeType === "image";

    return (
        <div className="bg-white xl:h-screen flex flex-col">
            {/* Content */}
            <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Mode & Prompt */}
                <ModePromptCard/>

                {/* IMAGE MODE ONLY */}
                {isImageMode && (
                    <>
                        <UploadCard />

                        {images.length > 0 && (
                            <>
                                <ImagesGrid/>

                            </>
                        )}

                    </>
                )}

                {/* 3D Build + Models */}
                <Build3DCard projectId={projectId} />
                {/*<ModelsGallery/> /!* ✅ now dynamic *!/*/}
            </div>
        </div>
    );
}
