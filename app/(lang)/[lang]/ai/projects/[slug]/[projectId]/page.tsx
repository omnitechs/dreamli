import React from 'react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import ProjectCommentsClient from './ProjectCommentsClient';
import ProjectHeaderActionsClient from './ProjectHeaderActionsClient';
import ProjectModelSectionClient from './ProjectModelSectionClient';
import ReferenceImagesClient from './ReferenceImagesClient';

function slugify(s?: string | null) {
  const base = (s || '').toString().toLowerCase();
  return (
    base
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'project'
  );
}

function pickBestModelUrl(modelUrls?: Record<string, string | undefined>) {
  if (!modelUrls) return undefined;
  return modelUrls.glb || modelUrls.fbx || modelUrls.obj || modelUrls.usdz || undefined;
}

export default async function ProjectPublicPage({ params }: { params: Promise<{ slug: string; projectId: string }> }) {
  const { projectId, slug } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true, createdAt: true },
  });
  if (!project) return notFound();

  const desired = slugify(project.name);
  if (desired !== slug) {
    // Canonicalize slug server-side for SEO
    redirect(`/en/ai/projects/${desired}/${encodeURIComponent(projectId)}`);
  }

  const owner = project.ownerId
    ? await prisma.user.findUnique({ where: { id: project.ownerId }, select: { id: true, name: true, image: true } })
    : null;

  const commits = await prisma.commit.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, createdAt: true, snapshot: true },
  });

  type AnyModel = any;
  const modelsMap = new Map<string, any>();

  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const models: AnyModel[] = Array.isArray(snap?.models) ? snap.models : [];
    for (const m of models) {
      if (!m || typeof m !== 'object') continue;
      const status = (m.status || '').toString().toUpperCase();
      const bestUrl = pickBestModelUrl(m.modelUrls);
      if (status !== 'SUCCEEDED' || !bestUrl) continue; // only finished, downloadable models
      const id = String(m.id || '');
      if (!id || modelsMap.has(id)) continue; // dedupe by model id across commits

      modelsMap.set(id, {
        id: m.id,
        taskId: m.taskId,
        provider: m.provider,
        kind: m.kind,
        prompt: m.prompt || '',
        thumbnailUrl: m.thumbnailUrl || m?.imageUrls?.[0] || null,
        previewVideoUrl: m.previewVideoUrl || null,
        modelUrls: m.modelUrls || {},
        createdAt: m.createdAt || c.createdAt,
        commitId: c.id,
      });
    }
  }

  const models = Array.from(modelsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Collect all images across commits (dedupe by URL)
  const isHttp = (u: unknown) => typeof u === 'string' && /^https?:\/\//i.test(u as string);
  const imageMap = new Map<string, { id: string; url: string; commitId: string; createdAtMs: number }>();
  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const imgs: any[] = Array.isArray(snap?.images) ? snap.images : [];
    for (const im of imgs) {
      const url = String(im?.url || '');
      if (!url || !isHttp(url)) continue;
      if (imageMap.has(url)) continue;
      const id = String(im?.id || im?.key || url);
      const createdAtMs = new Date((c as any).createdAt).getTime();
      imageMap.set(url, { id, url, commitId: c.id, createdAtMs });
    }
  }
  const images = Array.from(imageMap.values()).sort((a, b) => b.createdAtMs - a.createdAtMs);

  // Collect all messages across commits; sort by message.createdAt (fallback to commit createdAt)
  const msgMap = new Map<string, { id: string; role: string; content: string; createdAtMs: number; commitId: string }>();
  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const msgs: any[] = Array.isArray(snap?.messages) ? snap.messages : [];
    for (let i = 0; i < msgs.length; i++) {
      const m: any = msgs[i];
      if (!m) continue;
      const id = String(m?.id || `${c.id}:${i}`);
      if (msgMap.has(id)) continue;
      const ts = m?.createdAt ? new Date(m.createdAt as any).getTime() : new Date((c as any).createdAt).getTime();
      msgMap.set(id, {
        id,
        role: String(m?.role || 'user'),
        content: String(m?.content || ''),
        createdAtMs: ts,
        commitId: c.id,
      });
    }
  }
  const messages = Array.from(msgMap.values()).sort((a, b) => a.createdAtMs - b.createdAtMs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {owner?.image ? (
                <Image src={owner.image} alt={owner.name || 'User'} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                  {(owner?.name || 'U').charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-600">{owner ? <>by {owner.name || 'User'}</> : null}</p>
              </div>
            </div>
            <ProjectHeaderActionsClient modelId={(models as any)?.[0]?.id || null} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* 3D Model Section */}
        <ProjectModelSectionClient models={models as any} />

        {/* Images Section */}
        <ReferenceImagesClient images={images as any} />

        {/* Creation Process Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Creation Process</h2>
          {!messages.length ? (
            <div className="text-sm text-gray-500">No messages recorded for this project.</div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {m.role === 'user' ? (
                      <i className="ri-user-line text-lg"></i>
                    ) : (
                      <i className="ri-robot-line text-lg"></i>
                    )}
                  </div>
                  <div className={`flex-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">{new Date(m.createdAtMs).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Comments Section */}
        {models.length ? (
          <ProjectCommentsClient models={models as any} />
        ) : null}
      </div>
    </div>
  );
}
