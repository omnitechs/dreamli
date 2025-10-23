import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ModelGridClient from './ModelGridClient';
import ProjectCommentsClient from './ProjectCommentsClient';

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
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{project.name}</h1>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(project.createdAt).toLocaleString()}
            {owner ? (
              <>
                <span> • by </span>
                <span>{owner.name || 'User'}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="text-sm text-gray-500">{models.length} model{models.length === 1 ? '' : 's'}</div>
      </div>

      {/* Models grid */}
      <div className="bg-white border rounded-xl p-4">
        {!models.length ? (
          <div className="text-sm text-gray-500">No models found for this project yet.</div>
        ) : (
          // Client-side interactive grid that opens a 3D viewer on click
          <ModelGridClient models={models as any} />
        )}
      </div>

      {/* Images section */}
      <div className="space-y-2">
        <div className="font-medium">Images</div>
        {!images.length ? (
          <div className="text-sm text-gray-500">No images in this project.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.id} src={im.url} alt={im.id} className="w-full h-28 object-cover rounded-md border" />
            ))}
          </div>
        )}
      </div>

      {/* Conversation section */}
      <div className="space-y-2">
        <div className="font-medium">Conversation</div>
        {!messages.length ? (
          <div className="text-sm text-gray-500">No messages recorded for this project.</div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="border rounded-lg p-2 bg-white">
                <div className="text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-2">
                  <span>{m.role}</span>
                  <span>•</span>
                  <span>{new Date(m.createdAtMs).toLocaleString()}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Comments */}
      {models.length ? (
        <div className="space-y-2" id="comments">
          <div className="font-medium">Community comments</div>
          <ProjectCommentsClient models={models as any} />
        </div>
      ) : null}
    </div>
  );
}
