'use client';

import { useEffect, useState } from 'react';
import type { ProjectState } from '../types';
import { initProject } from './actions';
import { CommitsPanel } from './components/CommitsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { GeneratorPanel } from './components/GeneratorPanel';
import { ProjectStoreProvider, useProjectStore } from '../state/ProjectStore';

interface ProjectWorkspaceProps {
    projectId: string;
}

function WorkspaceInner({ projectId }: { projectId: string }) {
    const { state, generator, messages, selectCommit, replaceWithServer } = useProjectStore();
    const [modelsForPanel, setModelsForPanel] = useState<any[]>([]);

    // derive models (modern or legacy) for the selected commit
    useEffect(() => {
        const selected = state.commits.find(c => c.id === state.selectedId);
        const modern = (generator as any)?.models ?? [];
        const legacy = selected?.model
            ? [{
                id: selected.id,
                provider: 'legacy',
                taskId: selected.id,
                kind: 'image',
                modelUrls: { glb: selected.model.asset?.src },
                thumbnailUrl: selected.model.previewSrc,
                createdAt: selected.timestamp,
            }]
            : [];
        setModelsForPanel(Array.isArray(modern) && modern.length > 0 ? modern : legacy);
    }, [state.selectedId, state.commits, generator]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.7fr)_minmax(0,1fr)] min-h-screen">
                <CommitsPanel
                    commits={state.commits}
                    headId={state.selectedId ?? state.headId} // highlight selection
                    projectId={state.projectId}
                    onSelectCommit={(id) => selectCommit(id)}
                    onStateUpdate={(next) => replaceWithServer(next)}
                />
                <MessagesPanel
                    messages={messages}
                    projectId={state.projectId}
                    headId={state.selectedId || ''}        // keep prop simple
                    models={modelsForPanel}
                    onStateUpdate={(next) => replaceWithServer(next)}
                />
                <GeneratorPanel
                    generator={generator!}
                    headId={state.selectedId}
                    projectId={state.projectId}
                    onStateUpdate={(next) => replaceWithServer(next)}
                />
            </div>

            {/* Mobile */}
            <div className="xl:hidden">
                <div className="space-y-6 p-4">
                    <CommitsPanel
                        commits={state.commits}
                        headId={state.selectedId ?? state.headId}
                        projectId={state.projectId}
                        onSelectCommit={(id) => selectCommit(id)}
                        onStateUpdate={(next) => replaceWithServer(next)}
                    />
                    <MessagesPanel
                        messages={messages}
                        projectId={state.projectId}
                        headId={state.selectedId || ''}
                        models={modelsForPanel}
                        onStateUpdate={(next) => replaceWithServer(next)}
                    />
                    <GeneratorPanel
                        generator={generator!}
                        headId={state.selectedId}
                        projectId={state.projectId}
                        onStateUpdate={(next) => replaceWithServer(next)}
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
            <WorkspaceInner projectId={projectId} />
        </ProjectStoreProvider>
    );
}
