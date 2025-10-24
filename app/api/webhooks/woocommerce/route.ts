import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { addCredits } from "@/lib/credits";

export const dynamic = "force-dynamic";

function verifyWooSignature(rawBody: string, headerSig?: string | null, secret?: string) {
  if (!secret) return false;
  if (!headerSig) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody, "utf8").digest("base64");
    // Woo sends base64 signature; compare constant-time
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(headerSig));
  } catch {
    return false;
  }
}

async function findOwnerIdByModelId(modelId: string): Promise<string | null> {
  // Scan recent commits to locate model and derive project owner
  const commits = await prisma.commit.findMany({
    orderBy: { createdAt: "desc" },
    take: 1000,
    select: { id: true, projectId: true, snapshot: true },
  });
  for (const c of commits) {
    const snap: any = c.snapshot ?? {};
    const models: any[] = Array.isArray((snap as any)?.models) ? (snap as any).models : [];
    const m = models.find((mm: any) => mm && typeof mm === "object" && mm.id === modelId);
    if (m) {
      const proj = await prisma.project.findUnique({ where: { id: c.projectId }, select: { ownerId: true } });
      return proj?.ownerId || null;
    }
  }
  return null;
}

function extractModelIdFromLineItemMeta(meta: any[] | undefined): string | null {
  if (!Array.isArray(meta)) return null;
  // Try explicit key first
  for (const m of meta) {
    const k = (m?.key || m?.name || "").toString();
    if (k === "dreamli_model_id" && m?.value) return String(m.value);
  }
  // Try figurine_data JSON
  const fig = meta.find((m) => (m?.key || m?.name) === "figurine_data" && m?.value);
  if (fig) {
    try {
      const val = typeof fig.value === "string" ? JSON.parse(fig.value) : fig.value;
      if (val && typeof val === "object" && val.modelId) return String(val.modelId);
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  // Read raw body for signature verification
  const raw = await req.text();
  const sig = req.headers.get("x-wc-webhook-signature");
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
  const topic = (req.headers.get("x-wc-webhook-topic") || "").toLowerCase(); // e.g., order.updated, order.paid, ping
  console.log("WOOCOMMERCE_WEBHOOK_SECRET", secret, sig, raw);

  // Allow WooCommerce "ping" test requests even if signature is missing/stripped by proxies
  if (topic.includes("ping") || raw.startsWith("webhook_id=")) {
    try {
      const params = new URLSearchParams(raw);
      return NextResponse.json({ ok: true, pong: true, webhook_id: params.get("webhook_id") || null });
    } catch {
      return NextResponse.json({ ok: true, pong: true });
    }
  }

  if (!verifyWooSignature(raw, sig, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }


  // We only process paid/completed orders
  const status: string = (body?.status || "").toLowerCase();
  if (!topic.includes("order") || !(status === "completed" || status === "processing")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const orderId = String(body?.id || body?.order_id || "");
  const currency = (body?.currency || "EUR").toUpperCase();
  const buyerEmail: string | null = body?.billing?.email || body?.customer_email || null;

  const results: Array<{ lineId: string; modelId?: string; credited?: boolean; ownerId?: string | null; amount?: string }> = [];

  const items: any[] = Array.isArray(body?.line_items) ? body.line_items : [];
  for (const item of items) {
    try {
      const lineId = String(item?.id ?? "");
      const meta = Array.isArray(item?.meta_data) ? item.meta_data : [];
      const modelId = extractModelIdFromLineItemMeta(meta);
      if (!modelId) {
        results.push({ lineId, credited: false });
        continue;
      }

      const ownerId = await findOwnerIdByModelId(modelId);
      if (!ownerId) {
        results.push({ lineId, modelId, ownerId: null, credited: false });
        continue;
      }

      // Compute seller payout: default 20% of line total
      const pct = Number(process.env.MODEL_PAYOUT_PERCENT || 0.2);
      // WooCommerce totals often in strings
      const lineTotal = Number(item?.total || item?.subtotal || 0);
      const creditAmount = Math.max(0, Number((lineTotal * pct).toFixed(2)));

      if (creditAmount > 0) {
        const idempotencyKey = `wc:${orderId}:${lineId}`;
        const reason = `Marketplace sale payout (${Math.round(pct * 100)}%) for model ${modelId}`;
        const reference = `wc_order_${orderId}`;
        await addCredits({ userId: ownerId, amount: creditAmount, reason, idempotencyKey, reference });
        results.push({ lineId, modelId, ownerId, credited: true, amount: creditAmount.toFixed(2) });
      } else {
        results.push({ lineId, modelId, ownerId, credited: false });
      }
    } catch (e) {
      // swallow per-line errors to proceed with others
      results.push({ lineId: String(item?.id ?? ""), credited: false });
    }
  }

  return NextResponse.json({ ok: true, orderId, currency, buyerEmail, results });
}
