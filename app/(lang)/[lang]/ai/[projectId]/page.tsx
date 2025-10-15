'use client';

import { useParams } from 'next/navigation';
import { useGetCommitsQuery } from '@/app/(lang)/[lang]/ai/services/api';
import GeneratorPlayground from '@/app/(lang)/[lang]/ai/test';

export default function ProjectPage() {
    const { projectId } = useParams<{ projectId: string }>();

    const { isFetching, isError, isSuccess, error } = useGetCommitsQuery(
        { projectId },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    if (isError) {
        const e = error as any;
        const status = e?.status ?? e?.originalStatus ?? 'ERR';
        const details = e?.data ? JSON.stringify(e.data) : e?.error ?? 'Unknown error';
        return (
            <div className="p-6 text-red-600">
                Failed to load commits (status {status}): {details}
            </div>
        );
    }

    if (isFetching && !isSuccess) {
        return <div className="p-6">Loading…</div>;
    }

    return <GeneratorPlayground projectId={projectId} />;
}
