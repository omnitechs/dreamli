'use client';

import React, { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LazyGlb from '@/components/GlbViewer';
import { useGetModelByIdQuery, useGetPublicCommitByIdQuery } from '@/app/(lang)/[lang]/ai/services/api';

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

function slugify(s: string | undefined | null) {
  const base = (s || '').toString().toLowerCase();
  return base
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'model';
}

export default function ModelDetailsPage() {
  const params = useParams<{ slug: string; modelId: string }>();
  const router = useRouter();
  const modelId = params?.modelId as string;

  const { data: model, isFetching: loadingModel, isError: modelErr } = useGetModelByIdQuery({ modelId }, { skip: !modelId });
  const commitId = model?.commitId as string | undefined;
  const { data: commit, isFetching: loadingCommit } = useGetPublicCommitByIdQuery({ commitId: commitId as string }, { skip: !commitId });

  const modelUrl = pickBestModelUrl(model?.modelUrls);
  const title = useMemo(() => (model?.prompt ? model.prompt : model?.kind ? String(model.kind) : '3D Model'), [model]);
  const computedSlug = slugify(title);

  // If slug doesn't match, replace for canonical URL
  if (typeof window !== 'undefined') {
    const slugParam = (params?.slug as string) || '';
    if (computedSlug && slugParam && computedSlug !== slugParam) {
      router.replace(`/en/ai/models/${computedSlug}/${encodeURIComponent(modelId)}`);
    }
  }

  // Redirect this model details page to the new project-level page for SEO unification
  useEffect(() => {
    if ((model as any)?.projectId) {
      const pslug = slugify(((model as any)?.projectName) || 'project');
      router.replace(`/en/ai/projects/${pslug}/${encodeURIComponent((model as any).projectId)}`);
    }
  }, [model?.projectId]);

  const images: Array<{ id: string; url: string }>
    = Array.isArray((commit as any)?.snapshot?.images)
      ? (commit as any).snapshot.images.map((i: any) => ({ id: String(i?.id || i?.key || i?.url), url: String(i?.url || '') })).filter((i: any) => i.url)
      : [];

  const messages: Array<any> = Array.isArray((commit as any)?.snapshot?.messages) ? (commit as any).snapshot.messages : [];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
          <div className="text-xs text-gray-500 mt-1">
            {model?.createdAt ? new Date(model.createdAt).toLocaleString() : ''}
            {model?.projectId && model?.commitId ? (
              <>
                <span> • Commit </span>
                <code className="bg-gray-100 px-1 py-0.5 rounded">{model.commitId.slice(0, 8)}</code>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          {model?.id ? (
            <Link href={`/en/ai/purchase?modelId=${encodeURIComponent(model.id)}`} className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white">Buy</Link>
          ) : null}
          {modelUrl ? (
            <a href={modelUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50">Download</a>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden bg-white">
        <div className="aspect-video bg-gray-50">
          {modelUrl ? (
            <LazyGlb key={modelUrl || model?.id} modelUrl={modelUrl} />
          ) : model?.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={model.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No preview available</div>
          )}
        </div>
      </div>

      {/* Commit images */}
      <div className="space-y-2">
        <div className="font-medium">Images from this commit</div>
        {loadingCommit ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : images.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.id} src={im.url} alt={im.id} className="w-full h-32 object-cover rounded-md border" />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No images in this commit.</div>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        <div className="font-medium">Conversation</div>
        {messages.length ? (
          <div className="space-y-2">
            {messages.map((m, idx) => (
              <div key={m?.id || idx} className="border rounded-lg p-2 bg-white">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">{String(m?.role || 'user')}</div>
                <div className="text-sm whitespace-pre-wrap">{String(m?.content || '')}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No conversation logs captured.</div>
        )}
      </div>

      {/* Other models in the same commit */}
      <div className="space-y-2">
        <div className="font-medium">Other models in this commit</div>
        {Array.isArray((commit as any)?.snapshot?.models) && (commit as any).snapshot.models.length > 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(commit as any).snapshot.models
              .filter((mm: any) => mm?.id && mm.id !== modelId)
              .map((mm: any) => {
                const url = pickBestModelUrl(mm?.modelUrls);
                const mslug = slugify(mm?.prompt || mm?.kind);
                return (
                  <div key={mm.id} className="border rounded-lg overflow-hidden">
                    {mm.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mm.thumbnailUrl} alt={mm.prompt || 'model'} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400">No preview</div>
                    )}
                    <div className="p-3 space-y-2">
                      <div className="text-sm line-clamp-2">{mm.prompt || '3D Model'}</div>
                      <div className="flex gap-2">
                        <Link href={`/en/ai/models/${mslug}/${encodeURIComponent(mm.id)}`} className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50">View</Link>
                        {url ? (
                          <a href={url} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50">Download</a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No additional models in this commit.</div>
        )}
      </div>
    </div>
  );
}
