'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GeneratorSnapshot, ProjectState } from '../types';
import { initProject } from './actions';
import { CommitsPanel } from './components/CommitsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { GeneratorPanel } from './components/GeneratorPanel';
import { ProjectStoreProvider, useProjectStore } from '../state/ProjectStore';

interface ProjectWorkspaceProps {
    projectId: string;
}

function WorkspaceInner({
                            projectId,
                            initialServerState,
                        }: {
    projectId: string;
    initialServerState: ProjectState;
}) {
    // Keep a local copy of the latest server snapshot for easy passing to children
    const [serverState, setServerState] = useState<ProjectState>(initialServerState);

    // ---- Project store (your Context reducer) ----
    const {
        state: { projectId: pid, commits, headId, selectedId },
        generator,
        messages,
        replaceWithServer,
        selectCommit,
        effectiveHeadId,
    } = useProjectStore();

    // Active commit = selected (store) or server head
    const activeCommitId = selectedId || headId;

    // All server mutations should use the effective head derived from the store
    const headForActions = effectiveHeadId(serverState.headId);

    // Derive models for the selected commit (modern or legacy)
    const modelsForPanel = useMemo(() => {
        const modern = (generator as any)?.models ?? [];
        if (Array.isArray(modern) && modern.length > 0) return modern;

        const selected = commits.find((c) => c.id === activeCommitId);
        if (selected?.model) {
            return [
                {
                    id: selected.id,
                    provider: 'legacy',
                    taskId: selected.id,
                    kind: 'image',
                    modelUrls: { glb: selected.model.asset?.src },
                    thumbnailUrl: selected.model.previewSrc,
                    createdAt: selected.timestamp,
                },
            ];
        }
        return [];
    }, [generator, commits, activeCommitId]);

    // When children call onStateUpdate(next), keep BOTH our local server state AND the store in sync
    const reconcile = (next: ProjectState) => {
        setServerState(next);
        replaceWithServer(next);
    };

    // Safety: don’t render the working panels if generator is missing (e.g., during fast selection swaps)
    if (!generator) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Preparing workspace…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop 3-pane layout */}
            <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.7fr)_minmax(0,1fr)] min-h-screen">
                <CommitsPanel
                    commits={commits}
                    headId={headId}
                    selectedId={activeCommitId}
                    projectId={pid}
                    onSelectCommit={(id) => selectCommit(id)}   // local select only (no DB)
                    onStateUpdate={reconcile}                   // fallback if used
                />

                <MessagesPanel
                    messages={messages}
                    projectId={pid}
                    headId={headForActions}                     // ensure actions mutate from selected commit
                    models={modelsForPanel}
                    onStateUpdate={reconcile}
                />

                <GeneratorPanel
                    generator={generator as GeneratorSnapshot}
                    headId={headForActions}                     // ensure actions mutate from selected commit
                    projectId={pid}
                    onStateUpdate={reconcile}
                />
            </div>

            {/* Mobile/tablet stacked layout */}
            <div className="xl:hidden">
                <div className="space-y-6 p-4">
                    <CommitsPanel
                        commits={commits}
                        headId={headId}
                        selectedId={activeCommitId}
                        projectId={pid}
                        onSelectCommit={(id) => selectCommit(id)}
                        onStateUpdate={reconcile}
                    />

                    <MessagesPanel
                        messages={messages}
                        projectId={pid}
                        headId={headForActions}
                        models={modelsForPanel}
                        onStateUpdate={reconcile}
                    />

                    <GeneratorPanel
                        generator={generator as GeneratorSnapshot}
                        headId={headForActions}
                        projectId={pid}
                        onStateUpdate={reconcile}
                    />
                </div>
            </div>
        </div>
    );
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
    const [initial, setInitial] = useState<ProjectState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const s = await initProject(projectId);
                setInitial(s);
            } finally {
                setLoading(false);
            }
        })();
    }, [projectId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!initial) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Project not found</p>
                </div>
            </div>
        );
    }

    return (
        <ProjectStoreProvider initial={initial}>
            <WorkspaceInner projectId={projectId} initialServerState={initial} />
        </ProjectStoreProvider>
    );
}
