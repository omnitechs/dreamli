// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';

const handleI18n = createIntlMiddleware({
    locales: ['en','nl','de','fr','pl'],
    defaultLocale: 'en',
    localeDetection: true,
    localePrefix: 'always'
});

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)']
};

export default function middleware(req: NextRequest) {
    // Let next-intl handle routing first
    const intlRes = handleI18n(req);

    // If it redirected or rewrote, return as-is
    if (intlRes.headers.has('x-middleware-redirect') ||
        intlRes.headers.has('x-middleware-rewrite')) {
        return intlRes;
    }

    // Otherwise, inject x-pathname for server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // Preserve cookies set by next-intl
    intlRes.cookies.getAll().forEach(c => res.cookies.set(c));
    return res;
}
