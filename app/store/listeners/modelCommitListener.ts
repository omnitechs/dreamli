// app/(lang)/[lang]/ai/store/listeners/modelCommitListener.ts
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
    finalizeModelFromTask,
    upsertModel,
} from '@/app/store/slices/generatorSlice';
import { GeneratorModel3D } from "@/app/(lang)/[lang]/ai/types";
import { setHead, addOne as addCommit } from '@/app/store/slices/commitsSlice';
import { api } from '../../(lang)/[lang]/ai/services/api';
import { toSnapshot } from '../../(lang)/[lang]/ai/libs/snapshots';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

// --- helpers ---
const TERMINAL = new Set(['SUCCEEDED','FAILED','CANCELED']);
const isTerminal = (s?: string) => (s ? TERMINAL.has(s.toUpperCase()) : false);

// Per-project in-memory lock to prevent concurrent auto-commits
const commitLocks = new Map<string, boolean>(); // key: projectId

function sanitizeSnapshot<T>(snap: T): T {
    return JSON.parse(
        JSON.stringify(snap, (k, v) => (k === 'rawTask' ? undefined : v))
    );
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error !== null && 'status' in error;
}
function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === 'object' && error !== null && ('message' in (error as any) || 'name' in (error as any) || 'stack' in (error as any));
}

export const modelCommitListener = createListenerMiddleware();

modelCommitListener.startListening({
    actionCreator: finalizeModelFromTask,
    effect: async (action, { getState, dispatch }) => {
        const state = getState() as RootState;

        const gen = (state as any)?.generator as { models?: GeneratorModel3D[] } | undefined;
        if (!gen) return;

        const modelId = action.payload.id;
        const m = (gen.models ?? []).find((x) => x.id === modelId);
        if (!m) return;

        // Only auto-commit on SUCCEEDED
        if (!isTerminal(m.status) || m.status !== 'SUCCEEDED') return;

        // Determine parent HEAD and projectId
        const commitsState = (state as any)?.commits;
        const parentId: string | null = commitsState?.headId ?? null;
        let projectId = 'demo-project';
        if (parentId && commitsState?.entities?.[parentId]?.projectId) {
            projectId = commitsState.entities[parentId].projectId;
        } else if ((state as any)?.generator?.__meta?.projectId) {
            projectId = (state as any).generator.__meta.projectId;
        }

        // 1) If ANY OTHER model is still active, defer (do not commit yet)
        const othersActive = (gen.models ?? []).some(
            (x) => x.id !== modelId && !isTerminal(x.status)
        );
        if (othersActive) {
            // You can optionally tag the finished model so UI knows it's waiting:
            dispatch(upsertModel({ ...m, waitingForOthers: true } as any));
            return;
        }

        // 2) Prevent double commits if two finish nearly simultaneously
        if (commitLocks.get(projectId)) {
            return; // another auto-commit in flight; let that one win
        }
        commitLocks.set(projectId, true);

        try {
            // Build a snapshot that EXCLUDES in-flight models (defense-in-depth)
            // (At this point there should be none, but keep it robust.)
            const rawSnap = toSnapshot(gen as any);
            if (Array.isArray((rawSnap as any).models)) {
                (rawSnap as any).models = (rawSnap as any).models.filter((mm: any) => isTerminal(mm?.status));
            }
            const snapshot = sanitizeSnapshot(rawSnap);

            const result = await dispatch(
                api.endpoints.createCommit.initiate({
                    projectId,
                    parentId,
                    snapshot,
                    message: `Models finalized: ${new Date().toLocaleString()}`,
                })
            );

            if ('error' in result && result.error) {
                const err = result.error;
                if (isFetchBaseQueryError(err)) {
                    console.error('Auto-commit failed (fetchBaseQuery):', { status: err.status, data: (err as any).data });
                } else if (isSerializedError(err)) {
                    console.error('Auto-commit failed (serialized):', { name: err.name, message: err.message, stack: err.stack });
                } else {
                    console.error('Auto-commit failed (unknown):', err);
                }
                dispatch(upsertModel({ ...m, error: 'auto-commit-failed' } as any));
                return;
            }

            if ('data' in result && result.data) {
                const data: any = result.data;
                const newCommitId: string | undefined = data?.id;
                if (!newCommitId) {
                    console.error('Auto-commit failed: response missing id', data);
                    dispatch(upsertModel({ ...m, error: 'auto-commit-no-id' } as any));
                    return;
                }

                // Ensure commit exists, then move HEAD
                dispatch(addCommit(data));

                // 3) Update local generator models with localized assets from the saved commit snapshot
                try {
                    const locModels: any[] = Array.isArray((data as any)?.snapshot?.models)
                        ? (data as any).snapshot.models
                        : [];
                    for (const lm of locModels) {
                        if (!lm || typeof lm !== 'object') continue;
                        const id = String(lm.id || '');
                        if (!id) continue;
                        // Upsert localized URLs into the live generator state so the viewer/downloads use our blob links
                        dispatch(
                            upsertModel({
                                id,
                                modelUrls: lm.modelUrls || {},
                                textureUrls: Array.isArray(lm.textureUrls) ? lm.textureUrls : undefined,
                                thumbnailUrl: lm.thumbnailUrl,
                                localThumbnailUrl: lm.localThumbnailUrl,
                                previewVideoUrl: lm.previewVideoUrl,
                                sourceCommitId: newCommitId,
                                streaming: false,
                            } as any)
                        );
                    }
                } catch (e) {
                    console.warn('Failed to sync localized model URLs to generator state', e);
                }

                // 4) Mark ALL terminal models as linked to this commit so they never auto-commit again
                const terminalModels = (gen.models ?? []).filter((mm) => isTerminal(mm.status));
                for (const mm of terminalModels) {
                    if (!(mm as any).sourceCommitId) {
                        dispatch(upsertModel({ id: mm.id, sourceCommitId: newCommitId } as any));
                    }
                }

                dispatch(setHead(newCommitId));
            } else {
                console.error('Auto-commit failed: no data/no error discriminant', result);
                dispatch(upsertModel({ ...m, error: 'auto-commit-unknown' } as any));
            }
        } finally {
            commitLocks.delete(projectId);
        }
    },
});
