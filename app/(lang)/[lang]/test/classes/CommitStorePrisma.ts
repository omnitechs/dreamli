// /core/CommitStorePrisma.ts
import { prisma } from "@/lib/prisma";
import type { UUID } from "./interface";
import { Commit } from "./commit";

export class CommitStorePrisma {
    async get(id: UUID): Promise<Commit | undefined> {
        const row = await prisma.commit.findUnique({ where: { id } });
        if (!row) return undefined;

        return Commit.fromJSON({
            id: row.id,
            timestamp: row.timestamp.toISOString(),
            parentId: row.parentId ?? undefined,
            isVersion: row.isVersion,
            summary: row.summary ?? undefined,
            generator: row.generator as any,
            model: (row.model as any) ?? null,
            messages: (row.messages as any[]) ?? [],
        });
    }

    async save(commit: Commit): Promise<void> {
        const j = commit.toJSON();
        await prisma.commit.upsert({
            where: { id: j.id },
            create: {
                id: j.id,
                parentId: (j.parentId as UUID | undefined) ?? null,
                timestamp: new Date(j.timestamp),
                isVersion: j.isVersion,
                summary: j.summary ?? null,
                generator: j.generator as any,
                model: (j.model as any) ?? null,
                messages: (j.messages as any[]) ?? [],
            },
            update: {
                parentId: (j.parentId as UUID | undefined) ?? null,
                timestamp: new Date(j.timestamp),
                isVersion: j.isVersion,
                summary: j.summary ?? null,
                generator: j.generator as any,
                model: (j.model as any) ?? null,
                messages: (j.messages as any[]) ?? [],
            },
        });
    }
}