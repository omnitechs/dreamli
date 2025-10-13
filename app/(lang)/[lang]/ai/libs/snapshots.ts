import type { Generator } from "../store/slices/generatorSlice";

/**
 * Converts the full generator state into a minimal, serializable snapshot.
 * Messages and non-essential UI data are excluded.
 */
export function toSnapshot(gen: Generator) {
    return {
        type: gen.type,
        textPrompt: gen.textPrompt,
        images: gen.images.map(img => ({
            id: img.id,
            url: img.url,
            key: img.key ?? null,
            meta: img.meta ?? {},
        })),
        selected: [...gen.selected],
        approvalSet: gen.approvalSet ?? [],
        dirtySinceLastModel: gen.dirtySinceLastModel,
        selectedKeys: gen.selectedKeys ?? [],
        selectedUrls: gen.selectedUrls ?? [],
    };
}

/**
 * Optional inverse: restore a generator state from a snapshot.
 * You can use this when checking out a commit.
 */
export function fromSnapshot(snapshot: any, seed?: Partial<Generator>): Generator {
    return {
        type: snapshot.type,
        textPrompt: snapshot.textPrompt ?? "",
        images: snapshot.images ?? [],
        selected: snapshot.selected ?? [],
        approvalSet: snapshot.approvalSet ?? [],
        dirtySinceLastModel: false,
        messages: seed?.messages ?? [],
        selectedKeys: snapshot.selectedKeys ?? [],
        selectedUrls: snapshot.selectedUrls ?? [],
    };
}
