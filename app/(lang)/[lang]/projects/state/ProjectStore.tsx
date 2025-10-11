'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { CommitJSON, Message, ProjectState, GeneratorSnapshot } from '../types';

type ProjectViewState = {
    projectId: string;
    commits: CommitJSON[];          // newest first
    headId: string;
    selectedId: string;             // UI selection (defaults to head)
};

type Action =
    | { type: 'INIT'; payload: ProjectState }
    | { type: 'SELECT_COMMIT'; id: string }
    | { type: 'REPLACE_WITH_SERVER_STATE'; payload: ProjectState }
    | { type: 'OPTIMISTIC_ADD_MESSAGE'; msg: Message }
    | { type: 'ROLLBACK_OPTIMISTIC_MESSAGE'; id: string }
    | { type: 'CLEAR_OPTIMISTIC_MESSAGES' };

type Store = {
    state: ProjectViewState;
    // derived
    generator: GeneratorSnapshot | null;
    messages: Message[];
    optimisticMessages: Message[];

    // actions
    init: (initial: ProjectState) => void;
    selectCommit: (id: string) => void;

    // optimistic msg helpers
    addOptimisticMessage: (m: Message) => void;
    rollbackOptimisticMessage: (id: string) => void;
    clearOptimisticMessages: () => void;

    // server reconciliation
    replaceWithServer: (next: ProjectState) => void;
};

const Ctx = createContext<Store | null>(null);

function aggregateMessages(commits: CommitJSON[], selectedId: string): Message[] {
    const selIdx = commits.findIndex((c) => c.id === selectedId);
    if (selIdx === -1) return [];
    const slice = commits.slice(selIdx).reverse(); // newest-first → root→selected
    const out: Message[] = [];
    for (const c of slice) if (c.messages?.length) out.push(...c.messages);
    return out;
}

function pickGeneratorAt(commits: CommitJSON[], selectedId: string): GeneratorSnapshot | null {
    return (commits.find(c => c.id === selectedId)?.generator as GeneratorSnapshot) ?? null;
}

function reducer(
    base: ProjectViewState & { optimisticMessages: Message[] },
    action: Action
): ProjectViewState & { optimisticMessages: Message[] } {
    switch (action.type) {
        case 'INIT': {
            return {
                projectId: action.payload.projectId,
                commits: action.payload.commits,
                headId: action.payload.headId,
                selectedId: action.payload.headId,
                optimisticMessages: [],
            };
        }
        case 'SELECT_COMMIT':
            return { ...base, selectedId: action.id };
        case 'REPLACE_WITH_SERVER_STATE':
            return {
                projectId: action.payload.projectId,
                commits: action.payload.commits,
                headId: action.payload.headId,
                selectedId: action.payload.headId, // snap to new head after mutations
                optimisticMessages: [],
            };
        case 'OPTIMISTIC_ADD_MESSAGE':
            return { ...base, optimisticMessages: [...base.optimisticMessages, action.msg] };
        case 'ROLLBACK_OPTIMISTIC_MESSAGE':
            return {
                ...base,
                optimisticMessages: base.optimisticMessages.filter(m => m.id !== action.id),
            };
        case 'CLEAR_OPTIMISTIC_MESSAGES':
            return { ...base, optimisticMessages: [] };
        default:
            return base;
    }
}

export function ProjectStoreProvider({
                                         initial,
                                         children,
                                     }: {
    initial: ProjectState;
    children: React.ReactNode;
}) {
    const [base, dispatch] = useReducer(reducer, {
        projectId: initial.projectId,
        commits: initial.commits,
        headId: initial.headId,
        selectedId: initial.headId,
        optimisticMessages: [],
    });

    const generator = useMemo(
        () => pickGeneratorAt(base.commits, base.selectedId),
        [base.commits, base.selectedId]
    );

    const messages = useMemo(
        () => aggregateMessages(base.commits, base.selectedId),
        [base.commits, base.selectedId]
    );

    const store: Store = {
        state: { projectId: base.projectId, commits: base.commits, headId: base.headId, selectedId: base.selectedId },
        generator,
        messages,
        optimisticMessages: base.optimisticMessages,

        init: (payload) => dispatch({ type: 'INIT', payload }),
        selectCommit: (id) => dispatch({ type: 'SELECT_COMMIT', id }),

        addOptimisticMessage: (msg) => dispatch({ type: 'OPTIMISTIC_ADD_MESSAGE', msg }),
        rollbackOptimisticMessage: (id) => dispatch({ type: 'ROLLBACK_OPTIMISTIC_MESSAGE', id }),
        clearOptimisticMessages: () => dispatch({ type: 'CLEAR_OPTIMISTIC_MESSAGES' }),

        replaceWithServer: (payload) => dispatch({ type: 'REPLACE_WITH_SERVER_STATE', payload }),
    };

    return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProjectStore(): Store {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useProjectStore must be used inside ProjectStoreProvider');
    return ctx;
}


/** Minimal optimistic wrapper: run(), then onSuccess/ onError. */
export async function optimistic<T>(
    run: () => Promise<T>,
    onSuccess: (result: T) => void,
    onError?: (e: unknown) => void
) {
    try {
        const result = await run();
        onSuccess(result);
    } catch (e) {
        onError?.(e);
    }
}