// /i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

const SUPPORTED = ['en','nl','de','fr','pl'] as const;
type Supported = typeof SUPPORTED[number];

export default getRequestConfig(async ({requestLocale}) => {
    // requestLocale is async in Next 15-compatible next-intl
    const rl = await requestLocale;                  // can be undefined
    const locale: Supported = (SUPPORTED as readonly string[]).includes(rl as string)
        ? (rl as Supported)
        : 'en';

    try {
        const messages = (await import(`../messages/${locale}.json`)).default;
        return {locale, messages};                     // <-- RETURN LOCALE + MESSAGES
    } catch {
        const fallback = (await import('../messages/en.json')).default;
        return {locale: 'en', messages: fallback};     // <-- ALWAYS RETURN A LOCALE
    }
});
