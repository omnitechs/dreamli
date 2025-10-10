// app/api/meshy/stream/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime for streaming

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const kind = searchParams.get('kind'); // 'text' | 'image' | 'multi'

    if (!id || !kind) {
        return new Response('Missing id or kind', { status: 400 });
    }

    const baseV1 = 'https://api.meshy.ai/openapi/v1';
    const baseV2 = 'https://api.meshy.ai/openapi/v2';

    const upstream =
        kind === 'text'
            ? `${baseV2}/text-to-3d/${id}/stream`
            : kind === 'multi'
                ? `${baseV1}/multi-image-to-3d/${id}/stream`
                : `${baseV1}/image-to-3d/${id}/stream`;

    const res = await fetch(upstream, {
        headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY!}` }
    });

    if (!res.ok || !res.body) {
        return new Response(`Upstream stream error: ${res.status}`, { status: 502 });
    }

    // Pipe Meshy's SSE straight through
    return new Response(res.body, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    });
}
