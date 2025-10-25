import { prisma } from '@/lib/prisma';

/**
 * Increment project public views counter in a way that won't crash
 * if Prisma Client hasn't been regenerated or the column is missing.
 *
 * - Prefer raw SQL to bypass Prisma Client payload validation.
 * - Swallow all errors silently; view count is non-critical.
 */
export async function safeIncrementProjectViews(projectId: string): Promise<void> {
  if (!projectId) return;
  try {
    // Use raw SQL so it works even if the generated Prisma Client DMMF
    // doesn't yet include the new viewsCount field.
    await prisma.$executeRawUnsafe(
      'UPDATE "Project" SET "viewsCount" = COALESCE("viewsCount", 0) + 1 WHERE id = $1',
      projectId,
    );
  } catch {
    // Ignore any error (e.g., column missing in DB in some environments)
  }
}

/**
 * Check if a column exists on the Project table.
 */
export async function projectColumnExists(columnName: 'isPublic' | 'viewsCount'): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Project' AND column_name = ${columnName}
      ) AS exists`;
    return Boolean(rows?.[0]?.exists);
  } catch {
    return false;
  }
}

/**
 * Load public projects for an owner in a way that tolerates schema drift.
 * Returns minimal fields needed by profile pages.
 */
export async function getPublicProjectsByOwner(ownerId: string): Promise<{ id: string; name: string; createdAt: any; isPublic: boolean }[]> {
  if (!ownerId) return [];
  try {
    const hasIsPublic = await projectColumnExists('isPublic');
    if (hasIsPublic) {
      // Only public projects
      const rows = await prisma.$queryRaw<{ id: string; name: string; createdAt: any; isPublic: boolean }[]>`
        SELECT id, name, "createdAt", "isPublic" FROM "Project" WHERE "ownerId" = ${ownerId} AND "isPublic" = true`;
      return rows || [];
    }
    // Fallback: no isPublic column; return all as public
    const rows = await prisma.$queryRaw<{ id: string; name: string; createdAt: any }[]>`
      SELECT id, name, "createdAt" FROM "Project" WHERE "ownerId" = ${ownerId}`;
    return (rows || []).map(r => ({ ...r, isPublic: true }));
  } catch {
    return [];
  }
}

/**
 * Get a map of projectId -> viewsCount, tolerating missing column.
 */
export async function getProjectViewsMap(projectIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (!projectIds?.length) return map;
  try {
    const hasViews = await projectColumnExists('viewsCount');
    if (!hasViews) return map; // default zero
    const rows = await prisma.$queryRaw<{ id: string; viewsCount: number }[]>`
      SELECT id, COALESCE("viewsCount", 0)::int AS "viewsCount" FROM "Project" WHERE id = ANY(${projectIds}::text[])`;
    for (const r of rows || []) map.set(String(r.id), Number((r as any).viewsCount) || 0);
  } catch {
    // ignore
  }
  return map;
}
