Stripe integration for buying credits

1. Install dependency

   npm install stripe

2. Environment variables

   Add the following to your environment (e.g., .env.local):

   - STRIPE_SECRET_KEY=sk_live_or_test_...
   - STRIPE_WEBHOOK_SECRET=whsec_...  (must start with whsec_)
   - NEXT_PUBLIC_SITE_URL=https://your-domain.com (for building return URLs)
   - PRICE_PER_CREDIT_CENTS=1  # 1 credit = $0.01 (adjust as needed)

   Notes for local development:
   - Use http for localhost. Set NEXT_PUBLIC_SITE_URL=http://localhost:3000 (NOT https) or just leave it unset; the code will default to http://localhost:3000.
   - If you accidentally use https://localhost:3000, your browser will show ERR_SSL_PROTOCOL_ERROR on return from Stripe because the dev server isn’t serving HTTPS.

3. Configure webhook endpoint in Stripe Dashboard

   - Endpoint URL: https://your-domain.com/api/stripe/webhook
   - Events: checkout.session.completed (required). Optionally: checkout.session.expired, checkout.session.async_payment_failed, payment_intent.payment_failed

   For local testing (requires Stripe CLI):

   - stripe login
   - stripe listen --forward-to localhost:3000/api/stripe/webhook
   - The CLI prints a signing secret that starts with whsec_. Copy that into STRIPE_WEBHOOK_SECRET in .env.local.

4. How it works

   - Client requests POST /api/stripe/checkout with { amount } credits.
   - Server creates a Checkout Session and returns session.url; client redirects to Stripe.
   - On successful payment, Stripe sends checkout.session.completed to the webhook.
   - Webhook credits the authenticated userId from metadata via addCredits() with idempotency.

5. UI

   - The page /[lang]/credits redirects to Stripe Checkout to pay.
   - After success, you are redirected back with ?status=success; the page refreshes your balance and shows a green success notice.
   - If the user cancels or the payment fails, Stripe typically redirects to cancel_url; the page handles ?status=cancel and also supports ?status=failed by showing a notice and no balance change. You can click “Add credits” to try again.
   - Webhook crediting is idempotent; even if the user refreshes the success page, credits are only applied once.
