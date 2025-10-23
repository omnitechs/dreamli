import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function kindFromMime(mime?: string | null): 'image' | 'video' | 'file' {
  const m = (mime || '').toLowerCase();
  if (m.startsWith('image/')) return 'image';
  if (m.startsWith('video/')) return 'video';
  return 'file';
}

function isHttpUrl(u: unknown) {
  return typeof u === 'string' && /^https?:\/\//i.test(String(u));
}

export async function GET(req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;

  // Guard against missing DAOs in environments where Prisma client wasn't regenerated
  const printsDao: any = (prisma as any).modelPrint;
  const mediaDao: any = (prisma as any).modelPrintMedia;
  if (!printsDao?.findMany || !mediaDao?.findMany) {
    return NextResponse.json({ items: [], page: 1, pageSize: 10, total: 0, hasMore: false });
  }

  const url = new URL(req.url);
  const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limitParam = parseInt(url.searchParams.get('limit') || '10', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : 10;

  const [total, rows] = await Promise.all([
    printsDao.count({ where: { modelId } }),
    printsDao.findMany({
      where: { modelId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true } },
        media: { select: { id: true, kind: true, url: true, mime: true } },
      },
    }),
  ]);

  const items = rows.map((r: any) => ({
    id: r.id,
    text: r.text || null,
    createdAt: r.createdAt,
    user: r.user ? { id: r.user.id, name: r.user.name || 'User', image: r.user.image || null } : null,
    media: Array.isArray(r.media) ? r.media : [],
  }));

  return NextResponse.json({ items, page, pageSize: limit, total, hasMore: page * limit < total });
}

export async function POST(req: Request, { params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Optional: enforce purchase gating via env flag
  const enforce = (process.env.ENFORCE_PRINTS_PURCHASE || '').trim() === '1';
  if (enforce) {
    try {
      const hasInvoice = await prisma.invoice.findFirst({
        where: {
          userId,
          OR: [
            { reference: { contains: modelId } }, // best-effort: depends on how reference is stored
          ],
        },
        select: { id: true },
      });
      if (!hasInvoice) {
        return NextResponse.json({ error: 'Purchase required' }, { status: 403 });
      }
    } catch {
      // If invoice lookup fails, deny with generic error when enforcement is on
      return NextResponse.json({ error: 'Purchase validation failed' }, { status: 403 });
    }
  }

  // Guard against missing DAOs
  const printsDao: any = (prisma as any).modelPrint;
  const mediaDao: any = (prisma as any).modelPrintMedia;
  if (!printsDao?.create || !mediaDao?.create) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const text = (body?.text ? String(body.text) : '').trim();
  let media: Array<{ url: string; kind?: string; mime?: string }> = Array.isArray(body?.media) ? body.media : [];

  // Basic validation
  if (text.length > 2000) return NextResponse.json({ error: 'Text too long' }, { status: 400 });

  if (media.length > 10) media = media.slice(0, 10);
  const cleaned = media
    .map((m) => ({
      url: String((m as any)?.url || ''),
      mime: (m as any)?.mime ? String((m as any).mime) : undefined,
      kind: (m as any)?.kind ? String((m as any).kind) : undefined,
    }))
    .filter((m) => m.url && isHttpUrl(m.url));

  if (!cleaned.length && !text) {
    return NextResponse.json({ error: 'Nothing to post' }, { status: 400 });
  }

  try {
    const created = await printsDao.create({
      data: { modelId, userId, text: text || null },
      select: { id: true, createdAt: true },
    });

    // Insert media
    if (cleaned.length) {
      await Promise.all(
        cleaned.map((m) =>
          mediaDao.create({
            data: {
              printId: created.id,
              url: m.url,
              mime: m.mime || null,
              kind: (m.kind as any) || kindFromMime(m.mime || null),
            },
            select: { id: true },
          })
        )
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true } });
    const mediaRows = await mediaDao.findMany({ where: { printId: created.id }, select: { id: true, kind: true, url: true, mime: true } });

    return NextResponse.json({
      id: created.id,
      text: text || null,
      createdAt: created.createdAt,
      user: user ? { id: user.id, name: user.name || 'User', image: user.image || null } : null,
      media: mediaRows,
    }, { status: 201 });
  } catch (e) {
    console.error('Failed to create print', e);
    return NextResponse.json({ error: 'Failed to create print' }, { status: 500 });
  }
}
