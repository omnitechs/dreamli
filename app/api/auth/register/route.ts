// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { addCredits } from "@/lib/credits";
import { SIGNUP_BONUS_DC } from "@/lib/currency";

const schema = z.object({
    email: z.email(),
    password: z.string().min(8).max(128),
    name: z.string().min(1).max(80).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name } = schema.parse(body);

        const normEmail = email.trim().toLowerCase(); // <<< important

        const existing = await prisma.user.findUnique({ where: { email: normEmail } });
        if (existing) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { email: normEmail, name: name ?? null, passwordHash, role: "user" },
            select: { id: true, email: true }
        });

        // Award signup bonus credits (idempotent)
        try {
            await addCredits({
                userId: user.id,
                amount: SIGNUP_BONUS_DC,
                reason: "signup_bonus",
                idempotencyKey: `signup_bonus:${user.id}`,
                reference: "register",
            });
        } catch (e) {
            console.error("Failed to award signup bonus", e);
        }

        return NextResponse.json({ ok: true, user, bonusApplied: true, bonusAmount: SIGNUP_BONUS_DC });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Bad Request" }, { status: 400 });
    }
}
