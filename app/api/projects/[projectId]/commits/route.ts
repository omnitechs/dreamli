import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type UUID = string;
type Params = { projectId: UUID };

// GET /api/projects/:projectId/commits
export async function GET(
    _req: Request,
    ctx: { params: Promise<Params> } // 👈 dynamic params are a Promise in API routes
) {
    const { projectId } = await ctx.params;

    // (optional) ensure project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const commits = await prisma.commit.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(commits);
}

// POST /api/projects/:projectId/commits
export async function POST(req: Request, ctx: { params: Promise<Params> }) {
    const { projectId } = await ctx.params;

    const body = await req.json();
    const snapshot = body?.snapshot;
    const message: string | null = body?.message ?? null;

    if (!snapshot) {
        return NextResponse.json({ error: 'snapshot required' }, { status: 400 });
    }

    // make sure project exists (still a hard error if it doesn’t)
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
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
