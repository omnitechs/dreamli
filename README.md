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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
