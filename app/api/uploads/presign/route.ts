// app/api/uploads/presign/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';         // required for using Node APIs
export const dynamic = 'force-dynamic';  // this route must not be cached

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
        return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    // build a safe, unique key (keeps the original extension)
    const id = crypto.randomUUID();
    const orig = (file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${Date.now()}-${id}-${orig}`;

    // Upload file bytes directly to Vercel Blob
    // NOTE: locally you’ll need BLOB_READ_WRITE_TOKEN in env; on Vercel it’s auto-injected.
    const arrayBuffer = await file.arrayBuffer();
    const blob = await put(key, arrayBuffer, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
        token: process.env.BLOB_READ_WRITE_TOKEN, // uncomment if needed locally
    });

    // blob.url is a permanent, CDN-backed HTTPS URL
    // blob.pathname is the storage key (e.g., "uploads/123-uuid-file.png")
    return NextResponse.json({
        url: blob.url,
        key: blob.pathname,
    });
}