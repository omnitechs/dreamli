'use client';

import Link from 'next/link';
import { useGetProjectsQuery, useCreateProjectMutation, useGetMarketplaceModelsQuery } from '@/app/(lang)/[lang]/ai/services/api';
import { useState } from 'react';

function slugify(s?: string) {
    const base = (s || '').toLowerCase();
    return base
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80) || 'model';
}

export default function ProjectsPage() {
    const { data: projects, isLoading } = useGetProjectsQuery();
    const [createProject, { isLoading: creating }] = useCreateProjectMutation();
    const [name, setName] = useState('');

    // Marketplace pagination
    const [page, setPage] = useState(1);
    const { data: marketData, isLoading: loadingMarket } = useGetMarketplaceModelsQuery({ page });
    const items = marketData?.items || [];

    const onCreate = async () => {
        if (!name.trim()) return;
        await createProject({ name: name.trim() });
        setName('');
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
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

            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Marketplace: 3D Models</h2>
                <div className="bg-white border rounded-xl p-4">
                    {loadingMarket ? (
                        <div>Loading…</div>
                    ) : !items?.length ? (
                        <div className="text-sm text-gray-500">No models available yet.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((m: any) => (
                                    <div key={m.id} className="border rounded-lg overflow-hidden">
                                        {m.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={m.thumbnailUrl} alt={m.prompt || '3D model'} className="w-full h-40 object-cover" />
                                        ) : (
                                            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No preview</div>
                                        )}
                                        <div className="p-3 space-y-2">
                                            <div className="text-sm line-clamp-2">{m.prompt || '3D Model'}</div>
                                            <div className="text-xs text-gray-500 flex items-center justify-between">
                                                <span>{m.owner?.name || 'User'}</span>
                                                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <Link
                                                    href={`/en/ai/projects/${slugify(m.projectName || m.owner?.name || 'project')}/${encodeURIComponent(m.projectId)}`}
                                                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/en/ai/purchase?modelId=${encodeURIComponent(m.id)}`}
                                                    className="px-3 py-1.5 text-sm rounded-md border bg-black text-white"
                                                >
                                                    Buy
                                                </Link>
                                                <a
                                                    href={m.modelUrls?.glb || m.modelUrls?.fbx || m.modelUrls?.obj || '#'}
                                                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <div className="text-sm text-gray-500">Page {page}</div>
                                <button
                                    onClick={() => setPage((p) => (marketData?.hasMore ? p + 1 : p))}
                                    disabled={!marketData?.hasMore}
                                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
