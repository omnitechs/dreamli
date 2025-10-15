/**
 * Snapshot helpers
 * ----------------
 * Purpose:
 *  - `toSnapshot(generator)`: take the in-memory Generator Redux state and build a
 *    compact, **serializable** payload suitable for saving in a CommitsPanel.
 *  - `fromSnapshot(snapshot)`: take a stored CommitsPanel payload and reconstruct a clean
 *    Generator state object that your reducers/components can consume.
 *
 * Design goals:
 *  - Keep commits deterministic and portable (no functions, no blobs, no transient fields).
 *  - Be resilient to older commits (migrate legacy shapes like `selectedKeys` if present).
 *  - Avoid accidental shared references (always deep-copy arrays/objects you return).
 */

import {Generator } from '../store/slices/generatorSlice';
import {GeneratorModel3D, Image, Message, UUID} from "@/app/(lang)/[lang]/ai/types";

/**
 * A compact, serializable commit payload.
 * This is the *only* shape that should be written to your database for a Generator.
 * Keep this stable and additive (backward compatible) if you can.
 */
export type GeneratorSnapshot = {
    type: Generator['type'];
    textPrompt: string;

    /**
     * Images are stored in a minimal form:
     *  - `id` (stable, used for selection)
     *  - `url` (public/accessible URL)
     *  - `key` (optional legacy or storage key; null if not used)
     *  - `meta` (free-form serializable metadata)
     */
    images: Array<{ id: UUID; url: string; key: string | null; meta: Record<string, any> }>;

    /** Selection is a list of *image ids* (never keys/urls). */
    selected: UUID[];

    /** Optional pre-approval set, by id. */
    approvalSet: UUID[];

    /**
     * Whether the working state has unsaved edits since the last model generation.
     * Note: We *don’t* use this to trigger anything on hydration; it’s mainly
     * a UX hint and can be reset by `fromSnapshot` if desired.
     */
    dirtySinceLastModel: boolean;

    /**
     * Models produced by the pipeline. Must be serializable.
     * We deliberately strip any volatile fields like `rawTask` before saving.
     */
    models: GeneratorModel3D[];

    /**
     * Conversation log items related to the generator.
     * Kept here so the UI can render a consistent timeline when a commit is reopened.
     */
    messages: Message[];
};

/**
 * toSnapshot
 * ----------
 * Build a serializable payload from the live Generator state.
 * - Deep-copies arrays/objects so the caller can mutate the live state safely afterward.
 * - Strips transient/volatile fields from models (e.g., `rawTask`).
 * - Ensures optional properties become concrete (e.g., `key` defaults to null; `meta` to {}).
 */
export function toSnapshot(gen: Generator): GeneratorSnapshot {
    // Helper: strip volatile fields from a model (e.g., functions or raw server objects).
    const sanitizeModel = (m: GeneratorModel3D): GeneratorModel3D => {
        const { rawTask, ...rest } = m as any; // drop rawTask if present
        return { ...rest };
    };

    return {
        type: gen.type,
        textPrompt: gen.textPrompt,

        // Serialize images compactly and predictably
        images: (gen.images ?? []).map((i: Image) => ({
            id: i.id,
            url: i.url,
            key: i.key ?? null,
            meta: i.meta ?? {},
        })),

        // Always copy arrays to avoid shared references with Redux state
        selected: Array.isArray(gen.selected) ? [...gen.selected] : [],
        approvalSet: Array.isArray(gen.approvalSet) ? [...gen.approvalSet] : [],

        // Persist the flag as-is (may be reset on hydration depending on your policy)
        dirtySinceLastModel: gen.dirtySinceLastModel,

        // Models/messages are deep-copied and sanitized
        models: Array.isArray(gen.models) ? gen.models.map(sanitizeModel) : [],
        messages: Array.isArray(gen.messages) ? gen.messages.map((m) => ({ ...m })) : [],
    };
}

/**
 * fromSnapshot
 * ------------
 * Reconstruct a clean, reducer-friendly `Generator` state from a stored snapshot.
 * - Accepts partial data (older commits) and fills in safe defaults.
 * - Migrates legacy shapes (e.g., `selectedKeys` → `selected` (ids) when possible).
 * - Drops transient/volatile fields from models.
 * - Resets `dirtySinceLastModel` to `false` so hydration doesn’t look like “unsaved changes.”
 *
 * IMPORTANT: `__meta` is *not* part of the snapshot; it’s set by your hydrate action.
 */
export function fromSnapshot(snap: Partial<GeneratorSnapshot>): Generator {
    // Defensive clone so we can mutate without affecting the caller
    const s: any = snap && typeof snap === 'object' ? { ...snap } : {};

    // Normalize images (array of {id,url,key,meta})
    const images: Generator['images'] = Array.isArray(s.images)
        ? s.images.map((img: any) => ({
            id: String(img?.id ?? ''),
            url: String(img?.url ?? ''),
            // keep key for potential legacy mapping; normalize to string | undefined
            key: typeof img?.key === 'string' ? img.key : undefined,
            meta: img?.meta && typeof img.meta === 'object' ? { ...img.meta } : {},
        }))
        : [];

    // MIGRATION: support legacy commits that used `selectedKeys` (image.key) instead of image ids.
    // If `selected` is not present but `selectedKeys` is, map keys → ids using the current image list.
    let selected: UUID[] = Array.isArray(s.selected) ? s.selected.slice() : [];
    if (!selected.length && Array.isArray(s.selectedKeys)) {
        const keyToId = new Map<string, string>();
        for (const img of images) if (img?.key) keyToId.set(img.key, img.id);
        selected = s.selectedKeys.map((k: any) => keyToId.get(String(k))).filter(Boolean) as UUID[];
    }

    // Messages (deep copy, default empty)
    const messages: Message[] = Array.isArray(s.messages) ? s.messages.map((m: any) => ({ ...m })) : [];

    // Models (strip any volatile fields like rawTask)
    const models: GeneratorModel3D[] = Array.isArray(s.models)
        ? s.models.map((m: any) => {
            const { rawTask, ...rest } = m ?? {};
            return { ...rest };
        })
        : [];

    // Build final Generator. We *reset* dirtySinceLastModel on hydration.
    // (Keeps UX calm: loading a commit shouldn't look like pending unsaved edits.)
    return {
        type: s.type === 'image' ? 'image' : 'text',
        textPrompt: typeof s.textPrompt === 'string' ? s.textPrompt : '',

        images,
        selected,
        approvalSet: Array.isArray(s.approvalSet) ? s.approvalSet.slice() : [],

        dirtySinceLastModel: false,

        models,
        messages,

        // __meta is intentionally omitted here; your hydrate action should set it.
    };
}
