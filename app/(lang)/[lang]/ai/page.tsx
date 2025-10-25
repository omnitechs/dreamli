'use client';

import Link from 'next/link';
import { useGetProjectsQuery, useCreateProjectMutation, useGetMarketplaceModelsQuery, useDownloadModelMutation } from '@/app/(lang)/[lang]/ai/services/api';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, MessageSquare, Upload, Cpu } from 'lucide-react';

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
    const t = useTranslations('AI.Page');
    const params = useParams<{ lang: string }>();
    const lang = (params?.lang || 'en') as string;

    const { data: session } = useSession();
    const isAuthed = !!(session as any)?.user?.id;

    const { data: projects, isLoading } = useGetProjectsQuery();
    const [createProject, { isLoading: creating }] = useCreateProjectMutation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Marketplace pagination
    const [page, setPage] = useState(1);
    const { data: marketData, isLoading: loadingMarket } = useGetMarketplaceModelsQuery({ page });
    const [downloadModel] = useDownloadModelMutation();
    const router = useRouter();
    const pathname = usePathname();
    const items = marketData?.items || [];

    const onCreate = async () => {
        if (!name.trim()) return;
        await createProject({ name: name.trim(), description: description.trim() || null });
        setName('');
        setDescription('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Project Studio</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Create, collaborate, and bring your ideas to life with AI-powered 3D generation.
                            Start a new project or continue working on your existing creations.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {isAuthed ? (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder={t('newProjectPlaceholder')}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                        placeholder="Describe your project idea..."
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
                                </div>
                                <button
                                    onClick={onCreate}
                                    disabled={creating || !name.trim()}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {t('creating')}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            {t('create')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span>You need to be logged in to create a project.</span>
                            <Link
                                href={`/${lang}/auth/login?redirect=${encodeURIComponent(pathname || `/${lang}/ai`)}`}
                                className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white"
                            >
                                Log in
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    {isLoading ? (
                        <div>{t('loading')}</div>
                    ) : !projects?.length ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500">Create your first AI project to get started!</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
                                <span className="text-sm text-gray-500">{projects.length} projects</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/${lang}/ai/${p.id}`}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{p.name}</h3>
                                            {!!p.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>0</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Upload className="w-4 h-4" />
                                                <span>0</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Cpu className="w-4 h-4" />
                                                <span>0</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">Community Highlights</h2>
                        <p className="text-gray-600">Discover amazing projects created by our community</p>
                    </div>
                    <Link
                        href={`/${lang}/marketplace`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                    >
                        Explore All Projects
                    </Link>
                </div>
                <div className="bg-white border rounded-2xl p-4">
                    {loadingMarket ? (
                        <div>{t('loading')}</div>
                    ) : !items?.length ? (
                        <div className="text-sm text-gray-500">{t('noModels')}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {items.map((m: any) => (
                                    <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <Link href={`/${lang}/ai/projects/${slugify(m.projectName || m.owner?.name || 'project')}/${encodeURIComponent(m.projectId)}`} className="block">
                                            <div className="aspect-[3/2] bg-gray-100 overflow-hidden">
                                                {m.thumbnailUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={m.thumbnailUrl} alt={m.prompt || t('modelAlt')} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">{t('noPreview')}</div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <Link href={`/${lang}/ai/projects/${slugify(m.projectName || m.owner?.name || 'project')}/${encodeURIComponent(m.projectId)}`} className="block mb-3">
                                                <div className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">{m.prompt || '3D Model'}</div>
                                            </Link>
                                            <div className="flex items-center gap-2 mb-3">
                                                {m.owner?.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={m.owner.image} alt={m.owner?.name || t('userFallback')} className="w-6 h-6 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                                                )}
                                                <span className="text-sm text-gray-600">{m.owner?.name || t('userFallback')}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-gray-500">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <svg
                                                            className={`w-4 h-4 ${m.userLiked ? 'text-red-500 fill-current' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                            />
                                                        </svg>
                                                        <span>{m.likesCount || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span>{m.commentsCount || 0}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
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
                                    {t('prev')}
                                </button>
                                <div className="text-sm text-gray-500">{t('page', { page })}</div>
                                <button
                                    onClick={() => setPage((p) => (marketData?.hasMore ? p + 1 : p))}
                                    disabled={!marketData?.hasMore}
                                    className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {t('next')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}
