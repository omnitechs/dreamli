import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Params = { commitId: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> }) {
  const { commitId } = await ctx.params;
  if (!commitId) return NextResponse.json({ error: 'COMMIT_ID_REQUIRED' }, { status: 400 });

  const commit = await prisma.commit.findUnique({
    where: { id: commitId },
    select: {
      id: true,
      projectId: true,
      parentId: true,
      snapshot: true,
      message: true,
      createdAt: true,
      project: { select: { id: true, name: true, ownerId: true } },
    },
  });

  if (!commit) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const owner = commit.project?.ownerId
    ? await prisma.user.findUnique({
        where: { id: commit.project.ownerId },
        select: { id: true, name: true, image: true },
      })
    : null;

  // Return read-only view of commit with project + owner info
  return NextResponse.json({
    id: commit.id,
    projectId: commit.projectId,
    parentId: commit.parentId,
    message: commit.message,
    createdAt: commit.createdAt,
    snapshot: commit.snapshot,
    project: commit.project ? { id: commit.project.id, name: commit.project.name } : null,
    owner: owner ? { id: owner.id, name: owner.name, image: owner.image } : null,
  });
}
