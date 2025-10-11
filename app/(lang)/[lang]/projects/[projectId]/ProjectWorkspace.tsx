'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProjectState, CommitJSON, Message, GeneratorSnapshot } from '../types';
import { initProject } from './actions';
import { CommitsPanel } from './components/CommitsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { GeneratorPanel } from './components/GeneratorPanel';

interface ProjectWorkspaceProps {
    projectId: string;
}

/** Build the aggregated messages up to (and including) the selected commit. */
function aggregateMessages(commits: CommitJSON[], selectedId: string): Message[] {
    if (!commits.length) return [];
    // commits are "newest first" per your store — we need root->selected chain
    // 1) find the selected commit in the newest-first array
    const selIdx = commits.findIndex((c) => c.id === selectedId);
    if (selIdx === -1) return [];
    // 2) Take all commits from selected to the end (because it's newest-first)
    const newestFirstSlice = commits.slice(selIdx); // selected .. oldest
    // 3) Reverse to root->selected
    const chainRootToSelected = [...newestFirstSlice].reverse();
    // 4) Concatenate their messages in order
    const msgs: Message[] = [];
    for (const c of chainRootToSelected) if (c.messages?.length) msgs.push(...c.messages);
    return msgs;
}

function pickGeneratorAt(commits: CommitJSON[], selectedId: string): GeneratorSnapshot | null {
    const c = commits.find((x) => x.id === selectedId);
    return (c?.generator as GeneratorSnapshot) ?? null;
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
    // Raw cached data (download once)
    const [commits, setCommits] = useState<CommitJSON[]>([]);
    const [headId, setHeadId] = useState<string | null>(null);

    // UI state
    const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial load (single server call)
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const state: ProjectState = await initProject(projectId);
                if (!alive) return;
                setCommits(state.commits);        // cache ALL commits (newest first)
                setHeadId(state.headId);
                setSelectedCommitId(state.headId); // default selection = head
            } catch (err) {
                console.error('Failed to load project:', err);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [projectId]);

    // Derived data for the middle + right panels based on selected commit (client only)
    const derived = useMemo(() => {
        if (!selectedCommitId) return null;
        const generator = pickGeneratorAt(commits, selectedCommitId);
        if (!generator) return null;
        const messages = aggregateMessages(commits, selectedCommitId);
        return { generator, messages };
    }, [commits, selectedCommitId]);

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

    if (!commits.length || !headId || !derived) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Project not found</p>
                </div>
            </div>
        );
    }

    const { generator, messages } = derived;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop 3-pane layout */}
            <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.7fr)_minmax(0,1fr)] min-h-screen">
                <CommitsPanel
                    commits={commits}
                    headId={selectedCommitId ?? headId}
                    projectId={projectId}
                    // ← NEW: purely local selection, no server call
                    onSelectCommit={(commitId: string) => setSelectedCommitId(commitId)}
                    // keep onStateUpdate for future mutations if you need it
                    onStateUpdate={(_next: ProjectState) => {
                        // when you do a server mutation (add message/image), replace cached commits:
                        setCommits(_next.commits);
                        setHeadId(_next.headId);
                        setSelectedCommitId(_next.headId);
                    }}
                />
                <MessagesPanel
                    messages={messages}
                    projectId={projectId}
                    headId={selectedCommitId || ""}
                    models={(generator as any)?.models ?? []}
                    onStateUpdate={(_next: ProjectState) => {
                        setCommits(_next.commits);
                        setHeadId(_next.headId);
                        setSelectedCommitId(_next.headId);
                    }}
                />
                <GeneratorPanel
                    generator={generator}
                    headId={selectedCommitId || ""}
                    projectId={projectId}
                    onStateUpdate={(_next: ProjectState) => {
                        setCommits(_next.commits);
                        setHeadId(_next.headId);
                        setSelectedCommitId(_next.headId);
                    }}
                />
            </div>

            {/* Mobile/tablet stacked layout */}
            <div className="xl:hidden">
                <div className="space-y-6 p-4">
                    <CommitsPanel
                        commits={commits}
                        headId={headId}
                        projectId={projectId}
                        onSelectCommit={(commitId: string) => setSelectedCommitId(commitId)}
                        onStateUpdate={(_next: ProjectState) => {
                            setCommits(_next.commits);
                            setHeadId(_next.headId);
                            setSelectedCommitId(_next.headId);
                        }}
                    />
                    <MessagesPanel
                        messages={messages}
                        projectId={projectId}
                        headId={selectedCommitId || ""}
                        models={(generator as any)?.models ?? []}
                        onStateUpdate={(_next: ProjectState) => {
                            setCommits(_next.commits);
                            setHeadId(_next.headId);
                            setSelectedCommitId(_next.headId);
                        }}
                    />
                    <GeneratorPanel
                        generator={generator}
                        headId={selectedCommitId || ""}
                        projectId={projectId}
                        onStateUpdate={(_next: ProjectState) => {
                            setCommits(_next.commits);
                            setHeadId(_next.headId);
                            setSelectedCommitId(_next.headId);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
