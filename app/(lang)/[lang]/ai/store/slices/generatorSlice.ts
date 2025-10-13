import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UUID = string;
export type Mode = 'text' | 'image';

/* -------------------- 3D Model Types -------------------- */
export interface ModelFormatUrls {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
    [k: string]: string | undefined;
}

export type MeshyKind = 'text' | 'image' | 'multi';
export type TextStage = 'preview' | 'refine';
export type MeshyTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface GeneratorModel3D {
    id: string;                  // internal id (task id by default)
    provider: 'meshy';
    taskId: string;              // Meshy task id
    kind: MeshyKind;             // text | image | multi
    stage?: TextStage;           // preview | refine
    prompt?: string;
    imageUrls?: string[];
    modelUrls: ModelFormatUrls;  // downloadable formats
    textureUrls?: Array<Record<string, string>>;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    createdAt: string;           // ISO
    sourceCommitId?: string;
    rawTask?: any;

    // live status
    status?: MeshyTaskStatus;
    progress?: number;           // 0..100
    error?: string;
}

/* -------------------- Images & Messages -------------------- */
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

/* -------------------- Generator State -------------------- */
export interface Generator {
    type: Mode;
    textPrompt: string;
    images: Image[];
    /** Selected is a subset of image IDs from `images` */
    selected: UUID[];
    approvalSet?: UUID[];
    dirtySinceLastModel: boolean;
    messages: Message[];
    models: GeneratorModel3D[];
}

const initialState: Generator = {
    type: 'text',
    textPrompt: '',
    images: [],
    selected: [],
    approvalSet: [],
    dirtySinceLastModel: false,
    messages: [],
    models: [],
};

/* -------------------- Helpers -------------------- */
function uniq<T>(ids: T[]): T[] {
    return Array.from(new Set(ids));
}

const STATUS_SET = new Set<MeshyTaskStatus>([
    'PENDING',
    'IN_PROGRESS',
    'SUCCEEDED',
    'FAILED',
    'CANCELED',
]);

function normalizeStatus(s: unknown): MeshyTaskStatus | undefined {
    if (typeof s !== 'string') return undefined;
    const v = s.toUpperCase();
    return STATUS_SET.has(v as MeshyTaskStatus) ? (v as MeshyTaskStatus) : undefined;
}

function clampProgress(p: unknown): number | undefined {
    if (typeof p !== 'number' || Number.isNaN(p)) return undefined;
    return Math.max(0, Math.min(100, p));
}

/* -------------------- Slice -------------------- */
const slice = createSlice({
    name: 'generator',
    initialState,
    reducers: {
        /* Core */
        setMode(state, a: PayloadAction<Mode>) {
            state.type = a.payload;
            state.dirtySinceLastModel = true;
        },
        updateText(state, a: PayloadAction<string>) {
            state.textPrompt = a.payload;
            state.dirtySinceLastModel = true;
        },

        /* Images + Selection */
        addImages(state, a: PayloadAction<Image[]>) {
            // coerce legacy shapes
            if (!Array.isArray(state.selected)) state.selected = [];
            if (!Array.isArray(state.images)) state.images = [];
            if (!Array.isArray(state.messages)) state.messages = [];
            if (!Array.isArray(state.approvalSet)) state.approvalSet = [];

            const incomingById = new Map(a.payload.map(i => [i.id, i]));
            const next: Image[] = [];
            const seen = new Set<string>();

            for (const img of state.images) {
                if (incomingById.has(img.id)) {
                    next.push(incomingById.get(img.id)!);
                    seen.add(img.id);
                } else {
                    next.push(img);
                    seen.add(img.id);
                }
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
        setSelected(state, a: PayloadAction<UUID[]>) {
            const valid = new Set(state.images.map(i => i.id));
            state.selected = uniq(a.payload.filter(id => valid.has(id)));
            state.dirtySinceLastModel = true;
        },
        selectImage(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            if (state.images.some(i => i.id === id) && !state.selected.includes(id)) {
                state.selected.push(id);
                state.dirtySinceLastModel = true;
            }
        },
        deselectImage(state, a: PayloadAction<UUID>) {
            const id = a.payload;
            const before = state.selected.length;
            state.selected = state.selected.filter(sid => sid !== id);
            if (state.selected.length !== before) state.dirtySinceLastModel = true;
        },
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

        /* Messages */
        addMessage(state, a: PayloadAction<Message>) {
            state.messages.push(a.payload);
            state.dirtySinceLastModel = true;
        },
        editMessage(state, a: PayloadAction<{ id: UUID; content: string }>) {
            const m = state.messages.find(m => m.id === a.payload.id);
            if (m) {
                m.content = a.payload.content;
                state.dirtySinceLastModel = true;
            }
        },
        removeMessage(state, a: PayloadAction<UUID>) {
            state.messages = state.messages.filter(m => m.id !== a.payload);
            state.dirtySinceLastModel = true;
        },
        clearMessages(state) {
            if (state.messages.length) {
                state.messages = [];
                state.dirtySinceLastModel = true;
            }
        },

        /* Snapshot */
        replaceWithSnapshot(_state, a: PayloadAction<Generator>) {
            return a.payload;
        },
        markSynced(state) {
            state.dirtySinceLastModel = false;
        },

        /* Models */
        addModel(state, a: PayloadAction<GeneratorModel3D>) {
            state.models.push(a.payload);
            state.dirtySinceLastModel = true;
        },
        upsertModel(state, a) {
            const i = state.models.findIndex(m => m.id === a.payload.id);
            if (i >= 0) {
                const prev = state.models[i];
                state.models[i] = {
                    ...prev,
                    ...a.payload,
                    sourceCommitId: a.payload.sourceCommitId ?? prev.sourceCommitId,
                };
            } else {
                state.models.unshift(a.payload);
            }
            state.dirtySinceLastModel = true;
        },

        removeModel(state, a: PayloadAction<string>) {
            state.models = state.models.filter(m => m.id !== a.payload);
        },
        clearModels(state) {
            state.models = [];
        },

        // Live status (stream-safe)
        setModelStatus(
            state,
            a: PayloadAction<{ id: string; status: unknown; progress?: unknown }>
        ) {
            const m = state.models.find(m => m.id === a.payload.id);
            if (!m) return;
            const st = normalizeStatus(a.payload.status);
            if (st) m.status = st;
            const pr = clampProgress(a.payload.progress);
            if (typeof pr === 'number') m.progress = pr;
        },
        finalizeModelFromTask(state, a: PayloadAction<GeneratorModel3D>) {
            const i = state.models.findIndex(m => m.id === a.payload.id);
            const st = normalizeStatus((a.payload as any).status) ?? 'SUCCEEDED';
            const pr = clampProgress((a.payload as any).progress) ?? 100;
            const next = { ...a.payload, status: st, progress: pr };
            if (i >= 0) state.models[i] = { ...state.models[i], ...next };
            else state.models.unshift(next);
        },
        failModel(state, a: PayloadAction<{ id: string; error?: string }>) {
            const m = state.models.find(m => m.id === a.payload.id);
            if (m) {
                m.status = 'FAILED';
                m.error = a.payload.error ?? 'Failed';
            }
        },
    },
});

/* -------------------- Exports -------------------- */
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
    removeSelectedImages,

    addMessage,
    editMessage,
    removeMessage,
    clearMessages,

    replaceWithSnapshot,
    markSynced,

    addModel,
    upsertModel,
    removeModel,
    clearModels,

    setModelStatus,
    finalizeModelFromTask,
    failModel,
} = slice.actions;

export default slice.reducer;
