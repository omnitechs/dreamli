import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en','nl','de','fr','pl'],
    defaultLocale: 'en',        // change if you want another default
    localeDetection: true       // uses Accept-Language on first visit
});

export const config = {
    matcher: [
        // Run middleware on all paths except Next internals and assets
        '/((?!_next|.*\\..*).*)'
    ]
};
