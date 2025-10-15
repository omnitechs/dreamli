// app/sitemap.ts
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE = 'https://dreamli.nl';
const LANGS = ['en', 'nl', 'de', 'fr', 'pl'] as const;
const DEFAULT_LANG = 'nl';
const PATHS = ['', '/keychains', '/lithophanes', '/contact', '/privacy', '/terms'] as const;
const sina = ""
function urlFor(lang: string, path: string): string {
    // Ensure path starts with '/', but avoid double slash issues
    // path is assumed with leading slash or empty string, so okay
    return `${SITE}/${lang}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const items: MetadataRoute.Sitemap = [];

    for (const path of PATHS) {
        // Build alternates map
        const altObj: Record<string, string> = {};

        for (const l of LANGS) {
            const url = urlFor(l, path);
            altObj[l] = url;
        }
        // Add x-default
        altObj['x-default'] = urlFor(DEFAULT_LANG, path);

        // Now create one item per language
        for (const l of LANGS) {
            const item = {
                url: urlFor(l, path),
                lastModified: now,
                changeFrequency: path === '' ? 'weekly' : 'monthly',
                priority: path === '' ? 1 : 0.8,
                alternates: { languages: altObj },
            };

            items.push(item);
        }
    }

    return items;
}
