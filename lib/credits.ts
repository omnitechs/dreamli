// lib/credits.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// helper to coerce to Decimal
const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);

/** Add credits (positive `amount`) */
export async function addCredits(opts: {
    userId: string;
    amount: Prisma.Decimal | number | string; // positive
    reason: string;
    idempotencyKey?: string;                  // pass for retry safety
    reference?: string;
}) {
    const { userId, reason, reference, idempotencyKey } = opts;
    const delta = D(opts.amount);
    if (delta.lte(0)) throw new Error("amount must be > 0");

    // Idempotency: if key provided and already used, return existing row
    if (idempotencyKey) {
        const existing = await prisma.creditLedger.findUnique({
            where: { idempotencyKey },
        });
        if (existing) return existing;
    }

    return prisma.$transaction(async (tx) => {
        // read current balance fresh inside txn
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { creditsBalance: true },
        });
        if (!user) throw new Error("user not found");

        const newBalance = user.creditsBalance.plus(delta);

        // insert ledger first, capturing balanceAfter
        const entry = await tx.creditLedger.create({
            data: {
                userId,
                delta,
                reason,
                reference,
                idempotencyKey,
                balanceAfter: newBalance,
            },
        });

        // update running balance
        await tx.user.update({
            where: { id: userId },
            data: { creditsBalance: newBalance },
        });

        return entry;
    });
}

/** Deduct credits (positive `amount` → negative delta) */
export async function deductCredits(opts: {
    userId: string;
    amount: Prisma.Decimal | number | string; // positive
    reason: string;
    idempotencyKey?: string;
    reference?: string;
    allowNegative?: boolean; // default false
}) {
    const { userId, reason, reference, idempotencyKey, allowNegative } = opts;
    const delta = D(opts.amount);
    if (delta.lte(0)) throw new Error("amount must be > 0");

    if (idempotencyKey) {
        const existing = await prisma.creditLedger.findUnique({
            where: { idempotencyKey },
        });
        if (existing) return existing;
    }

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { creditsBalance: true },
        });
        if (!user) throw new Error("user not found");

        const newBalance = user.creditsBalance.minus(delta);
        if (!allowNegative && newBalance.lt(0)) {
            throw new Error("insufficient credits");
        }

        const entry = await tx.creditLedger.create({
            data: {
                userId,
                delta: delta.negated(), // store negative delta
                reason,
                reference,
                idempotencyKey,
                balanceAfter: newBalance,
            },
        });

        await tx.user.update({
            where: { id: userId },
            data: { creditsBalance: newBalance },
        });

        return entry;
    });
}
