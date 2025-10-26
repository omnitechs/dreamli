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

    // Enhance each project with lightweight counters from the latest commit snapshot
    const enriched: any[] = [];
    for (const p of projects) {
        let imagesCount = 0, messagesCount = 0, modelsCount = 0;
        try {
            const latest = await prisma.commit.findFirst({
                where: { projectId: p.id },
                orderBy: { createdAt: 'desc' },
                select: { snapshot: true },
            });
            const snap: any = latest?.snapshot ?? {};
            const imgs: any[] = Array.isArray(snap?.images) ? snap.images : [];
            const msgs: any[] = Array.isArray(snap?.messages) ? snap.messages : [];
            const models: any[] = Array.isArray(snap?.models) ? snap.models : [];
            imagesCount = imgs.length;
            messagesCount = msgs.length;
            modelsCount = models.filter((m: any) => String(m?.status || '').toUpperCase() === 'SUCCEEDED').length;
        } catch {}
        enriched.push({
            ...p,
            // Ensure description field exists in response to fit UI (schema may not have it yet)
            description: (p as any).description ?? null,
            imagesCount,
            messagesCount,
            modelsCount,
        });
    }

    return NextResponse.json(enriched);
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
