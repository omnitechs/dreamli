// app/api/credits/topup/route.ts
import { auth } from "@/lib/auth";
import { addCredits } from "@/lib/credits";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  let amount = 100;
  try {
    const body = await req.json();
    const raw = Number(body?.amount);
    if (Number.isFinite(raw)) amount = raw;
  } catch {}

  // Basic validation
  if (!Number.isFinite(amount) || amount <= 0) {
    return new Response(JSON.stringify({ error: "INVALID_AMOUNT" }), { status: 400 });
  }
  if (amount > 100000) {
    return new Response(JSON.stringify({ error: "AMOUNT_TOO_LARGE" }), { status: 400 });
  }

  const idempotencyKey = `manual-topup:${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  await addCredits({ userId, amount, reason: "manual_topup", idempotencyKey });
  return Response.json({ ok: true, added: amount });
}
