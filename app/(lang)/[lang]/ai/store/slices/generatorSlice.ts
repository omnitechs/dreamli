import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UUID = string;
export type Mode = 'text' | 'image';
export type DesignatedSlot = 'front'|'back'|'side'|'threeQuarter'|'top'|'bottom';

export interface Image {
    id: UUID;
    url: string;
    key?: string;
    meta?: Record<string, any>;
}

export type MessageRole = 'user'|'assistant'|'system';
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
    designated: Partial<Record<DesignatedSlot, Image | null>>;
    approvalSet?: UUID[];
    dirtySinceLastModel: boolean;
    messages: Message[];
    selectedKeys?: string[];
    selectedUrls?: string[];
}

const initialState: Generator = {
    type: 'text',
    textPrompt: '',
    images: [],
    designated: {},
    approvalSet: [],
    dirtySinceLastModel: false,
    messages: [],
    selectedKeys: [],
    selectedUrls: [],
};

const slice = createSlice({
    name: 'generator',
    initialState,
    reducers: {
        setMode(state, a: PayloadAction<Mode>) { state.type = a.payload; state.dirtySinceLastModel = true; },
        updateText(state, a: PayloadAction<string>) { state.textPrompt = a.payload; state.dirtySinceLastModel = true; },
        addImages(state, a: PayloadAction<Image[]>) { state.images.push(...a.payload); state.dirtySinceLastModel = true; },
        assignSlot(state, a: PayloadAction<{ slot: DesignatedSlot; image: Image|null }>) {
            state.designated[a.payload.slot] = a.payload.image; state.dirtySinceLastModel = true;
        },
    },
});

export const { setMode, updateText, addImages, assignSlot } = slice.actions;
export default slice.reducer;
