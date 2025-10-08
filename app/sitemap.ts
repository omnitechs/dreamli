// app/sitemap.ts
import type { MetadataRoute } from 'next';

const SITE = 'https://dreamli.nl';
const LANGS = ['en', 'nl', 'de', 'fr', 'pl'] as const;
const DEFAULT_LANG = 'nl';
const PATHS = ['', '/keychains', '/lithophanes', '/contact', '/privacy', '/terms'] as const;

const urlFor = (lang: string, path: string) => `${SITE}/${lang}${path}`;

function alternatesFor(path: string) {
    const languages = Object.fromEntries(LANGS.map(l => [l, urlFor(l, path)])) as Record<string,string>;
    languages['x-default'] = urlFor(DEFAULT_LANG, path);
    return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const output = PATHS.map((p) => ({
        url: urlFor(DEFAULT_LANG, p),
        lastModified: now,
        changeFrequency: p === '' ? 'weekly' : 'monthly',
        priority: p === '' ? 1 : 0.8,
        alternates: alternatesFor(p), // renders <xhtml:link hreflang="..." />
    }));
    console.log(output);
    return PATHS.map((p) => ({
        url: urlFor(DEFAULT_LANG, p),
        lastModified: now,
        changeFrequency: p === '' ? 'weekly' : 'monthly',
        priority: p === '' ? 1 : 0.8,
        alternates: alternatesFor(p), // renders <xhtml:link hreflang="..." />
    }));
}
