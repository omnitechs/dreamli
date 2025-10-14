import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { nanoid } from '@reduxjs/toolkit';
import {
    addOne,
    setHead,
    upsertMany as upsertManyCommits,
    resetForProject as resetForProjectCommits,
} from '../store/slices/commitsSlice';
import {
    hydrateFromCommit,
    resetForProject as resetForProjectGenerator,
} from '../store/slices/generatorSlice';
import { fromSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import type { UUID } from '@/app/(lang)/[lang]/ai/types';

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
type PresignRes = { uploadUrl: string; publicUrl: string; key: string };

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Commits', 'Projects'],
    endpoints: (builder) => ({

        // uploads
        presignUpload: builder.mutation<PresignRes, PresignReq>({
            query: (body) => ({ url: 'uploads/presign', method: 'POST', body }),
        }),

        // projects
        getProjects: builder.query<Project[], void>({
            query: () => ({ url: 'projects' }),
            providesTags: ['Projects'],
        }),
        createProject: builder.mutation<Project, { name: string }>({
            query: (body) => ({ url: 'projects', method: 'POST', body }),
            invalidatesTags: ['Projects'],
        }),

        // commits
        getCommits: builder.query<Commit[], { projectId: UUID }>({
            query: ({ projectId }) => ({ url: `projects/${projectId}/commits` }),
            providesTags: (_res, _err, arg) => [{ type: 'Commits', id: arg.projectId }],

            // auto-hydrate logic: executed once data arrives
            async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
                console.log("onQueryStarted")
                try {
                    const { data: commits } = await queryFulfilled;


                    // Clear previous project data
                    dispatch(resetForProjectGenerator({ projectId }));
                    dispatch(resetForProjectCommits({ projectId }));

                    // Merge new commits into store
                    dispatch(upsertManyCommits(commits));

                    // Select latest commit (first item if sorted desc)
                    const latest = commits[0];
                    dispatch(setHead(latest?.id));

                    // Hydrate generator state
                    dispatch(
                        hydrateFromCommit({
                            projectId,
                            commitId: latest?.id,
                            snapshot: fromSnapshot(latest?.snapshot),
                        })
                    );
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
                    const { data } = await queryFulfilled;
                    dispatch(upsertManyCommits([data]));
                    dispatch(setHead(data.id));
                } catch {
                    // Optional rollback if request fails
                }
            },
            invalidatesTags: (_res, _err, { projectId }) => [
                { type: 'Commits', id: projectId },
            ],
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
