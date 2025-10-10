// app/projects/[projectId]/actions.ts
"use server";


import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import WorkplaceService from "@/app/(lang)/[lang]/projects/classes/service";
import { CommitStorePrisma } from "@/app/(lang)/[lang]/projects/classes/CommitStorePrisma";
import type { UUID, Message, Image } from "@/app/(lang)/[lang]/projects/classes/interface";
import { prisma } from "@/lib/prisma";

// ---------- helpers ----------
async function build(projectId: UUID, headId?: UUID) {
    const store = new CommitStorePrisma();
    // load head from project if not provided
    let headCommit = undefined;
    if (headId) {
        headCommit = await store.get(headId);
    } else {
        const proj = await prisma.project.findUnique({ where: { id: projectId } });
        if (proj?.headId) headCommit = await store.get(proj.headId);
    }
    const svc = new WorkplaceService(store, projectId, headCommit ?? null);
    return { svc, store };
}

async function listCommits(projectId: UUID) {
    const store = new CommitStorePrisma();
    const rows = await store.listByProject(projectId);
    return rows.map(c => c.toJSON());
}

async function state(projectId: UUID, svc: WorkplaceService) {
    return {
        projectId,
        headId: svc.getHeadId(),
        commits: await listCommits(projectId),
        generator: svc.getGenerator().toJSON(),
        messages: await svc.getAllMessages(),
    };
}

// ---------- init & checkout ----------
export async function initProject(projectId: UUID) {
    const { svc } = await build(projectId);
    return state(projectId, svc);
}

export async function checkoutCommit(projectId: UUID, commitId: UUID) {
    const { svc } = await build(projectId);
    await svc.checkout(commitId);
    return state(projectId, svc);
}

// ---------- generator: prompt & mode ----------
export async function actionSetPrompt(projectId: UUID, headId: UUID | undefined, text: string) {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().updatePrompt(text);
    return state(projectId, svc);
}

export async function actionSetMode(projectId: UUID, headId: UUID | undefined, mode: "text" | "image") {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().setType(mode);
    return state(projectId, svc);
}

// ---------- chat/messages ----------
export async function actionPostMessage(projectId: UUID, headId: UUID | undefined, text: string) {
    const { svc } = await build(projectId, headId);
    svc.postMessage(text, "user");
    return state(projectId, svc);
}

// ---------- images: add / select / unselect / clear selection ----------
export async function actionAddImages(projectId: UUID, headId: UUID | undefined, formData: FormData) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();

    let added = 0;

    // files
    const files = formData.getAll("files") as File[];
    for (const file of files) {
        if (!file || typeof file.arrayBuffer !== "function") continue;
        const buf = Buffer.from(await file.arrayBuffer());
        const id = randomUUID();
        const ext = (file.type?.split("/")[1] || "png").toLowerCase();
        const fname = `${id}.${ext}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fname);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, buf);
        const url = `/uploads/${fname}`;
        gen.addImage({ id, url } as Image);
        added++;
    }

    // url input
    const urlValue = String(formData.get("imageUrl") ?? "").trim();
    if (urlValue) {
        const id = randomUUID();
        gen.addImage({ id, url: urlValue } as Image);
        added++;
    }

    // auto-switch to image mode if any added
    if (added > 0) gen.setType("image");

    return state(projectId, svc);
}

export async function actionSelectImage(projectId: UUID, headId: UUID | undefined, url: string) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.selectImage(img);
    return state(projectId, svc);
}

export async function actionUnselectImage(projectId: UUID, headId: UUID | undefined, url: string) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.unselectImage(img);
    return state(projectId, svc);
}

export async function actionClearSelection(projectId: UUID, headId: UUID | undefined) {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().clearSelection();
    return state(projectId, svc);
}

// ---------- slots: assign / from-selected / bulk / unassign ----------
const SLOTS = ["front","back","side","threeQuarter","top","bottom"] as const;

export async function actionAssignSlot(
    projectId: UUID,
    headId: UUID | undefined,
    slot: typeof SLOTS[number],
    url: string
) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (!img) throw new Error("Image not found");
    gen.assignImage(slot, img);
    return state(projectId, svc);
}

export async function actionAssignSlotFromSelection(
    projectId: UUID,
    headId: UUID | undefined,
    slot: typeof SLOTS[number]
) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const selected = gen.getSelectedImageUrls?.() ?? [];
    if (selected.length === 0) throw new Error("No selected images.");
    const url = selected[0];
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (!img) throw new Error("Selected image missing in generator");
    gen.assignImage(slot, img);
    return state(projectId, svc);
}

export async function actionBulkAssignFromSelection(projectId: UUID, headId: UUID | undefined) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const selected = gen.getSelectedImageUrls?.() ?? [];
    for (let i = 0; i < SLOTS.length && i < selected.length; i++) {
        const slot = SLOTS[i];
        const url = selected[i];
        const img = gen.images.find(it => (it as any)?.url === url || (it as any)?.src === url);
        if (img) gen.assignImage(slot, img);
    }
    return state(projectId, svc);
}

export async function actionUnassignSlot(
    projectId: UUID,
    headId: UUID | undefined,
    slot: typeof SLOTS[number]
) {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().unassignSlot(slot);
    return state(projectId, svc);
}

// ---------- images: delete entirely ----------
export async function actionDeleteImage(projectId: UUID, headId: UUID | undefined, url: string) {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().deleteImageByUrl(url);
    return state(projectId, svc);
}

// ---------- Meshy 3D ----------
export async function actionGenerate3D(projectId: UUID, headId: UUID | undefined) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) throw new Error("MESHY_API_KEY missing");

    const taskId = await gen.requestModelFromMeshy({ apiKey });
    const final = await gen.pollMeshyTask({ apiKey, taskId });
    const modelUrl =
        (final?.result as any)?.model_url ??
        (final as any)?.assets?.glb ??
        (final as any)?.output_url;

    if (!modelUrl) throw new Error("Meshy finished but no model URL found.");

    await svc.recordVersion({ id: taskId, url: modelUrl } as any);

    return {
        ...(await state(projectId, svc)),
        taskId,
        modelUrl,
        status: (final as any)?.status ?? "succeeded",
    };
}
