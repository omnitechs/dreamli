import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAllowed(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase();
    // Restrict to known-safe hosts to avoid open proxy abuse
    return host === 'assets.meshy.ai' || host.endsWith('.assets.meshy.ai');
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const target = url.searchParams.get('url') || '';
    if (!isAllowed(target)) {
      return NextResponse.json({ error: 'FORBIDDEN_HOST' }, { status: 403 });
    }

    const upstream = await fetch(target, {
      // No credentials; public fetch
      method: 'GET',
      // Leverage edge caching; adjust if needed
      next: { revalidate: 60 },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'UPSTREAM_ERROR', status: upstream.status }, { status: 502 });
    }

    // Forward important headers; default to GLB content type
    const contentType = upstream.headers.get('content-type') || 'model/gltf-binary';
    const contentLength = upstream.headers.get('content-length');

    const res = new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...(contentLength ? { 'Content-Length': contentLength } : {}),
        'Cache-Control': 'public, max-age=60',
        // Allow the browser to read the streamed content
        'Access-Control-Allow-Origin': '*',
      },
    });

    return res;
  } catch (e) {
    console.error('proxy-glb error', e);
    return NextResponse.json({ error: 'PROXY_ERROR' }, { status: 500 });
  }
}
