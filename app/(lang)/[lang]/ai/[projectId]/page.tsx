'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/(lang)/[lang]/ai/store';
import { useGetCommitsQuery } from '@/app/(lang)/[lang]/ai/services/api';
import {
    upsertMany,
    setHead,
    resetForProject as resetForProjectCommit,
} from '@/app/(lang)/[lang]/ai/store/slices/commitsSlice';
import {
    hydrateFromCommit,
    resetForProject as resetForProjectGenerator,
} from '@/app/(lang)/[lang]/ai/store/slices/generatorSlice';
import { fromSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import GeneratorPlayground from '@/app/(lang)/[lang]/ai/test';

type UUID = string;
type Commit = {
    id: UUID;
    projectId: UUID;
    parentId: UUID | null;
    snapshot: any;
    message?: string;
    createdAt: string;
};

export default function ProjectPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useDispatch();

    const rehydrated =
        useSelector((s: RootState) => (s as any)?._persist?.rehydrated ?? true);

    // generator meta for hydration checks
    const genMeta = useSelector(
        (s: RootState) =>
            (s as any)?.generator?.__meta as
                | { projectId?: string; loadedFromCommitId?: string; loadedAt?: string }
                | undefined
    );

    // commits state (to support clicking a commit)
    const commitsState = useSelector((s: RootState) => (s as any)?.commits) ?? {
        entities: {},
        selectedId: null,
        headId: null,
    };
    const entities = commitsState.entities as Record<string, Commit>;
    const selectedId = commitsState.selectedId as string | null;

    // fetch commits for this project
    const {
        data: apiCommits = [],
        isFetching,
        isSuccess,
        isError,
        error,
    } = useGetCommitsQuery({ projectId }, { skip: !projectId });

    // latest from the API response (server-sorted desc ideally)
    const latest: Commit | null = useMemo(
        () => (apiCommits.length ? apiCommits[0] : null),
        [apiCommits]
    );

    /** 1) On project change: flush generator + commits (fresh start) */
    useEffect(() => {
        if (!rehydrated || !projectId) return;
        if (genMeta?.projectId !== projectId) {
            dispatch(resetForProjectGenerator({ projectId }));
            dispatch(resetForProjectCommit({ projectId }));
        }
    }, [rehydrated, projectId, genMeta?.projectId, dispatch]);

    /** 2) Sync commits list into slice */
    useEffect(() => {
        if (!apiCommits.length) return;
        // replace/merge server truth
        dispatch(upsertMany(apiCommits));

        // set head only if user hasn't picked a specific commit yet
        if (!selectedId && latest) {
            dispatch(setHead(latest.id));
        }
    }, [apiCommits, latest, selectedId, dispatch]);

    /** 3) Hydrate generator from the EFFECTIVE commit:
     *    preferred = selected commit; fallback = head/latest
     */
    const effectiveCommit: Commit | null = useMemo(() => {
        if (selectedId && entities[selectedId]) return entities[selectedId];
        return latest;
    }, [selectedId, entities, latest]);

    const hydratedCommitRef = useRef<string | null>(null);
    useEffect(() => {
        if (!rehydrated) return;
        if (!effectiveCommit) return;

        const commitId = effectiveCommit.id;
        const shouldHydrate =
            hydratedCommitRef.current !== commitId ||
            genMeta?.projectId !== projectId ||
            genMeta?.loadedFromCommitId !== commitId;

        if (shouldHydrate) {
            const snap = fromSnapshot(effectiveCommit.snapshot);
            dispatch(
                hydrateFromCommit({
                    projectId,
                    commitId,
                    snapshot: snap,
                })
            );
            hydratedCommitRef.current = commitId;
        }
    }, [
        rehydrated,
        effectiveCommit?.id,
        effectiveCommit?.snapshot,
        projectId,
        genMeta?.projectId,
        genMeta?.loadedFromCommitId,
        dispatch,
    ]);

    // friendly error UI
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

    if (isFetching && !isSuccess) return <div className="p-6">Loading…</div>;

    return <GeneratorPlayground projectId={projectId} />;
}
