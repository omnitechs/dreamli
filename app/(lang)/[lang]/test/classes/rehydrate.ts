import Generator from "./generator";
import type { Generator as GeneratorShape, Message, OnChangeFn } from "./interface";

/** Create a fresh Generator instance from a commit's generator snapshot. */
export function generatorFromSnapshot(snapshot: GeneratorShape, onChange?: OnChangeFn): Generator {
    // construct with the same mode and wire the listener
    const gen = new Generator(snapshot.type, onChange);

    // restore fields from snapshot (exactly what toJSON() emitted)
    gen.textPrompt = snapshot.textPrompt ?? "";
    gen.images = Array.isArray(snapshot.images) ? [...snapshot.images] : [];
    gen.designated = { ...(snapshot.designated ?? {}) };
    gen.dirtySinceLastModel = snapshot.dirtySinceLastModel;
    const keys = Array.isArray((snapshot as any).selectedKeys) ? (snapshot as any).selectedKeys as string[] : [];
    gen.selectedImageKeys = new Set(keys);

    // optional: seed messages for the debug view
    if (Array.isArray((snapshot as any).messages)) {
        gen.messages = (snapshot as any).messages as Message[];
    }

    // NOTE: messages are *not* part of the generator snapshot by design.
    // Commit.messages contain only deltas since previous commit.
    return gen;
}