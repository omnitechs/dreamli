"use server";

import { prisma } from "@/lib/prisma";

export async function listProjects(ownerId: string) {
    return prisma.project.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
    });
}

export async function createProject(ownerId: string, name: string) {
    const p = await prisma.project.create({
        data: { ownerId, name },
        select: { id: true },
    });
    return p.id as string;
}
