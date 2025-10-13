'use client';

import Link from 'next/link';
import { useGetProjectsQuery, useCreateProjectMutation } from '@/app/(lang)/[lang]/ai/services/api';
import { useState } from 'react';

export default function ProjectsPage() {
    const { data: projects, isLoading } = useGetProjectsQuery();
    const [createProject, { isLoading: creating }] = useCreateProjectMutation();
    const [name, setName] = useState('');

    const onCreate = async () => {
        if (!name.trim()) return;
        await createProject({ name: name.trim() });
        setName('');
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Projects</h1>

            <div className="bg-white border rounded-xl p-4 flex gap-2">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New project name"
                    className="flex-1 border rounded-lg p-2"
                />
                <button
                    onClick={onCreate}
                    disabled={creating}
                    className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white disabled:opacity-50"
                >
                    {creating ? 'Creating…' : 'Create'}
                </button>
            </div>

            <div className="bg-white border rounded-xl p-4">
                {isLoading ? (
                    <div>Loading…</div>
                ) : !projects?.length ? (
                    <div className="text-sm text-gray-500">No projects yet.</div>
                ) : (
                    <ul className="space-y-2">
                        {projects.map((p) => (
                            <li key={p.id} className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                                </div>
                                <Link
                                    href={`/en/ai/${p.id}`} // change /en to your lang segment
                                    className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50"
                                >
                                    Open
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
