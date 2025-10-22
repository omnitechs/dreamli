'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import useCommit from '@/app/(lang)/[lang]/ai/hooks/useCommit';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import LazyGlb from '@/components/GlbViewer';
import {useMeshyStream} from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import useMode from "@/app/(lang)/[lang]/ai/hooks/useMode";
import {useTranslations} from 'next-intl';

export default function Build3DCard({ projectId }: { projectId: string }) {
    const [error, setError] = useState<string | null>(null);
    const { streamExistingTask,resumeAll ,startGenerationFromPrompt,isPending,startGenerationFromImage} = useMeshyStream();
    const {modeType} = useMode();
    console.log(modeType)
    const t = useTranslations('AI.Page.Build');

    return (
        <div className="rounded-xl border p-4 space-y-3 bg-white shadow-sm">
            <div className="font-medium text-gray-900 flex items-center gap-2">
                {t('title')}
            </div>

            <button
                onClick={modeType=="text" ? startGenerationFromPrompt : startGenerationFromImage}
                className="rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
            >
                {isPending ? t('generating') : t('generateBtn')}
            </button>

        </div>
    );
}
