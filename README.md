This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/GeneratorPlayground.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication and Google Sign-in

This project uses NextAuth (Auth.js) with Google as an OAuth provider. To configure Google Cloud Console correctly, follow the detailed guide:

- docs/google-oauth-setup.md

## Mailchimp Audience Subscription

To automatically add new users to your Mailchimp audience on registration and first-time Google sign-in, set these environment variables in `.env.local`:

- MAILCHIMP_API_KEY=your_api_key-us12
- MAILCHIMP_SERVER_PREFIX=us12
- MAILCHIMP_LIST_ID=78ff17c433

Notes:
- If MAILCHIMP_SERVER_PREFIX is omitted, it will be inferred from the API key suffix (e.g., `-us12`).
- If Mailchimp variables are not configured, the app will skip subscription silently.
- Merge fields used: FNAME, LNAME. Tags used: `registered` for email/password signups and `oauth` for OAuth signups.

## WooCommerce model sales → creator credits

This project can award site credits to creators when their 3D models are purchased as physical prints in WooCommerce.

How it works:
- The purchase UI sends model metadata to WordPress when adding a figurine to the cart. We include:
  - dreamli_model_id (flat meta key)
  - figurine_data (JSON; also contains modelId and other context)
- WordPress/WooCommerce forwards every paid order to this app via a webhook.
- The webhook parses line items, extracts the modelId, finds the model owner, and credits them automatically (idempotent per order line).

Setup steps:
1) Environment variables in this app:
- WOOCOMMERCE_WEBHOOK_SECRET=your_shared_secret
- MODEL_PAYOUT_PERCENT=0.2  # optional; defaults to 0.2 (20%)

2) WooCommerce webhook (in WordPress Admin → WooCommerce → Settings → Advanced → Webhooks):
- Name: Dreamli order webhook
- Status: Active
- Topic: Order updated (or Order paid / Order completed)
- Delivery URL: https://YOUR_APP_DOMAIN/api/webhooks/woocommerce
- Secret: same value as WOOCOMMERCE_WEBHOOK_SECRET
- API version: WP REST API Integration v3

3) Add-to-cart endpoints on WordPress must accept and persist line item meta:
- dreamli_model_id (string)
- figurine_data (JSON string)

Client integration already sends dreamli_model_id and figurine_data when creating WooCommerce figurine carts.

Local test (example):

curl -X POST "http://localhost:3000/api/webhooks/woocommerce" \
  -H "Content-Type: application/json" \
  -H "x-wc-webhook-signature: $(echo -n '{"id":123,"status":"completed","currency":"EUR","billing":{"email":"buyer@example.com"},"line_items":[{"id":11,"total":"49.00","meta_data":[{"key":"dreamli_model_id","value":"MODEL_ABC"}]}]}' | openssl dgst -sha256 -hmac "$WOOCOMMERCE_WEBHOOK_SECRET" -binary | openssl base64)" \
  -d '{"id":123,"status":"completed","currency":"EUR","billing":{"email":"buyer@example.com"},"line_items":[{"id":11,"total":"49.00","meta_data":[{"key":"dreamli_model_id","value":"MODEL_ABC"}]}]}'

Notes:
- The handler verifies X-WC-Webhook-Signature with WOOCOMMERCE_WEBHOOK_SECRET.
- Idempotency ensures each order line is credited once: key wc:{orderId}:{lineId}.
- The owner is resolved by scanning recent commits for the modelId and taking the owning Project.ownerId.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
