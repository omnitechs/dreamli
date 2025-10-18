// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const handleI18n = createIntlMiddleware({
    locales: ['en', 'nl', 'de', 'fr', 'pl'],
    defaultLocale: 'en',
    localeDetection: true,
    localePrefix: 'always'
});

// Only run on non-API, non-static, non-_next paths (see config below)
export default function middleware(req: NextRequest) {
    // CORS preflight: never touch
    if (req.method === 'OPTIONS') {
        return NextResponse.next();
    }

    // Let next-intl handle routing/redirects/rewrite first
    const intlRes = handleI18n(req);

    // If next-intl already decided to redirect/rewrite, return that response
    if (
        intlRes.headers.has('x-middleware-redirect') ||
        intlRes.headers.has('x-middleware-rewrite')
    ) {
        return intlRes;
    }

    // Otherwise, pass through and add any headers you need
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // Forward any cookies set by next-intl to the final response
    for (const cookie of intlRes.cookies.getAll()) {
        res.cookies.set(cookie);
    }

    return res;
}

// IMPORTANT: exclude ALL API routes (esp. /api/auth/* for NextAuth),
// _next, and any file with an extension.
export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
