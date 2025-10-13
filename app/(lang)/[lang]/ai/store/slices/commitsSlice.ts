import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export type UUID = string;

export interface Commit {
    id: UUID;
    projectId: UUID;
    parentId: UUID | null;
    snapshot: any;
    createdAt: string;
    message?: string;
}

const adapter = createEntityAdapter<Commit>({
    sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
});

type Meta = { projectId: string | null; lastSyncedAt?: string | null };

const initial = adapter.getInitialState<{
    headId: UUID | null;
    selectedId: UUID | null;
    __meta: Meta;
}>({
    headId: null,
    selectedId: null,
    __meta: { projectId: null, lastSyncedAt: null },
});

const slice = createSlice({
    name: 'commits',
    initialState: initial,
    reducers: {
        // NEW: replace everything with server truth
        setAll: adapter.setAll,

        // keep existing APIs
        upsertMany: adapter.upsertMany,
        addOne: adapter.addOne,

        setHead(state, action) {
            state.headId = action.payload;
            state.selectedId = action.payload;
        },
        selectCommit(state, action) {
            state.selectedId = action.payload;
        },

        // NEW: reset when switching project (prevents leaking old project commits)
        resetForProject(state, action) {
            const projectId = action.payload as string;
            const cleared = adapter.getInitialState({
                headId: null,
                selectedId: null,
                __meta: { projectId, lastSyncedAt: null },
            });
            Object.assign(state, cleared);
        },

        // NEW: mark we synced from server for this project
        markSynced(state, action) {
            state.__meta.projectId = action.payload as string;
            state.__meta.lastSyncedAt = new Date().toISOString();
        },
    },
});

export const commitsReducer = slice.reducer;
export const {
    setAll,
    upsertMany,
    addOne,
    setHead,
    selectCommit,
    resetForProject,
    markSynced,
} = slice.actions;

export const commitsSelectors = adapter.getSelectors((s: any) => s.commits);
