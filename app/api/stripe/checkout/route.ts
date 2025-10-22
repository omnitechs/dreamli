// app/api/stripe/checkout/route.ts
import { auth } from "@/lib/auth";
import { CREDIT_PACKAGES, computePackageDcTotal, getPackageById } from "@/lib/currency";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: "STRIPE_NOT_CONFIGURED" }),
      { status: 500 }
    );
  }

  // Expect a packageId from client
  let packageId: string | undefined;
  try {
    const body = await req.json();
    packageId = body?.packageId as string | undefined;
  } catch {}

  const pkg = getPackageById(packageId || '');
  if (!pkg) {
    return new Response(JSON.stringify({ error: "INVALID_PACKAGE" }), { status: 400 });
  }

  const amountDigital = computePackageDcTotal(pkg);
  const amountCents = Math.round(pkg.eurPrice * 100);
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return new Response(JSON.stringify({ error: "INVALID_PRICING" }), { status: 400 });
  }

  const stripeMod = await import('stripe');
  const Stripe = stripeMod.default as unknown as typeof import('stripe').default;
  // Use account default API version for compatibility instead of hardcoding a future date
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // Determine base URL for return links
  const configured = (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_SITE_URL) ? (process as any).env.NEXT_PUBLIC_SITE_URL as string : '';
  const referer = (req.headers.get('referer') || '') as string;
  const originHeader = (req.headers.get('origin') || '') as string;
  const candidate = configured || (referer ? new URL(referer).origin : (originHeader || 'http://localhost:3000'));
  let baseUrl: string;
  try {
    const u = new URL(candidate);
    // Force http for localhost/loopback to avoid browser SSL error during local dev
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '::1') {
      u.protocol = 'http:';
    }
    // Strip trailing slash
    baseUrl = u.origin;
  } catch {
    baseUrl = 'http://localhost:3000';
  }

  // Try to derive language from referer path: http://host/{lang}/credits
  const langMatch = referer?.split('/')?.[3] || 'en';
  const successUrl = `${baseUrl}/${langMatch}/credits?status=success`;
  const cancelUrl = `${baseUrl}/${langMatch}/credits?status=cancel`;

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Digital Credits',
            description: `${amountDigital} DC (includes ${pkg.bonusPercent}% bonus)`,
          },
          unit_amount: amountCents, // in euro cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      packageId: pkg.id,
      amountDigital: String(amountDigital),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return Response.json({ url: checkout.url });
}