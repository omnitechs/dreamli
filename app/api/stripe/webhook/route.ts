// app/api/stripe/webhook/route.ts
import { addCredits } from "@/lib/credits";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 500 });
  }
  if (!STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    return new Response("Invalid STRIPE_WEBHOOK_SECRET. It should start with 'whsec_' from the Stripe CLI or Dashboard.", { status: 500 });
  }

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string | null;
  if (!sig) return new Response("Missing signature", { status: 400 });

  const stripeMod = await import('stripe');
  const Stripe = stripeMod.default as unknown as typeof import('stripe').default;
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err?.message || 'invalid'}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any; // Stripe.Checkout.Session
      const userId = session?.metadata?.userId as string | undefined;
      const amountDigitalStr = session?.metadata?.amountDigital as string | undefined;
      const amountCreditsStr = session?.metadata?.amountCredits as string | undefined; // backward compatibility
      const paymentIntentId = session?.payment_intent as string | undefined;

      const dc = amountDigitalStr ? Number(amountDigitalStr) : NaN;
      const legacy = amountCreditsStr ? Number(amountCreditsStr) : NaN;
      const amountToCredit = Number.isFinite(dc) && dc > 0 ? dc : (Number.isFinite(legacy) && legacy > 0 ? legacy : NaN);

      if (userId && Number.isFinite(amountToCredit) && amountToCredit > 0) {
        const idem = `stripe:${paymentIntentId || session.id}`;
        await addCredits({
          userId,
          amount: amountToCredit,
          reason: 'stripe_checkout',
          idempotencyKey: idem,
          reference: paymentIntentId || session.id,
        });
      }
    } else if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
      // No credits to add; log for observability
      const session = event.data.object as any;
      console.warn('Checkout did not complete:', event.type, { id: session?.id, payment_intent: session?.payment_intent });
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as any;
      console.warn('Payment intent failed', { id: pi?.id, last_payment_error: pi?.last_payment_error?.message });
    }
  } catch (err) {
    // Log and still return 200 to avoid endless retries if our logic error is non-recoverable
    console.error('Stripe webhook handler error', err);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
