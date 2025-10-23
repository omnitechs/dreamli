// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Regenerate the sitemap periodically to include new DB content
export const revalidate = 60 * 60; // 1 hour

const SITE = 'https://dreamli.nl';
const LANGS = ['en', 'nl', 'de', 'fr', 'pl'] as const;
const DEFAULT_LANG = 'nl';
const STATIC_PATHS = ['', '/ai', '/keychains', '/lithophanes', '/contact', '/privacy', '/terms'] as const;

function urlFor(lang: string, path: string): string {
  // Ensure path starts with '/', but avoid double slash issues
  // path is assumed with leading slash or empty string, so okay
  return `${SITE}/${lang}${path}`;
}

function slugify(s?: string | null) {
  const base = (s || '').toString().toLowerCase();
  return (
    base
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'project'
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const items: MetadataRoute.Sitemap = [];

  // 1) Static pages per language
  for (const path of STATIC_PATHS) {
    const altObj: Record<string, string> = {};
    for (const l of LANGS) altObj[l] = urlFor(l, path);
    altObj['x-default'] = urlFor(DEFAULT_LANG, path);

    for (const l of LANGS) {
      items.push({
        url: urlFor(l, path),
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: { languages: altObj },
      } as any);
    }
  }

  // 2) Dynamic: public project pages built from DB
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, createdAt: true },
  });

  if (projects.length) {
    const projectIds = projects.map((p) => p.id);
    // Find latest commit timestamps per project to use as lastModified
    const commits = await prisma.commit.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: 'desc' },
      select: { projectId: true, createdAt: true },
    });
    const latestByProject = new Map<string, Date>();
    for (const c of commits) {
      if (!latestByProject.has(c.projectId)) latestByProject.set(c.projectId, c.createdAt);
    }

    for (const p of projects) {
      const slug = slugify(p.name);
      const path = `/ai/projects/${slug}/${p.id}`;
      const lastModified = latestByProject.get(p.id) ?? p.createdAt ?? now;

      const altObj: Record<string, string> = {};
      for (const l of LANGS) altObj[l] = urlFor(l, path);
      altObj['x-default'] = urlFor(DEFAULT_LANG, path);

      for (const l of LANGS) {
        items.push({
          url: urlFor(l, path),
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: { languages: altObj },
        } as any);
      }
    }
  }

  // NOTE: Individual model pages currently redirect to project pages for canonical SEO,
  // so we do not include per-model URLs to avoid duplicates. If desired later, add them here.

  return items;
}
