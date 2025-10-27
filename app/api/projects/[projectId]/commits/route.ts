import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { fromSnapshot, toSnapshot } from '@/app/(lang)/[lang]/ai/libs/snapshots';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import crypto from 'crypto';

// ---- Helpers to localize Meshy assets into durable blob URLs ----
function isHttpUrl(u: unknown): u is string {
    return typeof u === 'string' && /^https?:\/\//i.test(u);
}
function isMeshyHost(u: string): boolean {
    try {
        const { hostname } = new URL(u);
        const h = hostname.toLowerCase();
        return h === 'meshy.ai' || h.endsWith('.meshy.ai') || h === 'assets.meshy.ai' || h.endsWith('.assets.meshy.ai');
    } catch {
        return false;
    }
}
function pickExt(pathname: string, contentType?: string | null): string {
    const m = /\.([a-z0-9]+)$/i.exec(pathname || '');
    if (m) return `.${m[1].toLowerCase()}`;
    switch ((contentType || '').toLowerCase()) {
        case 'image/png': return '.png';
        case 'image/jpeg':
        case 'image/jpg': return '.jpg';
        case 'image/webp': return '.webp';
        case 'model/gltf-binary': return '.glb';
        case 'model/gltf+json': return '.gltf';
        case 'model/vnd.usdz+zip': return '.usdz';
        case 'model/obj':
        case 'text/plain': return '.obj';
        case 'model/fbx':
        case 'application/octet-stream': return '.fbx';
        case 'video/mp4': return '.mp4';
        default: return '.bin';
    }
}
const rehostCache = new Map<string, string>();
async function rehostUrl(srcUrl: string, prefix: string): Promise<string> {
    if (!isHttpUrl(srcUrl)) return srcUrl;
    if (!isMeshyHost(srcUrl)) return srcUrl; // only localize Meshy assets per requirement
    const cached = rehostCache.get(srcUrl);
    if (cached) return cached;
    try {
        const res = await fetch(srcUrl, { cache: 'no-store' });
        if (!res.ok) return srcUrl;
        const arrayBuffer = await res.arrayBuffer();
        const u = new URL(srcUrl);
        const ext = pickExt(u.pathname, res.headers.get('content-type'));
        const key = `uploads/models/${Date.now()}-${crypto.randomUUID()}-${prefix}${ext}`;
        const blob = await put(key, arrayBuffer, {
            access: 'public',
            contentType: res.headers.get('content-type') || 'application/octet-stream',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        rehostCache.set(srcUrl, blob.url);
        return blob.url;
    } catch (e) {
        console.error('[COMMITS] rehostUrl failed', e);
        return srcUrl;
    }
}
async function localizeModel(model: any): Promise<any> {
    const out: any = { ...model };
    // modelUrls: { glb/fbx/obj/usdz: url }
    const fmt = out.modelUrls && typeof out.modelUrls === 'object' ? { ...out.modelUrls } : {};
    for (const k of Object.keys(fmt)) {
        const v = fmt[k];
        if (isHttpUrl(v)) {
            fmt[k] = await rehostUrl(v, `model_${k}`);
        }
    }
    out.modelUrls = fmt;
    // textureUrls: Array<Record<string,string>>
    if (Array.isArray(out.textureUrls)) {
        const newTex: Array<Record<string, string>> = [];
        for (let i = 0; i < out.textureUrls.length; i++) {
            const rec = out.textureUrls[i] || {};
            const nextRec: Record<string, string> = {};
            for (const [k, v] of Object.entries(rec)) {
                nextRec[k] = isHttpUrl(v) ? await rehostUrl(String(v), `tex_${i}_${k}`) : String(v);
            }
            newTex.push(nextRec);
        }
        out.textureUrls = newTex;
    }
    // imageUrls (references)
    if (Array.isArray(out.imageUrls)) {
        const newRefs: string[] = [];
        for (let i = 0; i < out.imageUrls.length; i++) {
            const u = out.imageUrls[i];
            newRefs.push(isHttpUrl(u) ? await rehostUrl(String(u), `ref_${i}`) : String(u));
        }
        out.imageUrls = newRefs;
    }
    // thumbnail
    if (isHttpUrl(out.localThumbnailUrl)) {
        // already localized
    } else if (isHttpUrl(out.thumbnailUrl)) {
        const loc = await rehostUrl(out.thumbnailUrl, 'thumb');
        if (loc && loc !== out.thumbnailUrl) {
            out.localThumbnailUrl = loc;
            out.thumbnailUrl = loc; // ensure commit uses durable URL
        }
    }
    // previewVideoUrl
    if (isHttpUrl(out.previewVideoUrl)) {
        const loc = await rehostUrl(out.previewVideoUrl, 'preview');
        if (loc && loc !== out.previewVideoUrl) out.previewVideoUrl = loc;
    }
    return out;
}
async function localizeSnapshot(snap: any): Promise<any> {
    const s = snap && typeof snap === 'object' ? { ...snap } : snap;
    if (s && Array.isArray(s.models)) {
        const localizedModels: any[] = [];
        for (const m of s.models) {
            if (m && (m.provider === 'meshy' || (m.modelUrls && typeof m.modelUrls === 'object'))) {
                localizedModels.push(await localizeModel(m));
            } else {
                localizedModels.push(m);
            }
        }
        s.models = localizedModels;
    }
    // Images: we generally upload via /api/uploads already; Meshy thumbnails rarely appear here.
    return s;
}

type UUID = string;
type Params = { projectId: UUID };

// GET /api/projects/:projectId/commits
export async function GET(
    _req: Request,
    ctx: { params: Promise<Params> } // 👈 dynamic params are a Promise in API routes
) {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { projectId } = await ctx.params;

    // ensure project exists and belongs to user
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (project.ownerId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let commits = await prisma.commit.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
    });

    // Auto-create an initial commit with the generator's initial snapshot on first access if none exist
    if (commits.length === 0) {
        // Build a canonical initial snapshot using snapshot helpers
        const initialSnapshot = toSnapshot(fromSnapshot({} as any));
        const initial = await prisma.commit.create({
            data: {
                projectId,
                parentId: null,
                snapshot: initialSnapshot,
                message: 'Initial commit',
            },
        });
        commits = [initial];
    }

    return NextResponse.json(commits);
}

// POST /api/projects/:projectId/commits
export async function POST(req: Request, ctx: { params: Promise<Params> }) {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { projectId } = await ctx.params;

    const body = await req.json();
    const snapshot = body?.snapshot;
    const message: string | null = body?.message ?? null;

    if (!snapshot) {
        return NextResponse.json({ error: 'snapshot required' }, { status: 400 });
    }

    // ensure project exists and belongs to user
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (project.ownerId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ---- parentId normalization: coerce to null on empty/invalid/mismatched ----
    let parentId: string | null = body?.parentId ?? null;
    if (typeof parentId === 'string' && parentId.trim() === '') parentId = null;

    if (parentId) {
        const parent = await prisma.commit.findUnique({
            where: { id: parentId },
            select: { id: true, projectId: true },
        });
        if (!parent || parent.projectId !== projectId) {
            // instead of 400, just root it
            parentId = null;
        }
    }

    // ---- Localize Meshy assets in snapshot before saving ----
    const localized = await localizeSnapshot(snapshot).catch((e) => {
        console.error('[COMMITS] localization error', e);
        return snapshot; // fallback to original to avoid blocking commit
    });

    const created = await prisma.commit.create({
        data: { projectId, parentId, snapshot: localized, message },
    });

    return NextResponse.json(created, { status: 201 });
}
