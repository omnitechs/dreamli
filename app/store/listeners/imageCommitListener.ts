// app/store/listeners/imageCommitListener.ts
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { addImages } from '@/app/store/slices/generatorSlice';
import { api } from '@/app/(lang)/[lang]/ai/services/api';
import { toSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import type { Image } from '@/app/(lang)/[lang]/ai/types';

// Debounce timer per project to avoid spamming commits when multiple uploads finish
const debounceTimers = new Map<string, any>();

function httpUrl(u?: string) {
  return !!u && /^https?:\/\//i.test(u);
}

function hasHttpInPayload(payload: Image[] | any[]): boolean {
  return Array.isArray(payload) && payload.some((i: any) => httpUrl(i?.url));
}

function resolveProjectAndParent(state: RootState): { projectId: string; parentId: string | null } {
  const commitsState: any = (state as any).commits;
  const parentId: string | null = commitsState?.headId ?? null;
  let projectId = 'demo-project';
  if (parentId && commitsState?.entities?.[parentId]?.projectId) {
    projectId = commitsState.entities[parentId].projectId;
  } else if ((state as any)?.generator?.__meta?.projectId) {
    projectId = (state as any).generator.__meta.projectId;
  }
  return { projectId, parentId };
}

export const imageCommitListener = createListenerMiddleware();

imageCommitListener.startListening({
  matcher: isAnyOf(addImages),
  effect: async (action, { getState, dispatch }) => {
    // Only consider commits when a payload contains finalized http(s) URLs
    const payload = (action as any)?.payload as any[];
    if (!hasHttpInPayload(payload)) return;

    const state = getState() as RootState;
    const { projectId, parentId } = resolveProjectAndParent(state);

    // Debounce by project to batch simultaneous completions
    const existing = debounceTimers.get(projectId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      try {
        const latestState = getState() as RootState;
        const gen: any = (latestState as any)?.generator;
        if (!gen) return;

        // Build a clean snapshot; snapshots.ts already filters out non-http images
        const snapshot = toSnapshot(gen);

        // If snapshot has no images at all, skip committing from this trigger
        if (!Array.isArray((snapshot as any).images) || (snapshot as any).images.length === 0) {
          return;
        }

        await dispatch(
          api.endpoints.createCommit.initiate({
            projectId,
            parentId,
            snapshot,
            message: `Images uploaded: ${new Date().toLocaleString()}`,
          })
        );
      } finally {
        debounceTimers.delete(projectId);
      }
    }, 800);

    debounceTimers.set(projectId, timer);
  },
});
