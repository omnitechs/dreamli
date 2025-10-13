import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const kind = searchParams.get("kind");

    if (!id || !kind) {
        return NextResponse.json({ error: "Missing id or kind" }, { status: 400 });
    }

    const baseV1 = "https://api.meshy.ai/openapi/v1";
    const baseV2 = "https://api.meshy.ai/openapi/v2";
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    const url =
        kind === "text"
            ? `${baseV2}/text-to-3d/${id}`
            : kind === "multi"
                ? `${baseV1}/multi-image-to-3d/${id}`
                : `${baseV1}/image-to-3d/${id}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) {
        return NextResponse.json({ error: `Meshy responded ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
