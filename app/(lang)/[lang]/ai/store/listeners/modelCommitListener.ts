// app/(lang)/[lang]/ai/store/listeners/modelCommitListener.ts
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
    finalizeModelFromTask,
    upsertModel,
} from '../slices/generatorSlice';

import {GeneratorModel3D} from "@/app/(lang)/[lang]/ai/types";
import { setHead, addOne as addCommit } from '../slices/commitsSlice';
import { api } from '../../services/api';
import { toSnapshot } from '../../libs/snapshots';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

/** Type guard: is RTKQ FetchBaseQueryError */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error
    );
}

/** Type guard: is SerializedError */
function isSerializedError(error: unknown): error is SerializedError {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('message' in error || 'name' in error || 'stack' in error)
    );
}

function sanitizeSnapshot<T>(snap: T): T {
    // Drop non-JSON bits (e.g., rawTask, functions, Blobs).
    return JSON.parse(
        JSON.stringify(snap, (k, v) => {
            if (k === 'rawTask') return undefined;
            return v;
        })
    );
}

export const modelCommitListener = createListenerMiddleware();

// Use actionCreator so TS knows payload type of finalizeModelFromTask
modelCommitListener.startListening({
    actionCreator: finalizeModelFromTask,
    effect: async (action, { getState, dispatch }) => {
        const state = getState() as RootState;

        const gen = (state as any)?.generator as { models?: GeneratorModel3D[] };
        if (!gen) return;

        const modelId = action.payload.id;
        const m = (gen.models ?? []).find((x) => x.id === modelId);
        if (!m) return;
        if (m.status !== 'SUCCEEDED') return;     // only commit on success
        if (m.sourceCommitId) return;             // already linked to a commit

        // Build clean snapshot (includes finalized model)
        const rawSnapshot = toSnapshot(gen as any);
        const snapshot = sanitizeSnapshot(rawSnapshot);

        // Parent/head & projectId
        const commitsState = (state as any)?.commits;
        const parentId: string | null = commitsState?.headId ?? null;

        // Try deriving projectId from HEAD (if your commit entity stores it)
        let projectId = 'demo-project';
        if (parentId && commitsState?.entities?.[parentId]?.projectId) {
            projectId = commitsState.entities[parentId].projectId;
        }

        // Create commit via RTKQ; don't unwrap -> inspect result
        const result = await dispatch(
            api.endpoints.createCommit.initiate({
                projectId,
                parentId,
                snapshot,
                message: `Model ${m.kind ?? ''} finished: ${new Date().toLocaleString()}`,
            })
        );

        // Narrow error safely
        if ('error' in result && result.error) {
            const err = result.error;
            if (isFetchBaseQueryError(err)) {
                console.error('Auto-commit failed (fetchBaseQuery):', {
                    status: err.status,
                    // err.data can be unknown; log as-is for diagnostics
                    data: (err as any).data,
                });
            } else if (isSerializedError(err)) {
                console.error('Auto-commit failed (serialized):', {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                });
            } else {
                console.error('Auto-commit failed (unknown error):', err);
            }
            // Optionally annotate the model for UI
            dispatch(upsertModel({ ...m, error: 'auto-commit-failed' } as any));
            return;
        }

        // Success path
        if ('data' in result && result.data) {
            const data: any = result.data; // expect your /api/commits POST to return the full CommitsPanel
            const newCommitId: string | undefined = data?.id;

            if (!newCommitId) {
                console.error('Auto-commit failed: response missing id', data);
                dispatch(upsertModel({ ...m, error: 'auto-commit-no-id' } as any));
                return;
            }

            // Ensure the commit exists in the adapter before moving HEAD
            dispatch(addCommit(data));

            // Link model → commit & advance HEAD
            dispatch(upsertModel({ ...m, sourceCommitId: newCommitId }));
            dispatch(setHead(newCommitId));
        } else {
            // Extremely defensive fallback
            console.error('Auto-commit failed: no data/no error discriminant', result);
            dispatch(upsertModel({ ...m, error: 'auto-commit-unknown' } as any));
        }
    },
});
