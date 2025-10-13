import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
}

export async function POST(req: Request) {
    const body = await req.json();
    const name = (body?.name ?? '').trim();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const project = await prisma.project.create({
        data: {
            name,
            ownerId: "1",                       // <- REQUIRED
        },
    });
    return NextResponse.json(project, { status: 201 });
}
