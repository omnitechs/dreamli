// app/api/stripe/webhook/route.ts
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

      // Determine EUR paid and Stripe receipt URL
      let eurCents: number | undefined = typeof session?.amount_total === 'number' ? session.amount_total : undefined;
      let receiptUrl: string | undefined = undefined;
      let chargeId: string | undefined = undefined;
      try {
        if (paymentIntentId) {
          const pi: any = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['charges.data'] } as any);
          eurCents = eurCents || (typeof pi?.amount_received === 'number' ? pi.amount_received : (typeof pi?.amount === 'number' ? pi.amount : undefined));
          const firstCharge = pi?.charges?.data?.[0];
          receiptUrl = firstCharge?.receipt_url || receiptUrl;
          chargeId = firstCharge?.id || chargeId;
        }
      } catch (e) {
        console.warn('Could not retrieve payment intent details', e);
      }

      if (userId && Number.isFinite(amountToCredit) && amountToCredit > 0) {
        const idem = `stripe:${paymentIntentId || session.id}`;
        // 1) Credit buyer (idempotent)
        await addCredits({
          userId,
          amount: amountToCredit,
          reason: 'stripe_checkout',
          idempotencyKey: idem,
          reference: paymentIntentId || session.id,
        });

        // 2) Save invoice record (idempotent via PI)
        try {
          const eur = eurCents ? (eurCents / 100) : 0;
          await prisma.invoice.upsert({
            where: { stripePaymentIntentId: (paymentIntentId || session?.id) as string },
            update: {
              userId,
              amountEur: new Prisma.Decimal(eur.toFixed(2)),
              creditsGranted: new Prisma.Decimal(String(amountToCredit)),
              stripeSessionId: session?.id,
              stripeChargeId: chargeId || null,
              receiptUrl: receiptUrl || null,
            },
            create: {
              userId,
              amountEur: new Prisma.Decimal(eur.toFixed(2)),
              creditsGranted: new Prisma.Decimal(String(amountToCredit)),
              stripeSessionId: session?.id,
              stripePaymentIntentId: (paymentIntentId || session?.id) as string,
              stripeChargeId: chargeId || null,
              receiptUrl: receiptUrl || null,
            },
          });
        } catch (e) {
          console.error('Failed to upsert invoice record', e);
        }

        // 3) Award 10% referral revenue to inviter (if any)
        try {
          const me = await prisma.user.findUnique({ where: { id: userId }, select: { referredById: true } });
          const inviterId = me?.referredById || null;
          if (inviterId && inviterId !== userId) {
            const commission = Math.floor(Number(amountToCredit) * 0.10);
            if (commission > 0) {
              await addCredits({
                userId: inviterId,
                amount: commission,
                reason: 'referral_revenue',
                idempotencyKey: `referral_revenue:${paymentIntentId || session.id}`,
                reference: `referral_purchase:${userId}`,
              });
            }
          }
        } catch (e) {
          console.error('Failed to award referral revenue share', e);
        }
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
