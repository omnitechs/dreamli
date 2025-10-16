import createIntlMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';

const handleI18n = createIntlMiddleware({
    locales: ['en','nl','de','fr','pl'],
    defaultLocale: 'en',
    localeDetection: true,
    localePrefix: 'always'
});

export const config = {
    // exclude api + static + _next
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};

export default function middleware(req: NextRequest) {
    // hard skip for APIs
    if (req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const intlRes = handleI18n(req);
    if (intlRes.headers.has('x-middleware-redirect') ||
        intlRes.headers.has('x-middleware-rewrite')) {
        return intlRes;
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    const res = NextResponse.next({ request: { headers: requestHeaders } });
    intlRes.cookies.getAll().forEach(c => res.cookies.set(c));
    return res;
}
