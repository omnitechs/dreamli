import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const projects = await prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
    });
    // Ensure description field exists in response to fit UI (schema may not have it yet)
    const withDescription = projects.map((p: any) => ({ ...p, description: p.description ?? null }));
    return NextResponse.json(withDescription);
}

export async function POST(req: Request) {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = (body?.name ?? '').trim();
    const description = (body?.description ?? null) as string | null;
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const project = await prisma.project.create({
        data: {
            name,
            ownerId: userId,
        },
    });
    // Echo description even if not yet persisted in DB to fit UI expectations
    const withDescription = { ...project, description } as any;
    return NextResponse.json(withDescription, { status: 201 });
}
