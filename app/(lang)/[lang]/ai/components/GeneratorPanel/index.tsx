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

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onJobStarted = () => {
            // bring images section into view when a job starts
            setTimeout(() => {
                try {
                    const el = document.getElementById('ai-images-grid');
                    if (el && typeof el.scrollIntoView === 'function') {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else if (scrollRef.current) {
                        scrollRef.current.scrollTop = 0;
                    }
                } catch {}
            }, 100);
        };
        try { window.addEventListener('ai-images-job-started' as any, onJobStarted as any); } catch {}
        return () => { try { window.removeEventListener('ai-images-job-started' as any, onJobStarted as any); } catch {} };
    }, []);

    return (
        <div className="bg-white xl:h-full min-h-0 flex flex-col">
            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-6">
                {/* Mode & Prompt */}
                <ModePromptCard/>
                {isImageMode && (
                    <>
                        <UploadCard />
                        {images.length > 0 && <ImagesGrid/>}
                    </>
                )}
                <Build3DCard projectId={projectId} />
            </div>
        </div>
    );
}
