import type { Generator, Image, Message, UUID } from '../store/slices/generatorSlice';

// A compact, serializable commit payload
export type GeneratorSnapshot = {
    type: Generator['type'];
    textPrompt: string;
    images: Array<{ id: UUID; url: string; key: string | null; meta: Record<string, any> }>;
    selected: UUID[];
    approvalSet: UUID[];
    dirtySinceLastModel: boolean;
    messages: Message[]; // <-- include messages now
};

export function toSnapshot(gen: Generator): GeneratorSnapshot {
    return {
        type: gen.type,
        textPrompt: gen.textPrompt,
        images: gen.images.map(i => ({
            id: i.id,
            url: i.url,
            key: i.key ?? null,
            meta: i.meta ?? {},
        })),
        selected: [...(gen.selected ?? [])],
        approvalSet: [...(gen.approvalSet ?? [])],
        dirtySinceLastModel: gen.dirtySinceLastModel,
        messages: Array.isArray(gen.messages) ? gen.messages.map(m => ({ ...m })) : [],
    };
}

export function fromSnapshot(snap: Partial<GeneratorSnapshot>): Generator {
    return {
        type: snap.type ?? 'text',
        textPrompt: snap.textPrompt ?? '',
        images: Array.isArray(snap.images) ? snap.images as Generator['images'] : [],
        selected: Array.isArray(snap.selected) ? snap.selected : [],
        approvalSet: Array.isArray(snap.approvalSet) ? snap.approvalSet : [],
        dirtySinceLastModel: false,
        messages: Array.isArray(snap.messages) ? snap.messages as Message[] : [], // <-- restore messages
    };
}
