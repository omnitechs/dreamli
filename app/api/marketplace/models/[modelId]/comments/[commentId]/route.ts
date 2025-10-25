import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getCommentOwner(modelId: string, commentId: string) {
  // Try DAO first
  const dao: any = (prisma as any).modelComment;
  if (dao?.findUnique) {
    try {
      const row = await dao.findUnique({ where: { id: commentId }, select: { id: true, userId: true, modelId: true } });
      if (!row) return null;
      if (row.modelId && row.modelId !== modelId) return null;
      return { id: row.id as string, userId: row.userId as string, modelId: (row.modelId as string) || modelId };
    } catch {}
  }
  // Raw SQL fallback
  try {
    const rows: any[] = await prisma.$queryRaw<any[]>`
      SELECT c."id", c."userId", c."modelId"
      FROM "ModelComment" c
      WHERE c."id" = ${commentId}
      LIMIT 1`;
    const r = rows?.[0];
    if (!r) return null;
    if (r.modelId && String(r.modelId) !== modelId) return null;
    return { id: String(r.id), userId: String(r.userId), modelId: String(r.modelId || modelId) };
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ modelId: string; commentId: string }> }) {
  const { modelId, commentId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const rawContent = typeof body?.content === 'string' ? body.content : '';
  const content = String(rawContent || '').trim();
  if (content.length > 1000) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 });
  }

  const owner = await getCommentOwner(modelId, commentId);
  if (!owner) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  if (owner.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // DAO path
  const dao: any = (prisma as any).modelComment;
  if (dao?.update) {
    try {
      const updated = await dao.update({ where: { id: commentId }, data: { content } });
      // attach user
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } });
      return NextResponse.json({ id: updated.id, content: updated.content, createdAt: updated.createdAt, user, media: [] });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
  }

  // Raw fallback
  try {
    const rows: any[] = await prisma.$queryRaw<any[]>`
      UPDATE "ModelComment" SET "content" = ${content}
      WHERE "id" = ${commentId}
      RETURNING "id", "content", "createdAt"`;
    const r = rows?.[0];
    if (!r) return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } });
    return NextResponse.json({ id: r.id, content: r.content, createdAt: r.createdAt, user, media: [] });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ modelId: string; commentId: string }> }) {
  const { modelId, commentId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const owner = await getCommentOwner(modelId, commentId);
  if (!owner) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  if (owner.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // DAO path
  const dao: any = (prisma as any).modelComment;
  const mediaDao: any = (prisma as any).modelCommentMedia;
  if (dao?.delete) {
    try {
      if (mediaDao?.deleteMany) {
        await mediaDao.deleteMany({ where: { commentId } });
      } else {
        // best-effort raw delete if table exists
        try {
          const chk: any[] = await prisma.$queryRaw<any[]>`SELECT to_regclass('public."ModelCommentMedia"')::text as reg`;
          const has = !!(Array.isArray(chk) && chk[0] && (chk[0] as any).reg);
          if (has) {
            await prisma.$executeRawUnsafe(`DELETE FROM "ModelCommentMedia" WHERE "commentId" = $1`, commentId);
          }
        } catch {}
      }
      await dao.delete({ where: { id: commentId } });
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
  }

  // Raw fallback
  try {
    // Try delete media if table exists
    try {
      const chk: any[] = await prisma.$queryRaw<any[]>`SELECT to_regclass('public."ModelCommentMedia"')::text as reg`;
      const has = !!(Array.isArray(chk) && chk[0] && (chk[0] as any).reg);
      if (has) {
        await prisma.$executeRawUnsafe(`DELETE FROM "ModelCommentMedia" WHERE "commentId" = $1`, commentId);
      }
    } catch {}

    await prisma.$executeRawUnsafe(`DELETE FROM "ModelComment" WHERE "id" = $1`, commentId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
