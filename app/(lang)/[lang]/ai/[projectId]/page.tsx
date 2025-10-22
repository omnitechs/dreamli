'use client';

import { useParams } from 'next/navigation';
import { useGetCommitsQuery } from '@/app/(lang)/[lang]/ai/services/api';
import GeneratorPlayground from '@/app/(lang)/[lang]/ai/GeneratorPlayground';
import {useTranslations} from 'next-intl';

export default function ProjectPage() {
    const t = useTranslations('AI.Project');
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
                {t('error', {status: String(status), details: String(details)})}
            </div>
        );
    }

    if (isFetching && !isSuccess) {
        return <div className="p-6">{t('loading')}</div>;
    }

    return <GeneratorPlayground projectId={projectId} />;
}
