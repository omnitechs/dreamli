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

const slice = createSlice({
    name: 'commits',
    initialState: adapter.getInitialState<{ headId: UUID | null; selectedId: UUID | null }>({
        headId: null, selectedId: null,
    }),
    reducers: {
        upsertMany: adapter.upsertMany,
        addOne: adapter.addOne,
        setHead(state, action) { state.headId = action.payload; state.selectedId = action.payload; },
        selectCommit(state, action) { state.selectedId = action.payload; },
    },
});

export const commitsReducer = slice.reducer;
export const { upsertMany, addOne, setHead, selectCommit } = slice.actions;
export const commitsSelectors = adapter.getSelectors((s: any) => s.commits);
