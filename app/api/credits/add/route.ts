// app/api/credits/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addCredits } from "@/lib/credits";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
    userId: z.string().cuid(),
    amount: z.number().positive(),
    reason: z.string().min(1),
    idempotencyKey: z.string().optional(),
    reference: z.string().optional(),
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const role = (session.user as any)?.role ?? "user";
    if (role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const body = await req.json();
    const data = schema.parse(body);

    const entry = await addCredits(data);
    return NextResponse.json({ ok: true, entry });
}
