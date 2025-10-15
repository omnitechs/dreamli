'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/app/(lang)/[lang]/ai/store';
import { useEffect } from 'react';
import { useMeshyStream } from './useMeshyStream';

/**
 * Stream-aware model manager
 * - Auto-resumes unfinished tasks
 * - Exposes generator.models + stream helpers
 */
export default function useModels() {
    const { streamExistingTask, resumeAll } = useMeshyStream();

    // ✅ all models stored in Redux generator slice
    const models =
        (useSelector((s: RootState) => (s as any)?.generator?.models) as any[]) ?? [];

    // ✅ re-attach SSE to unfinished tasks once on mount
    useEffect(() => {
        if (models?.length) resumeAll(models);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // expose helpers for UI components
    return {
        models,
        streamExistingTask,
    };
}
