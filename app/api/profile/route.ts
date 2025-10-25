import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function sanitizeUsername(u: string) {
  const s = u.trim().toLowerCase();
  // allow letters, digits, underscore, dot, hyphen; must start with letter or digit
  const ok = /^[a-z0-9][a-z0-9_\.\-]{2,30}$/.test(s);
  if (!ok) return null;
  return s;
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Defensive: username/bio may not be migrated yet
  try {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, username: true as any, bio: true as any },
    } as any);
    return NextResponse.json({
      id: me?.id,
      name: me?.name ?? null,
      email: me?.email ?? null,
      image: me?.image ?? null,
      username: (me as any)?.username ?? null,
      bio: (me as any)?.bio ?? null,
    });
  } catch (e) {
    // Fallback without new fields
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, image: true } });
    return NextResponse.json({ id: me?.id, name: me?.name ?? null, email: me?.email ?? null, image: me?.image ?? null, username: null, bio: null });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: any = {};
  try { body = await req.json(); } catch {}

  const nameRaw = typeof body?.name === 'string' ? body.name.trim() : undefined;
  const bioRaw = typeof body?.bio === 'string' ? body.bio.trim() : undefined;
  const imageRaw = typeof body?.image === 'string' ? body.image.trim() : undefined;
  const unameRaw = typeof body?.username === 'string' ? body.username : undefined;

  const data: any = {};
  if (nameRaw !== undefined) data.name = nameRaw || null;
  if (bioRaw !== undefined) data.bio = bioRaw || null;
  if (imageRaw !== undefined) data.image = imageRaw || null;

  if (unameRaw !== undefined) {
    if (!unameRaw) {
      data.username = null;
    } else {
      const clean = sanitizeUsername(unameRaw);
      if (!clean) return NextResponse.json({ error: 'invalid_username' }, { status: 400 });
      // Check uniqueness excluding current user
      const existing = await prisma.user.findUnique({ where: { username: clean } as any, select: { id: true } as any } as any);
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: 'username_taken' }, { status: 409 });
      }
      data.username = clean;
    }
  }

  try {
    const updated = await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json({ ok: true, id: updated.id, username: (updated as any).username ?? null });
  } catch (e: any) {
    return NextResponse.json({ error: 'update_failed', detail: e?.message || String(e) }, { status: 500 });
  }
}
