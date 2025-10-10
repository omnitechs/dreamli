"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import WorkplaceService from "@/app/(lang)/[lang]/test/classes/service";
import { CommitStorePrisma } from "@/app/(lang)/[lang]/test/classes/CommitStorePrisma";
import type { UUID, Image } from "@/app/(lang)/[lang]/test/classes/interface";

// ----------------- helpers -----------------

async function build(headId?: UUID) {
    const store = new CommitStorePrisma();
    const headCommit = headId ? await store.get(headId) : null;
    const svc = new WorkplaceService(store, headCommit ?? null);

    // OPTIONAL: seed generator.messages so it appears in generator.toJSON() for your debug panel
    const msgs = await svc.getAllMessages();
    svc.getGenerator().messages = msgs;

    return { svc, store };
}

function state(svc: WorkplaceService) {
    return {
        headId: svc.getHeadId(),
        generator: svc.getGenerator().toJSON(),
    };
}

// ----------------- public actions -----------------

export async function initWorkplace(headId?: UUID) {
    const { svc } = await build(headId);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionSetPrompt(headId: UUID | undefined, text: string) {
    const { svc } = await build(headId);
    svc.getGenerator().updatePrompt(text);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionSetMode(headId: UUID | undefined, mode: "text" | "image") {
    const { svc } = await build(headId);
    svc.getGenerator().setType(mode);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionPostMessage(headId: UUID | undefined, text: string) {
    const { svc } = await build(headId);
    svc.postMessage(text, "user");
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

/** Save uploaded images to /public/uploads and add to generator */
export async function actionAddImages(headId: UUID | undefined, formData: FormData) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();

    // files[]
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
    }

    // url input
    const urlValue = String(formData.get("imageUrl") ?? "").trim();
    if (urlValue) {
        const id = randomUUID();
        gen.addImage({ id, url: urlValue } as Image);
    }

    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionSelectImage(headId: UUID | undefined, url: string) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.selectImage(img);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionUnselectImage(headId: UUID | undefined, url: string) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.unselectImage(img);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionClearSelection(headId: UUID | undefined) {
    const { svc } = await build(headId);
    svc.getGenerator().clearSelection();
    return {
        headId: svc.getHeadId(),
        generator: svc.getGenerator().toJSON(),
        messages: await svc.getAllMessages(),
    };
}

export async function actionAssignSlot(
    headId: UUID | undefined,
    slot: "front" | "back" | "side" | "threeQuarter" | "top" | "bottom",
    url: string
) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (!img) throw new Error("Image not found for slot assignment");
    gen.assignImage(slot, img);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

export async function actionClearSlot(
    headId: UUID | undefined,
    slot: "front" | "back" | "side" | "threeQuarter" | "top" | "bottom"
) {
    const { svc } = await build(headId);
    svc.getGenerator().clearSlot(slot);
    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
    };
}

/** Generate 3D with Meshy, using env MESHY_API_KEY (text or image mode) */
export async function actionGenerate3D(headId: UUID | undefined, clientPrompt?: string) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) throw new Error("MESHY_API_KEY missing");

    // Guard text mode: make sure we have a prompt (allow passing one directly)
    if (gen.type === "text") {
        const p = (clientPrompt ?? gen.textPrompt ?? "").trim();
        if (!p) throw new Error("Text mode requires a non-empty prompt.");
        if (p !== gen.textPrompt) gen.updatePrompt(p); // commit the prompt
    } else {
        // In image mode, ensure there's at least one image path available
        const anyImages = (gen.images?.length ?? 0) > 0;
        if (!anyImages) throw new Error("Image mode requires at least one image.");
    }

    // 1) start task
    const taskId = await gen.requestModelFromMeshy({ apiKey });

    // 2) poll until finished
    const final = await gen.pollMeshyTask({ apiKey, taskId });

    // 3) extract a model URL (adjust if your response differs)
    const modelUrl =
        (final?.result as any)?.model_url ??
        (final as any)?.assets?.glb ??
        (final as any)?.output_url;

    if (!modelUrl) throw new Error("Meshy finished but no model URL found.");

    // 4) version commit
    await svc.recordVersion({ id: taskId, url: modelUrl } as any);

    return {
        ...state(svc),
        messages: await svc.getAllMessages(),
        taskId,
        modelUrl,
        status: (final as any)?.status ?? "succeeded",
    };
}


const SLOTS = ["front","back","side","threeQuarter","top","bottom"] as const;

export async function actionAssignSlotFromSelection(
    headId: UUID | undefined,
    slot: typeof SLOTS[number]
) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const selected = gen.getSelectedImageUrls?.() ?? [];
    if (selected.length === 0) {
        throw new Error("No selected images to assign.");
    }
    const url = selected[0];
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (!img) throw new Error("Selected image not found in generator.");
    gen.assignImage(slot, img);
    return { headId: svc.getHeadId(), generator: gen.toJSON(), messages: await svc.getAllMessages() };
}

export async function actionBulkAssignFromSelection(headId: UUID | undefined) {
    const { svc } = await build(headId);
    const gen = svc.getGenerator();
    const selected = gen.getSelectedImageUrls?.() ?? [];

    if (selected.length === 0) {
        throw new Error("No selected images to assign.");
    }

    // Map selection order to slots order
    for (let idx = 0; idx < SLOTS.length && idx < selected.length; idx++) {
        const slot = SLOTS[idx];
        const url = selected[idx];
        const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
        if (img) gen.assignImage(slot, img);
    }

    return { headId: svc.getHeadId(), generator: gen.toJSON(), messages: await svc.getAllMessages() };
}

