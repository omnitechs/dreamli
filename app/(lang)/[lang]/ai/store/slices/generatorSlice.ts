import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UUID = string;
export type Mode = 'text' | 'image';

export interface Image {
    id: UUID;
    url: string;
    key?: string;
    meta?: Record<string, any>;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export interface Message {
    id: UUID;
    role: MessageRole;
    content: string;
    createdAt: string;
}

export interface Generator {
    type: Mode;
    textPrompt: string;
    images: Image[];
    /** Selected is a subset of image IDs from `images` */
    selected: UUID[];
    approvalSet?: UUID[];
    dirtySinceLastModel: boolean;
    messages: Message[];
}

const initialState: Generator = {
    type: 'text',
    textPrompt: '',
    images: [],
    selected: [],
    approvalSet: [],
    dirtySinceLastModel: false,
    messages: [],
};

function uniq(ids: string[]): string[] {
    return Array.from(new Set(ids));
}

const slice = createSlice({
    name: 'generator',
    initialState,
    reducers: {
        setMode(state, a: PayloadAction<Mode>) {
            state.type = a.payload;
            state.dirtySinceLastModel = true;
        },
        updateText(state, a: PayloadAction<string>) {
            state.textPrompt = a.payload;
            state.dirtySinceLastModel = true;
        },
        addImages(state, a: PayloadAction<Image[]>) {
            // --- SAFETY: coerce missing fields from old persisted state ---
            if (!Array.isArray(state.selected)) state.selected = [];
            if (!Array.isArray(state.images)) state.images = [];
            if (!state.messages) state.messages = [];
            if (!state.approvalSet) state.approvalSet = [];

            const incomingById = new Map(a.payload.map(i => [i.id, i]));
            const next: Image[] = [];
            const seen = new Set<string>();

            for (const img of state.images) {
                if (incomingById.has(img.id)) { next.push(incomingById.get(img.id)!); seen.add(img.id); }
                else { next.push(img); seen.add(img.id); }
            }
            for (const img of a.payload) if (!seen.has(img.id)) next.push(img);
            state.images = next;

            const valid = new Set(state.images.map(i => i.id));
            state.selected = (state.selected ?? []).filter(id => valid.has(id));

            state.dirtySinceLastModel = true;
        },
        removeImage(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            state.images = state.images.filter(i => i.id !== id);
            state.selected = state.selected.filter(sid => sid !== id);
            state.dirtySinceLastModel = true;
        },

        /** Replace selected with a unique, valid subset */
        setSelected(state, a: PayloadAction<UUID[]>) {
            const valid = new Set(state.images.map(i => i.id));
            state.selected = uniq(a.payload.filter(id => valid.has(id)));
            state.dirtySinceLastModel = true;
        },
        /** Add one to selection if exists */
        selectImage(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            if (state.images.some(i => i.id === id) && !state.selected.includes(id)) {
                state.selected.push(id);
                state.dirtySinceLastModel = true;
            }
        },
        /** Remove one from selection */
        deselectImage(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            const before = state.selected.length;
            state.selected = state.selected.filter(sid => sid !== id);
            if (state.selected.length !== before) state.dirtySinceLastModel = true;
        },
        /** Toggle one */
        toggleSelect(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            if (!state.images.some(i => i.id === id)) return;
            if (state.selected.includes(id)) {
                state.selected = state.selected.filter(sid => sid !== id);
            } else {
                state.selected.push(id);
            }
            state.dirtySinceLastModel = true;
        },
        clearSelected(state) {
            if (state.selected.length) {
                state.selected = [];
                state.dirtySinceLastModel = true;
            }
        },
        removeSelectedImages(state) {
            if (!state.selected.length) return;
            const kill = new Set(state.selected);
            state.images = state.images.filter(i => !kill.has(i.id));
            state.selected = [];
            state.dirtySinceLastModel = true;
        },

        // ---- messages ----
        addMessage(state, a: PayloadAction<Message>) {
            state.messages.push(a.payload);
            state.dirtySinceLastModel = true;
        },
        editMessage(state, a: PayloadAction<{ id: UUID; content: string }>) {
            const m = state.messages.find(m => m.id === a.payload.id);
            if (m) { m.content = a.payload.content; state.dirtySinceLastModel = true; }
        },
        removeMessage(state, a: PayloadAction<UUID>) {
            state.messages = state.messages.filter(m => m.id !== a.payload);
            state.dirtySinceLastModel = true;
        },
        clearMessages(state) {
            if (state.messages.length) { state.messages = []; state.dirtySinceLastModel = true; }
        },

        /** Full replace (e.g., checkout snapshot) */
        replaceWithSnapshot(_state, a: PayloadAction<Generator>) {
            return a.payload;
        },
        markSynced(state) {
            state.dirtySinceLastModel = false;
        },
    },
});

export const {
    setMode,
    updateText,
    addImages,
    removeImage,
    setSelected,
    selectImage,
    deselectImage,
    toggleSelect,
    clearSelected,
    addMessage,
    replaceWithSnapshot,
    markSynced,
    removeSelectedImages,
    editMessage, removeMessage, clearMessages,
} = slice.actions;

export default slice.reducer;
