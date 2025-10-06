import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
    const l = typeof locale === 'string' ? locale : 'en';  // force string
    try {
        return {
            locale: l,                                          // ✅ guaranteed string
            messages: (await import(`../messages/${l}.json`)).default
        };
    } catch {
        return {
            locale: 'en',
            messages: (await import('../messages/en.json')).default
        };
    }
});
