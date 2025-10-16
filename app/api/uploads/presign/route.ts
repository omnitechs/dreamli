//app/api/uploads/presign/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${Date.now()}-${id}-${safeName}`;

    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });

    const filePath = path.join(dir, key);
    await writeFile(filePath, bytes);

    // The file is now publicly available at /uploads/<key>
    return NextResponse.json({
        url: `/uploads/${key}`,
        key,
    });
}
