import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

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

    const commits = await prisma.commit.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
    });

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

    const created = await prisma.commit.create({
        data: { projectId, parentId, snapshot, message },
    });

    return NextResponse.json(created, { status: 201 });
}
