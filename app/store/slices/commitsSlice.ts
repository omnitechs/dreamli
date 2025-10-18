// app/(lang)/[lang]/ai/store/slices/commitsSlice.ts
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UUID } from '@/app/(lang)/[lang]/ai/types';

export interface Commit {
    id: UUID;
    projectId: UUID;
    parentId: UUID | null;
    snapshot: any;
    createdAt: string;
    message?: string;
}

const adapter = createEntityAdapter<Commit>({
    // newest first; break ties by id to ensure deterministic order
    sortComparer: (a, b) => {
        const at = new Date(a.createdAt).getTime();
        const bt = new Date(b.createdAt).getTime();
        if (bt !== at) return bt - at; // newer first
        // Tie-breaker: compare ids (descending) to keep latest-inserted (lexicographically larger) first
        return b.id.localeCompare(a.id);
    },
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
        // Replace entire list with server truth (rarely used; upsertMany is usually enough)
        setAll: adapter.setAll,

        // Merge/insert server commits
        upsertMany: adapter.upsertMany,

        // Add a single commit (used for optimistic temp)
        addOne: adapter.addOne,

        // 🔑 Remove a single commit by id (used to drop the optimistic temp after success)
        removeOne: adapter.removeOne,

        // Update head/selection pointers
        setHead(state, action: PayloadAction<UUID | null>) {
            state.headId = action.payload;
            state.selectedId = action.payload ?? null;
        },

        selectCommit(state, action: PayloadAction<UUID | null>) {
            state.selectedId = action.payload ?? null;
        },

        // Reset slice when switching project (prevents leakage from previous project)
        resetForProject(state, action: PayloadAction<string>) {
            const projectId = action.payload;
            const cleared = adapter.getInitialState({
                headId: null,
                selectedId: null,
                __meta: { projectId, lastSyncedAt: null },
            });
            Object.assign(state, cleared);
        },

        // Mark last sync moment (optional, for diagnostics/UI)
        markSynced(state, action: PayloadAction<string>) {
            state.__meta.projectId = action.payload;
            state.__meta.lastSyncedAt = new Date().toISOString();
        },
    },
});

export const commitsReducer = slice.reducer;

export const {
    setAll,
    upsertMany,
    addOne,
    removeOne,      // <- export for use in api.ts
    setHead,
    selectCommit,
    resetForProject,
    markSynced,
} = slice.actions;

export const commitsSelectors = adapter.getSelectors((s: any) => s.commits);
