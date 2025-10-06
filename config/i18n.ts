// config/i18n.ts

// Keep this simple to avoid circular refs in TypeScript.
export type LanguageCode = 'en' | 'nl' | 'de' | 'fr' | 'pl';

export type Language = {
    code: LanguageCode;
    /** URL prefix that appears before the path (e.g., '/en', '/nl'). Use '' to mean no prefix. */
    prefix: string;
    /** Optional BCP-47 locale used for Intl.DisplayNames (defaults to code). */
    locale?: string;
    /** Per-UI-language overrides: keys are UI language codes (e.g., 'en','nl','de',...). */
    names?: Record<string, string>;
    /** Optional legacy label; used as a last-resort fallback. */
    label?: string;
};

export const languages = [
    {
        code: 'en',
        prefix: '/en', // if you ever want default without prefix, set '' here
        locale: 'en',
        label: 'English',
        names: {
            en: 'English',
            nl: 'Engels',
            de: 'Englisch',
            fr: 'Anglais',
            pl: 'Angielski',
        },
    },
    {
        code: 'nl',
        prefix: '/nl',
        locale: 'nl',
        label: 'Nederlands',
        names: {
            en: 'Dutch',
            nl: 'Nederlands',
            de: 'Niederländisch',
            fr: 'Néerlandais',
            pl: 'Niderlandzki',
        },
    },
    {
        code: 'de',
        prefix: '/de',
        locale: 'de',
        label: 'Deutsch',
        names: {
            en: 'German',
            nl: 'Duits',
            de: 'Deutsch',
            fr: 'Allemand',
            pl: 'Niemiecki',
        },
    },
    {
        code: 'fr',
        prefix: '/fr',
        locale: 'fr',
        label: 'Français',
        names: {
            en: 'French',
            nl: 'Frans',
            de: 'Französisch',
            fr: 'Français',
            pl: 'Francuski',
        },
    },
    {
        code: 'pl',
        prefix: '/pl',
        locale: 'pl',
        label: 'Polski',
        names: {
            en: 'Polish',
            nl: 'Pools',
            de: 'Polnisch',
            fr: 'Polonais',
            pl: 'Polski',
        },
    },
] as const satisfies readonly Language[];

export const defaultLanguage: LanguageCode = 'en';
