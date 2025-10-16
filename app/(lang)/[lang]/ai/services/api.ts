// app/(lang)/[lang]/ai/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { nanoid } from '@reduxjs/toolkit';
import {
    addOne,
    setHead,
    upsertMany as upsertManyCommits,
    resetForProject as resetForProjectCommits,
    removeOne, // <- make sure this exists in commitsSlice
} from '../store/slices/commitsSlice';
import {
    hydrateFromCommit,
    resetForProject as resetForProjectGenerator,
} from '../store/slices/generatorSlice';
import { fromSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import type { UUID } from '@/app/(lang)/[lang]/ai/types';
import type { RootState } from '../store';

export type Project = { id: UUID; name: string; createdAt: string };

export type Commit = {
    id: UUID;
    projectId: UUID;
    parentId: UUID | null;
    snapshot: any;
    message?: string;
    createdAt: string;
};

type PresignReq = { filename: string; type: string };
type PresignRes = { uploadUrl?: string; publicUrl?: string; key?: string; url?: string };

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Commits', 'Projects'],
    endpoints: (builder) => ({
        // --- uploads ---
        presignUpload: builder.mutation<PresignRes, PresignReq>({
            query: (body) => ({ url: 'uploads/presign', method: 'POST', body }),
        }),

        // --- projects ---
        getProjects: builder.query<Project[], void>({
            query: () => ({ url: 'projects' }),
            providesTags: ['Projects'],
        }),
        createProject: builder.mutation<Project, { name: string }>({
            query: (body) => ({ url: 'projects', method: 'POST', body }),
            invalidatesTags: ['Projects'],
        }),

        // --- commits ---
        getCommits: builder.query<Commit[], { projectId: UUID }>({
            query: ({ projectId }) => ({ url: `projects/${projectId}/commits` }),
            providesTags: (_res, _err, arg) => [{ type: 'Commits', id: arg.projectId }],
            async onQueryStarted({ projectId }, { dispatch, getState, queryFulfilled }) {
                try {
                    const { data: commits } = await queryFulfilled;

                    // Ensure newest-first if API doesn't guarantee order
                    const sorted = [...commits].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    const latest = sorted[0];

                    const state = getState() as RootState;
                    const activeProjectId = (state as any)?.generator?.__meta?.projectId ?? null;
                    const projectChanged = activeProjectId !== null && activeProjectId !== projectId;

                    if (projectChanged) {
                        dispatch(resetForProjectGenerator({ projectId }));
                        dispatch(resetForProjectCommits( projectId ));
                        if (latest) {
                            dispatch(setHead(latest.id));
                            dispatch(
                                hydrateFromCommit({
                                    projectId,
                                    commitId: latest.id,
                                    snapshot: fromSnapshot(latest.snapshot),
                                })
                            );
                        }
                    }

                    // Merge/refresh commit list
                    dispatch(upsertManyCommits(sorted));
                    if (!projectChanged && latest) {
                        // keep head pointing at latest if nothing else set
                        dispatch(setHead(latest.id));
                    }
                } catch (err) {
                    console.error('Failed to fetch commits:', err);
                }
            },
        }),

        createCommit: builder.mutation<
            Commit,
            { projectId: UUID; parentId: UUID | null; snapshot: any; message?: string }
        >({
            query: ({ projectId, ...rest }) => ({
                url: `projects/${projectId}/commits`,
                method: 'POST',
                body: { projectId, ...rest },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // 1) optimistic temp commit
                const tempId = nanoid();
                const optimistic: Commit = {
                    id: tempId,
                    projectId: arg.projectId,
                    parentId: arg.parentId,
                    snapshot: arg.snapshot,
                    message: arg.message,
                    createdAt: new Date().toISOString(),
                };

                dispatch(addOne(optimistic));
                dispatch(setHead(tempId));

                try {
                    // 2) server result
                    const { data } = await queryFulfilled;

                    // 3) upsert real commit + point head to it
                    dispatch(upsertManyCommits([data]));
                    dispatch(setHead(data.id));

                    // 4) remove the temp so list shows exactly one
                    dispatch(removeOne(tempId));

                    // 5) also patch the getCommits cache so no refetch is needed
                    dispatch(
                        api.util.updateQueryData('getCommits', { projectId: arg.projectId }, (draft) => {
                            const idx = draft.findIndex((c) => c.id === tempId);
                            if (idx !== -1) draft.splice(idx, 1, data);
                            else draft.unshift(data);
                        })
                    );
                } catch {
                    // request failed → drop the temp; optionally notify UI
                    dispatch(removeOne(tempId));
                }
            },
            // We patched the cache, so invalidation is optional.
            // If your server returns additional computed fields, you can keep this:
            // invalidatesTags: (_res, _err, { projectId }) => [{ type: 'Commits', id: projectId }],
        }),
    }),
});

export const {
    usePresignUploadMutation,
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetCommitsQuery,
    useCreateCommitMutation,
} = api;
