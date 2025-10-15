'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { GitBranch, Clock, Star } from 'lucide-react';
import useCommit from '@/app/(lang)/[lang]/ai/hooks/useCommit';
import { CommitButtonWithContainer } from '@/app/(lang)/[lang]/ai/components/CommitsPanel/CommitButtonWithContainer';
import type { Commit } from '@/app/(lang)/[lang]/ai/store/slices/commitsSlice';

/**
 * Unified Commits Panel
 * - Uses new Redux-based commit logic
 * - Keeps the modern grouped layout and styling of the original
 */
export function CommitsPanel() {
    const { commits, headId } = useCommit();

    // Memoize sorted + grouped commits
    const groupedCommits = useMemo(() => {
        if (!commits || Object.keys(commits).length === 0) return {};

        const sorted = (Object.values(commits) as Commit[])
            .filter(Boolean)
            .sort(
                (a:Commit, b:Commit) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

        const groups: Record<string, Commit[]> = {};
        sorted.forEach((c) => {
            const date = new Date(c.createdAt);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            let label: string;
            if (date.toDateString() === today.toDateString()) label = 'Today';
            else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
            else
                label = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });

            if (!groups[label]) groups[label] = [];
            groups[label].push(c);
        });

        return groups;
    }, [commits]);

    if (!commits || Object.keys(commits).length === 0) {
        return (
            <section className="bg-white border rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center text-gray-500">
                <GitBranch className="w-8 h-8 mb-3 text-gray-300" />
                <p className="text-sm">No commits yet</p>
            </section>
        );
    }

    const formatTime = (t: string) =>
        new Date(t).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

    return (
        <section className="bg-white border rounded-2xl shadow overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b px-5 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <GitBranch className="w-5 h-5" />
                    Commit Timeline
                </h2>
            </div>

            {/* Grouped commits */}
            <div className="flex-1 overflow-y-auto">
                {Object.entries(groupedCommits).map(([date, items]) => (
                    <div key={date} className="border-b border-gray-100 last:border-b-0">
                        <div className="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {date}
                        </div>
                        <ul className="p-2 space-y-2">
                            {items.map((commit) => (
                                <li
                                    key={commit.id}
                                    className={`relative rounded-xl border transition-all ${
                                        commit.id === headId
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 p-3">
                                        <div className="flex-1 min-w-0">
                                            {/* The actual commit button */}
                                            <CommitButtonWithContainer
                                                type="div"
                                                commit={commit}
                                                headId={headId}
                                            />
                                            {commit.snapshot.model && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
                                                        3D Model Ready
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
