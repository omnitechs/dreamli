// src/store/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { nanoid } from '@reduxjs/toolkit';
import { addOne, setHead } from '../store/slices/commitsSlice';

// Keep it local to avoid fragile imports
type UUID = string;

type PresignReq = { filename: string; type: string };
type PresignRes = { uploadUrl: string; publicUrl: string; key: string };

type Commit = {
    id: UUID; projectId: UUID; parentId: UUID | null;
    snapshot: any; message?: string; createdAt: string;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Commits'],
    endpoints: (builder) => ({
        presignUpload: builder.mutation<PresignRes, PresignReq>({
            query: (body) => ({ url: 'uploads/presign', method: 'POST', body }),
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
                    dispatch(setHead(data.id));
                } catch {
                    // optional: rollback/remove optimistic here
                }
            },
            invalidatesTags: (_res, _err, { projectId }) => [{ type: 'Commits', id: projectId }],
        }),
    }),
});

export const { usePresignUploadMutation, useCreateCommitMutation } = api;
