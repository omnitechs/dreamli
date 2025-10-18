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
    return NextResponse.json(projects);
}

export async function POST(req: Request) {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = (body?.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const project = await prisma.project.create({
        data: {
            name,
            ownerId: userId,
        },
    });
    return NextResponse.json(project, { status: 201 });
}
