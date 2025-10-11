'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { CommitJSON, Message, ProjectState, GeneratorSnapshot } from '../types';

type ProjectViewState = {
    projectId: string;
    commits: CommitJSON[];          // newest first
    headId: string;
    selectedId: string;             // UI selection (defaults to head)
    optimisticMessages: Message[];
};

type Action =
    | { type: 'INIT'; payload: ProjectState }
    | { type: 'SELECT_COMMIT'; id: string }
    | { type: 'REPLACE_WITH_SERVER_STATE'; payload: ProjectState }
    | { type: 'OPTIMISTIC_ADD_MESSAGE'; msg: Message }
    | { type: 'ROLLBACK_OPTIMISTIC_MESSAGE'; id: string }
    | { type: 'CLEAR_OPTIMISTIC_MESSAGES' };

type Store = {
    state: {
        projectId: string;
        commits: CommitJSON[];
        headId: string;
        selectedId: string;
    };

    // derived
    generator: GeneratorSnapshot | null;
    messages: Message[];           // server messages up to selected
    optimisticMessages: Message[]; // not merged
    combinedMessages: Message[];   // messages + optimistic

    // actions
    init: (initial: ProjectState) => void;
    selectCommit: (id: string) => void;

    // optimistic msg helpers
    addOptimisticMessage: (m: Message) => void;
    rollbackOptimisticMessage: (id: string) => void;
    clearOptimisticMessages: () => void;

    // server reconciliation
    replaceWithServer: (next: ProjectState) => void;

    // utility: which head should mutations use
    effectiveHeadId: (serverHeadId: string) => string;
};

const Ctx = createContext<Store | null>(null);

/**
 * Given newest-first commits, aggregate messages from root → selected.
 * If commits = [C5, C4, C3, C2, C1] (newest→oldest) and selected=C3 (idx=2),
 * slice(idx) = [C3, C2, C1], reverse() = [C1, C2, C3] (root→selected).
 */
function aggregateMessages(commits: CommitJSON[], selectedId: string): Message[] {
    const selIdx = commits.findIndex((c) => c.id === selectedId);
    if (selIdx === -1) return [];
    const slice = commits.slice(selIdx).reverse();
    const out: Message[] = [];
    for (const c of slice) if (c.messages?.length) out.push(...c.messages);
    return out;
}

function pickGeneratorAt(commits: CommitJSON[], selectedId: string): GeneratorSnapshot | null {
    return (commits.find((c) => c.id === selectedId)?.generator as GeneratorSnapshot) ?? null;
}

function reducer(
    base: ProjectViewState,
    action: Action
): ProjectViewState {
    switch (action.type) {
        case 'INIT': {
            return {
                projectId: action.payload.projectId,
                commits: action.payload.commits,
                headId: action.payload.headId,
                selectedId: action.payload.headId,   // start following head
                optimisticMessages: [],
            };
        }
        case 'SELECT_COMMIT':
            return { ...base, selectedId: action.id };

        case 'REPLACE_WITH_SERVER_STATE': {
            const next = action.payload;

            // newest-first: next.commits[0] is the commit we just created (if any)
            const newest = next.commits[0];

            // keep current selection if it still exists
            const selectedStillExists = next.commits.some(c => c.id === base.selectedId);

            // If we just created a new commit whose parent is the current selection,
            // auto-advance selection to that new commit so the UI shows the changes.
            const shouldAdvance =
                !!newest &&
                !!newest.parentId &&
                newest.parentId === base.selectedId;

            return {
                projectId: next.projectId,
                commits: next.commits,
                headId: next.headId,
                selectedId: shouldAdvance
                    ? newest.id
                    : (selectedStillExists ? base.selectedId : next.headId),
                optimisticMessages: [], // clear on successful reconciliation
            };
        }

        case 'OPTIMISTIC_ADD_MESSAGE':
            return { ...base, optimisticMessages: [...base.optimisticMessages, action.msg] };

        case 'ROLLBACK_OPTIMISTIC_MESSAGE':
            return {
                ...base,
                optimisticMessages: base.optimisticMessages.filter((m) => m.id !== action.id),
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

    const combinedMessages = useMemo(
        () => [...messages, ...base.optimisticMessages],
        [messages, base.optimisticMessages]
    );

    const store: Store = {
        state: {
            projectId: base.projectId,
            commits: base.commits,
            headId: base.headId,
            selectedId: base.selectedId,
        },

        generator,
        messages,
        optimisticMessages: base.optimisticMessages,
        combinedMessages,

        init: (payload) => dispatch({ type: 'INIT', payload }),
        selectCommit: (id) => dispatch({ type: 'SELECT_COMMIT', id }),

        addOptimisticMessage: (msg) => dispatch({ type: 'OPTIMISTIC_ADD_MESSAGE', msg }),
        rollbackOptimisticMessage: (id) => dispatch({ type: 'ROLLBACK_OPTIMISTIC_MESSAGE', id }),
        clearOptimisticMessages: () => dispatch({ type: 'CLEAR_OPTIMISTIC_MESSAGES' }),

        replaceWithServer: (payload) => dispatch({ type: 'REPLACE_WITH_SERVER_STATE', payload }),

        effectiveHeadId: (serverHeadId) => base.selectedId || serverHeadId,
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
        return result;
    } catch (e) {
        onError?.(e);
        throw e;
    }
}
