// /config/i18n.ts
export type LanguageCode = 'en' | 'nl' | 'de' | 'fr' | 'pl';

export type Language = {
    code: LanguageCode;
    prefix: string;
    locale?: string;
    names?: Record<string, string>;
    label: string;
};

export const languages = [
    { code: 'en', prefix: '/en', locale: 'en', label: 'English', names: { en: 'English', nl: 'Engels', de: 'Englisch', fr: 'Anglais', pl: 'Angielski' } },
    { code: 'nl', prefix: '/nl', locale: 'nl', label: 'Nederlands', names: { en: 'Dutch', nl: 'Nederlands', de: 'Niederländisch', fr: 'Néerlandais', pl: 'Niderlandzki' } },
    { code: 'de', prefix: '/de', locale: 'de', label: 'Deutsch', names: { en: 'German', nl: 'Duits', de: 'Deutsch', fr: 'Allemand', pl: 'Niemiecki' } },
    { code: 'fr', prefix: '/fr', locale: 'fr', label: 'Français', names: { en: 'French', nl: 'Frans', de: 'Französisch', fr: 'Français', pl: 'Francuski' } },
    { code: 'pl', prefix: '/pl', locale: 'pl', label: 'Polski', names: { en: 'Polish', nl: 'Pools', de: 'Polnisch', fr: 'Polonais', pl: 'Polski' } },
] as const satisfies readonly Language[];

export const defaultLanguage: LanguageCode = 'en';

// Small helpers
export const languageCodes = languages.map(l => l.code) as LanguageCode[];
export function isLanguageCode(x: string): x is LanguageCode {
    // @ts-ignore-next-line strict alias ok here
    return languageCodes.includes(x);
}
