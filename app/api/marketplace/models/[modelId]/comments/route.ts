import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const url = new URL(req.url);
  const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limitParam = parseInt(url.searchParams.get('limit') || '10', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : 10;

  const dao: any = (prisma as any).modelComment;
  const mediaDao: any = (prisma as any).modelCommentMedia;

  if (!dao?.findMany || !dao?.count) {
    // Fallback to raw SQL when DAO is unavailable
    try {
      const totalRows = await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModelComment" WHERE "modelId" = ${modelId}`;
      const total = totalRows?.[0]?.count ?? 0;
      const rows: any[] = await prisma.$queryRaw<any[]>`
        SELECT c."id", c."content", c."createdAt", c."userId", u."name" as userName, u."image" as userImage
        FROM "ModelComment" c
        LEFT JOIN "User" u ON u."id" = c."userId"
        WHERE c."modelId" = ${modelId}
        ORDER BY c."createdAt" DESC
        OFFSET ${(page - 1) * limit} LIMIT ${limit}`;

      const byCommentId = new Map<string, any[]>();
      if (rows.length) {
        // Check if the media table exists; if not, skip media queries gracefully
        let hasMediaTable = false;
        try {
          const chk: any[] = await prisma.$queryRaw<any[]>`SELECT to_regclass('public."ModelCommentMedia"')::text as reg`;
          hasMediaTable = !!(Array.isArray(chk) && chk[0] && (chk[0] as any).reg);
        } catch {
          hasMediaTable = false;
        }
        if (hasMediaTable) {
          // Fetch media per comment id via raw queries (safe for small page sizes)
          for (const r of rows) {
            try {
              const mediaRows: any[] = await prisma.$queryRaw<any[]>`
                SELECT m."id", m."commentId", m."kind", m."url", m."mime", m."createdAt"
                FROM "ModelCommentMedia" m
                WHERE m."commentId" = ${r.id}`;
              if (mediaRows?.length) byCommentId.set(r.id, mediaRows.map((m: any) => ({ id: m.id, kind: m.kind, url: m.url, mime: m.mime, createdAt: m.createdAt })));
            } catch {
              // ignore per-comment media failure
            }
          }
        }
      }

      const items = rows.map((r: any) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        user: { id: r.userId, name: r.userName || 'User', image: r.userImage || null },
        media: byCommentId.get(r.id) || [],
      }));

      return NextResponse.json({ items, page, pageSize: limit, total, hasMore: page * limit < total });
    } catch (e) {
      console.error('comments GET (raw) failed', e);
      return NextResponse.json({ items: [], page, pageSize: limit, total: 0, hasMore: false });
    }
  }

  const [total, rows] = await Promise.all([
    dao.count({ where: { modelId } }),
    dao.findMany({
      where: { modelId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        user: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  // Fetch media for these comments if DAO is available
  const byCommentId = new Map<string, any[]>();
  if (mediaDao?.findMany && rows.length) {
    const ids = rows.map((r: any) => r.id);
    const mediaRows = await mediaDao.findMany({ where: { commentId: { in: ids } }, select: { id: true, commentId: true, kind: true, url: true, mime: true, createdAt: true } });
    for (const m of mediaRows) {
      const arr = byCommentId.get(m.commentId) || [];
      arr.push({ id: m.id, kind: m.kind, url: m.url, mime: m.mime, createdAt: m.createdAt });
      byCommentId.set(m.commentId, arr);
    }
  }

  const items = rows.map((r: any) => ({
    id: r.id,
    content: r.content,
    createdAt: r.createdAt,
    user: r.user ? { id: r.user.id, name: r.user.name || 'User', image: r.user.image || null } : null,
    media: byCommentId.get(r.id) || [],
  }));

  return NextResponse.json({ items, page, pageSize: limit, total, hasMore: page * limit < total });
}

export async function POST(req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const rawContent = typeof body?.content === 'string' ? body.content : '';
  const content = String(rawContent || '').trim();
  const mediaInput: Array<{ url: string; kind?: string; mime?: string }> = Array.isArray(body?.media) ? body.media : [];

  if (!content && mediaInput.length === 0) {
    return NextResponse.json({ error: 'Provide text content or at least one attachment' }, { status: 400 });
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 });
  }
  if (mediaInput.length > 10) {
    return NextResponse.json({ error: 'Too many attachments (max 10)' }, { status: 400 });
  }

  const dao: any = (prisma as any).modelComment;
  const mediaDao: any = (prisma as any).modelCommentMedia;
  if (!dao?.create) {
    // Raw SQL fallback when DAO is unavailable
    try {
      const commentId = nanoid();
      const rows = await prisma.$queryRaw<any[]>`INSERT INTO "ModelComment" ("id", "modelId", "userId", "content", "createdAt") VALUES (${commentId}, ${modelId}, ${userId}, ${content || ''}, NOW()) RETURNING "id", "content", "createdAt"`;
      const created = rows?.[0] || { id: commentId, content: content || '', createdAt: new Date() };
      const createdMedia: any[] = [];
      if (mediaInput.length) {
        // Check table existence once to avoid 42P01
        let hasMediaTable = false;
        try {
          const chk: any[] = await prisma.$queryRaw<any[]>`SELECT to_regclass('public."ModelCommentMedia"')::text as reg`;
          hasMediaTable = !!(Array.isArray(chk) && chk[0] && (chk[0] as any).reg);
        } catch {
          hasMediaTable = false;
        }
        if (hasMediaTable) {
          for (let i = 0; i < mediaInput.length; i++) {
            const m = mediaInput[i];
            const url = String(m?.url || '').trim();
            if (!url) continue;
            const mime = m?.mime ? String(m.mime) : undefined;
            const kind = m?.kind
              ? String(m.kind)
              : mime?.startsWith('image/')
              ? 'image'
              : mime?.startsWith('video/')
              ? 'video'
              : 'file';
            const mediaId = nanoid();
            try {
              const mediaRows = await prisma.$queryRaw<any[]>`INSERT INTO "ModelCommentMedia" ("id", "commentId", "kind", "url", "mime", "createdAt") VALUES (${mediaId}, ${created.id}, ${kind}, ${url}, ${mime || null}, NOW()) RETURNING "id", "kind", "url", "mime", "createdAt"`;
              if (mediaRows?.[0]) createdMedia.push(mediaRows[0]);
            } catch {
              // ignore media insert if table missing or other SQL error
            }
          }
        }
      }
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } });
      return NextResponse.json({
        id: created.id,
        content: created.content,
        createdAt: created.createdAt,
        user: user ? { id: user.id, name: user.name || 'User', image: user.image || null } : null,
        media: createdMedia,
      }, { status: 201 });
    } catch (e) {
      console.error('Failed to add comment (raw)', e);
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
  }

  try {
    const created = await dao.create({ data: { modelId, userId, content: content || '' } });

    const createdMedia: any[] = [];
    if (mediaDao?.create && mediaInput.length) {
      for (let i = 0; i < mediaInput.length; i++) {
        const m = mediaInput[i];
        const url = String(m?.url || '').trim();
        if (!url) continue;
        const mime = m?.mime ? String(m.mime) : undefined;
        const kind = m?.kind
          ? String(m.kind)
          : mime?.startsWith('image/')
          ? 'image'
          : mime?.startsWith('video/')
          ? 'video'
          : 'file';
        const row = await mediaDao.create({ data: { commentId: created.id, url, kind, mime } });
        createdMedia.push({ id: row.id, kind: row.kind, url: row.url, mime: row.mime, createdAt: row.createdAt });
      }
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } });
    return NextResponse.json({
      id: created.id,
      content: created.content,
      createdAt: created.createdAt,
      user: user ? { id: user.id, name: user.name || 'User', image: user.image || null } : null,
      media: createdMedia,
    }, { status: 201 });
  } catch (e) {
    console.error('Failed to add comment', e);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
