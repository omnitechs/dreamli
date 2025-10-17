import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure server-side fetch

/**
 * Start a Meshy image-to-3D job (single or multi image).
 * Accepts JSON body with:
 * - imageUrl?: string           // single image URL
 * - imageUrls?: string[]        // multiple image URLs
 * - prompt?: string             // optional text guidance
 * - mode?: 'preview' | 'normal' // default: preview (faster)
 * - art_style?: string          // optional, e.g. 'realistic'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const imageUrl: unknown = body?.imageUrl;
    const imageUrls: unknown = body?.imageUrls;
    const prompt: unknown = body?.prompt;
    const mode: unknown = body?.mode;
    const art_style: unknown = body?.art_style;

    // Normalize inputs
    const urls: string[] = Array.isArray(imageUrls)
      ? imageUrls.filter((u): u is string => typeof u === "string" && !!u)
      : typeof imageUrl === "string" && imageUrl
        ? [imageUrl]
        : [];

    if (urls.length === 0) {
      return NextResponse.json({ error: "Missing imageUrl or imageUrls" }, { status: 400 });
    }

    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing MESHY_API_KEY" }, { status: 500 });
    }

    const isMulti = urls.length > 1;
    const baseV1 = "https://api.meshy.ai/openapi/v1";

    // Build request payload per Meshy API
    const payload: Record<string, any> = {
      mode: typeof mode === "string" ? mode : "preview",
    };
    if (typeof prompt === "string" && prompt) payload.prompt = prompt;
    if (typeof art_style === "string" && art_style) payload.art_style = art_style;

    if (isMulti) {
      payload.image_urls = urls;
    } else {
      payload.image_url = urls[0];
    }

    const endpoint = isMulti ? `${baseV1}/multi-image-to-3d` : `${baseV1}/image-to-3d`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: text || `Meshy responded ${res.status}` }, { status: res.status });
    }

    const json = await res.json().catch(() => ({} as any));
    const taskId: string | undefined = json?.result;

    if (!taskId) {
      return NextResponse.json({ error: "No task id returned from Meshy" }, { status: 502 });
    }

    const kind = isMulti ? "multi" : "image";
    const streamUrl = `/api/meshy/stream?id=${encodeURIComponent(taskId)}&kind=${encodeURIComponent(kind)}`;
    return NextResponse.json({ taskId, streamUrl });
  } catch (err: any) {
    console.error("Meshy image route error:", err);
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}
