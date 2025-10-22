// middleware.ts (root)
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

    // Capture referral code from the incoming URL once
    const url = req.nextUrl;
    const refParam = url.searchParams.get('ref') || url.searchParams.get('referral') || url.searchParams.get('refcode');
    const isValidRef = !!refParam && /^[a-zA-Z0-9_-]{4,64}$/.test(refParam!);

    // Let next-intl handle routing/redirects/rewrite first
    const intlRes = handleI18n(req);

    // If next-intl already decided to redirect/rewrite, attach cookie to that response and return
    if (
        intlRes.headers.has('x-middleware-redirect') ||
        intlRes.headers.has('x-middleware-rewrite')
    ) {
        try {
            if (isValidRef) {
                const existing = req.cookies.get('ref');
                if (!existing || existing.value !== refParam) {
                    intlRes.cookies.set('ref', refParam as string, {
                        path: '/',
                        httpOnly: false, // allow client to read if needed
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                    });
                }
            }
        } catch {}
        return intlRes;
    }

    // Otherwise, pass through and add any headers you need
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // Set referral cookie on normal responses
    try {
        if (isValidRef) {
            const existing = req.cookies.get('ref');
            if (!existing || existing.value !== refParam) {
                res.cookies.set('ref', refParam as string, {
                    path: '/',
                    httpOnly: false, // allow client to read if needed
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                });
            }
        }
    } catch {}

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
