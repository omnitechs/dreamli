// rehydrate.ts
import Generator, { type GeneratorModel3D } from "./generator";
import type { Generator as GeneratorShape, Message, OnChangeFn } from "./interface";

/** Create a fresh Generator instance from a commit's generator snapshot. */
export function generatorFromSnapshot(
    snapshot: GeneratorShape & { models?: GeneratorModel3D[] }, // allow models if present
    onChange?: OnChangeFn
): Generator {
    // construct with the same mode and wire the listener
    const gen = new Generator(snapshot.type ?? "text", onChange);

    // restore fields from snapshot (exactly what toJSON() emitted)
    gen.textPrompt = snapshot.textPrompt ?? "";
    gen.images = Array.isArray(snapshot.images) ? [...snapshot.images] : [];
    gen.designated = { ...(snapshot.designated ?? {}) };
    gen.dirtySinceLastModel = snapshot.dirtySinceLastModel;

    const keys = Array.isArray((snapshot as any).selectedKeys)
        ? ((snapshot as any).selectedKeys as string[])
        : [];
    gen.selectedImageKeys = new Set(keys);

    // optional: seed messages for the debug view
    if (Array.isArray((snapshot as any).messages)) {
        gen.messages = (snapshot as any).messages as Message[];
    }

    // ✅ NEW: rehydrate 3D models (backward compatible if missing)
    const snapModels = (snapshot as any).models as GeneratorModel3D[] | undefined;
    if (Array.isArray(snapModels)) {
        // shallow copy to avoid sharing object refs
        gen.models = snapModels.map((m) => ({ ...m }));
        // rebuild provenance mapping so "redo from source commit" still works
        for (const m of gen.models) {
            if (m?.sourceCommitId) {
                gen.markGenerationSource(m.taskId, m.sourceCommitId);
            }
        }
    } else {
        gen.models = [];
    }

    return gen;
}
