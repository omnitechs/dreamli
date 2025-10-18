import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";
import { estimateMeshyCredits } from "@/lib/ai/pricing";

export const runtime = "nodejs"; // required for server-side fetch

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = (session?.user as any)?.id as string | undefined;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
        }

        // Reserve/charge credits upfront (flat per generation)
        const estimated = estimateMeshyCredits('generation');
        // build idempotency key: userId + prompt + route
        const idBase = `${userId}:meshy:text:${prompt}`;
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(idBase));
        const key = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
        try {
            await deductCredits({ userId, amount: estimated, reason: `meshy:generation:reserve`, idempotencyKey: `meshy:reserve:${key}`, reference: key });
        } catch (e) {
            return NextResponse.json({ error: 'INSUFFICIENT_CREDITS' }, { status: 402 });
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
