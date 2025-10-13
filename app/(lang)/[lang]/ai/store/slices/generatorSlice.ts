import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from "@/app/(lang)/[lang]/ai/store";
import {GeneratorModel3D, MeshyTaskStatus, Image, Message, Mode, UUID} from "@/app/(lang)/[lang]/ai/types"


function isTerminalStatus(s?: string) {
    const v = typeof s === 'string' ? s.toUpperCase() : '';
    return v === 'SUCCEEDED' || v === 'FAILED' || v === 'CANCELED';
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
    /** NEW: hydration bookkeeping */
    __meta?: {
        projectId?: string;
        loadedFromCommitId?: string;
        loadedAt?: string; // ISO
    };
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
    __meta: undefined,
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

function coerceGeneratorShape(state: any) {
    if (!state) return;
    if (!Array.isArray(state.images)) state.images = [];
    if (!Array.isArray(state.selected)) state.selected = [];
    if (!Array.isArray(state.messages)) state.messages = [];
    if (!Array.isArray(state.models)) state.models = [];
    if (!Array.isArray(state.approvalSet)) state.approvalSet = [];
    if (typeof state.textPrompt !== 'string') state.textPrompt = '';
    if (state.type !== 'text' && state.type !== 'image') state.type = 'text';
}

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
        hydrateFromCommit(
            _state,
            a: PayloadAction<{ projectId: string; commitId: string; snapshot: any }>
        ) {
            const next: Generator = {
                ...initialState,
                ...a.payload.snapshot, // <-- your snapshot shape must already match Generator via fromSnapshot()
                __meta: {
                    projectId: a.payload.projectId,
                    loadedFromCommitId: a.payload.commitId,
                    loadedAt: new Date().toISOString(),
                },
            };
            return next;
        },
        // NEW: flush generator when switching projects
        resetForProject(
            _state,
            a: PayloadAction<{ projectId: string }>
        ) {
            return {
                ...initialState,
                __meta: {
                    projectId: a.payload.projectId,
                    loadedFromCommitId: undefined,
                    loadedAt: new Date().toISOString(),
                },
            };
        },
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
            // Merge over defaults to ensure required arrays exist
            const next: Generator = {
                ...initialState,
                ...a.payload,
                images: Array.isArray(a.payload.images) ? a.payload.images : [],
                selected: Array.isArray((a.payload as any).selected) ? (a.payload as any).selected : [],
                messages: Array.isArray((a.payload as any).messages) ? (a.payload as any).messages : [],
                models: Array.isArray((a.payload as any).models) ? (a.payload as any).models : [],
                approvalSet: Array.isArray((a.payload as any).approvalSet) ? (a.payload as any).approvalSet : [],
            };
            return next;
        },
        markSynced(state) {
            state.dirtySinceLastModel = false;
        },

        /* Models */
        addModel(state, a) {
            coerceGeneratorShape(state);
            const p = a.payload as any;
            if (!p || !p.id) return;
            state.models.push(p);
            state.dirtySinceLastModel = true;
        },
        upsertModel(state, a) {
            const p = a.payload as any;
            if (!p?.id) return;
            if (!Array.isArray(state.models)) state.models = [];
            const i = state.models.findIndex(m => m.id === p.id);
            if (i >= 0) {
                const prev = state.models[i];
                state.models[i] = {
                    ...prev,
                    ...p,
                    sourceCommitId: p.sourceCommitId ?? prev.sourceCommitId,
                    streaming: p.streaming ?? prev.streaming,   // <-- keep flag
                };
            } else {
                state.models.unshift(p);
            }
            state.dirtySinceLastModel = true;
        },

        removeModel(state, a) {
            coerceGeneratorShape(state);
            const id = a.payload as string;
            if (!id) return;
            state.models = state.models.filter(m => m.id !== id);
        },
        clearModels(state) {
            coerceGeneratorShape(state);
            state.models = [];
        },

        // Live status (stream-safe)
        setModelStatus(state, a) {
            coerceGeneratorShape(state);
            const {id, status, progress} = a.payload as any;
            if (!id) return;
            const m = state.models.find(m => m.id === id);
            if (!m) return;

            const st = normalizeStatus(status);
            if (st) {
                m.status = st;
                if (isTerminalStatus(st)) m.streaming = false; // <<< turn off on terminal
            }
            const pr = clampProgress(progress);
            if (typeof pr === 'number') m.progress = pr;
        },
        finalizeModelFromTask(state, a) {
            coerceGeneratorShape(state);
            const p = a.payload as any;
            if (!p || !p.id) return;
            const i = state.models.findIndex(m => m.id === p.id);
            const st = normalizeStatus(p.status) ?? 'SUCCEEDED';
            const pr = clampProgress(p.progress) ?? 100;
            const next = {...p, status: st, progress: pr, streaming: false}; // <<< off
            if (i >= 0) {
                const prev = state.models[i];
                state.models[i] = {
                    ...prev,
                    ...next,
                    sourceCommitId: next.sourceCommitId ?? prev.sourceCommitId,
                    streaming: false, // <<< off
                };
            } else {
                state.models.unshift(next);
            }
        },
        failModel(state, a: PayloadAction<{ id: string; error?: string }>) {
            const m = state.models.find(m => m.id === a.payload.id);
            if (m) {
                m.status = 'FAILED';
                m.error = a.payload.error ?? 'Failed';
                m.streaming = false; // <<< off
            }
        },
    },
});
export const selectNormalizedModels = (state: RootState) => {
    const models = (state as any)?.generator?.models ?? [];
    return models.map((m: any) =>
        isTerminalStatus(m?.status) ? {...m, streaming: false} : m
    );
};


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
    hydrateFromCommit,
    setModelStatus,
    finalizeModelFromTask,
    failModel,
    resetForProject
} = slice.actions;


export default slice.reducer;
