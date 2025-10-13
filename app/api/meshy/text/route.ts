import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // required for server-side fetch

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
        }

        // Meshy text-to-3D v2 endpoint
        const baseV2 = "https://api.meshy.ai/openapi/v2";
        const apiKey = process.env.MESHY_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing MESHY_API_KEY" }, { status: 500 });
        }

        const res = await fetch(`${baseV2}/text-to-3d`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                mode: "preview",
                prompt,
                art_style: "realistic",
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: text }, { status: res.status });
        }

        const json = await res.json();
        const taskId = json?.result;

        if (!taskId) {
            return NextResponse.json({ error: "No task id returned from Meshy" }, { status: 502 });
        }

        // Return both taskId and ready-to-use stream URL
        const streamUrl = `/api/meshy/stream?id=${encodeURIComponent(taskId)}&kind=text`;
        return NextResponse.json({ taskId, streamUrl });
    } catch (err: any) {
        console.error("Meshy text route error:", err);
        return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
    }
}
