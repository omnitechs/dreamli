import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { finalizeModelFromTask, upsertModel, type GeneratorModel3D } from '../slices/generatorSlice';
import { setHead } from '../slices/commitsSlice';
import { api } from '../../services/api';
import { toSnapshot } from '../../libs/snapshots';

export const modelCommitListener = createListenerMiddleware();

// Use actionCreator (NOT matcher) so TS knows payload type
modelCommitListener.startListening({
    actionCreator: finalizeModelFromTask,
    effect: async (action, { getState, dispatch }) => {
        const state = getState() as RootState;

        const gen = (state as any)?.generator as {
            models?: GeneratorModel3D[];
            // ...rest of generator fields if you want stricter typing
        };
        if (!gen) return;

        const modelId = action.payload.id; // <-- now typed
        const m = (gen.models ?? []).find((x) => x.id === modelId);
        if (!m) return;
        if (m.status !== 'SUCCEEDED') return;
        if (m.sourceCommitId) return;

        const snapshot = toSnapshot(gen as any);
        const parentId = (state as any)?.commits?.headId ?? null;

        try {
            const res = await dispatch(
                api.endpoints.createCommit.initiate({
                    projectId: 'demo-project', // adjust if needed
                    parentId,
                    snapshot,
                    message: `Model ${m.kind ?? ''} finished: ${new Date().toLocaleString()}`,
                })
            ).unwrap();

            const newCommitId: string | undefined = res?.id;
            if (newCommitId) {
                dispatch(upsertModel({ ...m, sourceCommitId: newCommitId }));
                dispatch(setHead(newCommitId));
            }
        } catch (e) {
            console.error('Auto-commit failed for finalized model:', e);
        }
    },
});
