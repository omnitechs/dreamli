// /libraries/language.ts
import { defaultLanguage, type LanguageCode } from '@/config/i18n';

export type Messages = Record<string, any>;

/**
 * Server-side loader.
 * Loads ONLY the current locale JSON so you don't ship all locales to the client.
 * Keep usages in server files (layout/page/route/loader).
 */
export async function getDictionary(lang: LanguageCode): Promise<Messages> {
    // Normalize unknown codes to default
    const code: LanguageCode = (['en','nl','de','fr','pl'] as const).includes(lang as any)
        ? (lang as LanguageCode)
        : defaultLanguage;

    try {
        // Dynamic import on the server – Next won't bundle all files to client.
        const mod = await import(`@/dictionaries/${code}.json`);
        return (mod.default ?? mod) as Messages;
    } catch {
        if (code !== defaultLanguage) {
            const fallback = await import(`@/dictionaries/${defaultLanguage}.json`);
            return (fallback.default ?? fallback) as Messages;
        }
        return {};
    }
}

/** Safe getter: "a.b.c" path into an object */
export function pick(path: string, obj: any) {
    return path.split('.').reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
}

/** Cheap {var} interpolation */
export function interpolate(str: string, vars?: Record<string, any>) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
