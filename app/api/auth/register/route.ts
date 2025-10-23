// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { addCredits } from "@/lib/credits";
import { SIGNUP_BONUS_DC, REFERRAL_BONUS_DC } from "@/lib/currency";

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

        // Determine inviter via referral cookie if present
        const jar = await cookies();
        const referralCookie = jar.get('ref')?.value || jar.get('referral')?.value || null;
        let inviter: { id: string } | null = null;
        if (referralCookie) {
            inviter = await prisma.user.findUnique({ where: { referralCode: referralCookie }, select: { id: true } });
        }

        // Generate a referral code for the new user
        function genRef(): string {
            // 12-char base36 code
            return (Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8)).slice(0, 12);
        }

        const user = await prisma.user.create({
            data: {
                email: normEmail,
                name: name ?? null,
                passwordHash,
                role: "user",
                referralCode: genRef(),
                referredById: inviter?.id ?? null,
            },
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

        // Award referral bonus to inviter (if any), idempotent per invitee
        if (inviter?.id && inviter.id !== user.id) {
            try {
                await addCredits({
                    userId: inviter.id,
                    amount: REFERRAL_BONUS_DC,
                    reason: "referral_bonus",
                    idempotencyKey: `referral_bonus:${user.id}`,
                    reference: `referral:${user.id}`,
                });
            } catch (e) {
                console.error("Failed to award referral bonus", e);
            }
        }

        const res = NextResponse.json({ ok: true, user, bonusApplied: true, bonusAmount: SIGNUP_BONUS_DC, referralApplied: Boolean(inviter?.id), referralBonusAmount: inviter?.id ? REFERRAL_BONUS_DC : 0 });
        // Clear referral cookie(s) once used to avoid incorrect attribution on the same device
        try {
            if (referralCookie) {
                res.cookies.set('ref', '', { path: '/', maxAge: 0 });
                res.cookies.set('referral', '', { path: '/', maxAge: 0 });
            }
        } catch {}

        return res;
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? "Bad Request" }, { status: 400 });
    }
}
