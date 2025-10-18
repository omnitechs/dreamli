// app/api/credits/deduct/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deductCredits } from "@/lib/credits";
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

    const data = schema.parse(await req.json());

    const entry = await deductCredits({ ...data, allowNegative: false });
    return NextResponse.json({ ok: true, entry });
}
