import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  const likesDao: any = (prisma as any).modelLike;
  if (!likesDao?.count) {
    // Fallback to raw SQL when DAO is unavailable (e.g., client not regenerated)
    try {
      const rows = await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ${modelId}`;
      const count = rows?.[0]?.count ?? 0;
      let userLiked = false;
      if (userId) {
        const likedRows = await prisma.$queryRaw<any[]>`SELECT 1 FROM "ModelLike" WHERE "modelId" = ${modelId} AND "userId" = ${userId} LIMIT 1`;
        userLiked = Array.isArray(likedRows) && likedRows.length > 0;
      }
      return NextResponse.json({ count, userLiked });
    } catch (e) {
      console.error('likes GET (raw) failed', e);
      return NextResponse.json({ count: 0, userLiked: false });
    }
  }

  const [count, userLike] = await Promise.all([
    likesDao.count({ where: { modelId } }),
    userId ? likesDao.findUnique?.({ where: { modelId_userId: { modelId, userId } } }) : Promise.resolve(null),
  ]);

  return NextResponse.json({ count, userLiked: !!userLike });
}

export async function POST(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const likesDao: any = (prisma as any).modelLike;
  if (!likesDao) {
    // Fallback to raw SQL persistence when DAO is unavailable
    try {
      const id = nanoid();
      await prisma.$executeRaw`INSERT INTO "ModelLike" ("id", "modelId", "userId", "createdAt") VALUES (${id}, ${modelId}, ${userId}, NOW()) ON CONFLICT ("modelId", "userId") DO NOTHING`;
      const rows = await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ${modelId}`;
      const count = rows?.[0]?.count ?? 0;
      return NextResponse.json({ count, userLiked: true });
    } catch (e) {
      console.error('Failed to like (raw)', e);
      return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
    }
  }

  try {
    if (typeof likesDao.upsert === 'function') {
      await likesDao.upsert({
        where: { modelId_userId: { modelId, userId } },
        update: {},
        create: { modelId, userId },
      });
    } else {
      // Fallback if upsert unsupported by the client/accelerate
      const existing = await likesDao.findUnique?.({ where: { modelId_userId: { modelId, userId } } });
      if (!existing) {
        // ignore unique violation races
        await likesDao.create?.({ data: { modelId, userId } }).catch(() => null);
      }
    }

    const count = await likesDao.count({ where: { modelId } });
    return NextResponse.json({ count, userLiked: true });
  } catch (e) {
    console.error('Failed to like', e);
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const likesDao: any = (prisma as any).modelLike;
  if (!likesDao) {
    // Fallback to raw SQL delete when DAO is unavailable
    try {
      await prisma.$executeRaw`DELETE FROM "ModelLike" WHERE "modelId" = ${modelId} AND "userId" = ${userId}`;
      const rows = await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModelLike" WHERE "modelId" = ${modelId}`;
      const count = rows?.[0]?.count ?? 0;
      return NextResponse.json({ count, userLiked: false });
    } catch (e) {
      console.error('Failed to unlike (raw)', e);
      return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 });
    }
  }

  try {
    await likesDao.delete?.({ where: { modelId_userId: { modelId, userId } } }).catch(() => null);
    const count = await likesDao.count?.({ where: { modelId } }).catch(() => 0);
    return NextResponse.json({ count: typeof count === 'number' ? count : 0, userLiked: false });
  } catch (e) {
    console.error('Failed to unlike', e);
    return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 });
  }
}
