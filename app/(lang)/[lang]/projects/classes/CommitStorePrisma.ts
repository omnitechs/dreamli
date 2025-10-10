import { prisma } from "@/lib/prisma";
import { Commit } from "./commit";
import type { CommitStore } from "./commitStore";
import type { UUID } from "./interface";

export class CommitStorePrisma implements CommitStore {
    // Get one commit by id
    async get(id: UUID) {
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

    // Save or upsert
    async save(projectId: UUID, commit: Commit): Promise<void> {
        const json = commit.toJSON();
        await prisma.commit.upsert({
            where: { id: json.id },
            create: {
                id: json.id,
                timestamp: new Date(json.timestamp),
                parentId: json.parentId ?? null,
                isVersion: json.isVersion,
                summary: json.summary ?? null,
                generator: json.generator as any,
                model: json.model as any,
                messages: json.messages as any,
                projectId,
            },
            update: {
                // commits are immutable; usually no update needed
            },
        });
        // optionally update project.headId to follow latest head
        await prisma.project.update({
            where: { id: projectId },
            data: { headId: json.id },
        });
    }

    // List commits for a project (newest first)
    async listByProject(projectId: UUID) {
        const rows = await prisma.commit.findMany({
            where: { projectId },
            orderBy: { timestamp: "desc" },
        });
        return rows.map(r =>
            Commit.fromJSON({
                id: r.id,
                timestamp: r.timestamp.toISOString(),
                parentId: r.parentId ?? undefined,
                isVersion: r.isVersion,
                summary: r.summary ?? undefined,
                generator: r.generator as any,
                model: (r.model as any) ?? null,
                messages: (r.messages as any[]) ?? [],
            })
        );
    }
}
