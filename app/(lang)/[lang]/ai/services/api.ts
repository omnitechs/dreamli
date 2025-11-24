// app/(lang)/[lang]/ai/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { nanoid } from '@reduxjs/toolkit';
import {
    addOne,
    setHead,
    upsertMany as upsertManyCommits,
    resetForProject as resetForProjectCommits,
    removeOne, // <- make sure this exists in commitsSlice
} from '@/app/store/slices/commitsSlice';
import {
    hydrateFromCommit,
    resetForProject as resetForProjectGenerator,
} from '@/app/store/slices/generatorSlice';
import { fromSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import type { UUID } from '@/app/(lang)/[lang]/ai/types';
import type { RootState } from '../../../../store';

export type Project = { id: UUID; name: string; description?: string | null; createdAt: string };

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
    tagTypes: ['Commits', 'Projects', 'Marketplace', 'Prints', 'Entitlements'],
    endpoints: (builder) => ({
        // --- uploads ---
        presignUpload: builder.mutation<PresignRes, { file: File }>({
            query: ({ file }) => {
                const fd = new FormData();
                fd.append('file', file);
                return { url: 'uploads/presign', method: 'POST', body: fd };
            },
        }),

        // --- projects ---
        getProjects: builder.query<Project[], void>({
            query: () => ({ url: 'projects' }),
            providesTags: ['Projects'],
        }),
        createProject: builder.mutation<Project, { name: string; description?: string | null }>({
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
                    // Treat initial load (no activeProjectId) or a different project as a project change
                    const projectChanged = activeProjectId !== projectId;

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

        // --- marketplace ---
        getMarketplaceModels: builder.query<{ items: any[]; page: number; pageSize: number; total: number; hasMore: boolean }, { page?: number; sort?: 'recent' | 'likes' | 'comments' } | void>({
            query: (arg) => {
                const page = (arg as any)?.page || 1;
                const sort = (arg as any)?.sort || 'recent';
                return { url: `marketplace/models?page=${encodeURIComponent(page)}&sort=${encodeURIComponent(sort)}` };
            },
            providesTags: ['Marketplace'],
        }),
        // gated download
        downloadModel: builder.mutation<{ url: string }, { modelId: string; format?: 'obj' | 'glb' | 'fbx' | 'usdz' }>({
            query: ({ modelId, format }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/download${format ? `?format=${encodeURIComponent(format)}` : ''}`, method: 'POST' }),
        }),
        // entitlement
        getModelEntitlement: builder.query<{ owned: boolean }, { modelId: string }>({
            query: ({ modelId }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/entitlement` }),
            providesTags: ['Entitlements'],
        }),
        // likes
        likeModel: builder.mutation<{ count: number; userLiked: boolean }, { modelId: string }>({
            query: ({ modelId }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/likes`, method: 'POST' }),
            invalidatesTags: ['Marketplace'],
        }),
        unlikeModel: builder.mutation<{ count: number; userLiked: boolean }, { modelId: string }>({
            query: ({ modelId }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/likes`, method: 'DELETE' }),
            invalidatesTags: ['Marketplace'],
        }),
        getModelLikes: builder.query<{ count: number; userLiked: boolean }, { modelId: string }>({
            query: ({ modelId }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/likes` }),
            providesTags: ['Marketplace'],
        }),
        // comments
        getModelComments: builder.query<{ items: any[]; page: number; pageSize: number; total: number; hasMore: boolean }, { modelId: string; page?: number; limit?: number }>({
            query: ({ modelId, page = 1, limit = 10 }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/comments?page=${page}&limit=${limit}` }),
            providesTags: ['Marketplace'],
        }),
        addModelComment: builder.mutation<any, { modelId: string; content?: string; media?: Array<{ url: string; kind?: string; mime?: string }> }>({
            query: ({ modelId, content, media }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/comments`, method: 'POST', body: { content, media } }),
            invalidatesTags: ['Marketplace'],
        }),
        updateModelComment: builder.mutation<any, { modelId: string; commentId: string; content?: string } >({
            query: ({ modelId, commentId, content }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/comments/${encodeURIComponent(commentId)}`, method: 'PATCH', body: { content } }),
            invalidatesTags: ['Marketplace'],
        }),
        deleteModelComment: builder.mutation<{ ok: boolean }, { modelId: string; commentId: string } >({
            query: ({ modelId, commentId }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/comments/${encodeURIComponent(commentId)}`, method: 'DELETE' }),
            invalidatesTags: ['Marketplace'],
        }),

        // prints
        getModelPrints: builder.query<{ items: any[]; page: number; pageSize: number; total: number; hasMore: boolean }, { modelId: string; page?: number; limit?: number }>({
            query: ({ modelId, page = 1, limit = 10 }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/prints?page=${page}&limit=${limit}` }),
            providesTags: ['Prints'],
        }),
        addModelPrint: builder.mutation<any, { modelId: string; text?: string; media: Array<{ url: string; kind?: string; mime?: string }> }>({
            query: ({ modelId, text, media }) => ({ url: `marketplace/models/${encodeURIComponent(modelId)}/prints`, method: 'POST', body: { text, media } }),
            invalidatesTags: ['Prints', 'Marketplace'],
        }),

        getModelById: builder.query<any, { modelId: string }>({
            query: ({ modelId }) => ({ url: `models/${modelId}` }),
        }),
        getPublicCommitById: builder.query<any, { commitId: string }>({
            query: ({ commitId }) => ({ url: `public/commits/${commitId}` }),
        }),
    }),
});

export const {
    usePresignUploadMutation,
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetCommitsQuery,
    useCreateCommitMutation,
    useGetMarketplaceModelsQuery,
    useDownloadModelMutation,
    useLikeModelMutation,
    useUnlikeModelMutation,
    useGetModelLikesQuery,
    useGetModelCommentsQuery,
    useAddModelCommentMutation,
    useUpdateModelCommentMutation,
    useDeleteModelCommentMutation,
    useGetModelPrintsQuery,
    useAddModelPrintMutation,
    useGetModelByIdQuery,
    useGetPublicCommitByIdQuery,
    useGetModelEntitlementQuery, 
} = api;
