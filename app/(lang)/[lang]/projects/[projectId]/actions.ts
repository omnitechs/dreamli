// app/projects/[projectId]/actions.ts
"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import WorkplaceService from "@/app/(lang)/[lang]/projects/classes/service";
import { CommitStorePrisma } from "@/app/(lang)/[lang]/projects/classes/CommitStorePrisma";
import type { UUID, Image } from "@/app/(lang)/[lang]/projects/classes/interface";
import { prisma } from "@/lib/prisma";
import type { ProjectState } from "../types";

// ---------------- helpers ----------------
const SLOTS = ["front","back","side","threeQuarter","top","bottom"] as const;

async function build(projectId: UUID, headId?: UUID) {
    const store = new CommitStorePrisma();
    // pick a head commit (explicit headId wins; else project.headId; else fresh)
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
    return rows.map(c => c.toJSON()); // newest first (CommitStorePrisma implements ordering)
}

async function state(projectId: UUID, svc: WorkplaceService): Promise<ProjectState> {
    const commits = await listCommits(projectId);
    const messages = await svc.getAllMessages();
    return {
        projectId,
        headId: svc.getHeadId(),
        commits,
        generator: svc.getGenerator().toJSON() as any,
        messages: messages as any,
    };
}

// ---------------- init & checkout ----------------
export async function initProject(projectId: UUID): Promise<ProjectState> {
    const { svc } = await build(projectId);
    return state(projectId, svc);
}

export async function checkoutCommit(projectId: UUID, commitId: UUID): Promise<ProjectState> {
    const { svc } = await build(projectId);
    await svc.checkout(commitId);
    return state(projectId, svc);
}

// ---------------- generator: prompt & mode ----------------
export async function actionSetPrompt(projectId: UUID, headId: UUID | undefined, text: string): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().updatePrompt(text);
    return state(projectId, svc);
}

export async function actionSetMode(projectId: UUID, headId: UUID | undefined, mode: "text" | "image"): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().setType(mode);
    return state(projectId, svc);
}

// ---------------- chat/messages ----------------
export async function actionPostMessage(projectId: UUID, headId: UUID | undefined, text: string): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.postMessage(text, "user");
    return state(projectId, svc);
}

// ---------------- images: add / select / unselect / clear selection ----------------
export async function actionAddImages(projectId: UUID, headId: UUID | undefined, formData: FormData): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();

    let added = 0;

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
        gen.addImage({ id, src: url } as Image);
        added++;
    }

    // imageUrl field
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (imageUrl) {
        const id = randomUUID();
        gen.addImage({ id, src: imageUrl } as Image);
        added++;
    }

    // auto-switch to image mode if anything added
    if (added > 0) gen.setType("image");

    return state(projectId, svc);
}

export async function actionSelectImage(projectId: UUID, headId: UUID | undefined, url: string): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.selectImage(img);
    return state(projectId, svc);
}

export async function actionUnselectImage(projectId: UUID, headId: UUID | undefined, url: string): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (img) gen.unselectImage(img);
    return state(projectId, svc);
}

export async function actionClearSelection(projectId: UUID, headId: UUID | undefined): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().clearSelection();
    return state(projectId, svc);
}

// ---------------- slots: assign / from-selected / bulk / unassign ----------------
export async function actionAssignSlot(
    projectId: UUID,
    headId: UUID | undefined,
    slot: (typeof SLOTS)[number],
    url: string
): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();
    const img = gen.images.find(i => (i as any)?.url === url || (i as any)?.src === url);
    if (!img) throw new Error("Image not found for assignment");
    gen.assignImage(slot, img);
    return state(projectId, svc);
}

export async function actionAssignSlotFromSelection(
    projectId: UUID,
    headId: UUID | undefined,
    slot: (typeof SLOTS)[number]
): Promise<ProjectState> {
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

export async function actionBulkAssignFromSelection(projectId: UUID, headId: UUID | undefined): Promise<ProjectState> {
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
    slot: (typeof SLOTS)[number]
): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().unassignSlot(slot);
    return state(projectId, svc);
}

// ---------------- images: delete entirely ----------------
export async function actionDeleteImage(projectId: UUID, headId: UUID | undefined, url: string): Promise<ProjectState> {
    const { svc } = await build(projectId, headId);
    svc.getGenerator().deleteImageByUrl(url);
    return state(projectId, svc);
}

// --- GENERIC: create images via GPT and optionally assign to a slot ---
export async function actionCreateImages(
    projectId: string,
    headId: string | undefined,
    payload: {
        prompt?: string;
        n?: number;
        size?: "256x256" | "512x512" | "1024x1024";
        assignSlot?: "front" | "back" | "side" | "threeQuarter" | "top" | "bottom" | null;
    }
) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();

    // 1) generate images (uses selected refs automatically for edits)
    const urls = await (gen as any).generateImagesWithGPT({
        prompt: payload.prompt,
        n: payload.n ?? 1,
        size: payload.size ?? "1024x1024",
    });

    // 2) add all to library
    const created: Array<{ id: string; url: string }> = [];
    for (const url of urls) {
        const id = randomUUID(); // ✅ fix: use imported randomUUID()
        gen.addImage({ id, url } as any);
        created.push({ id, url });
    }

    // 3) optionally assign first to a slot
    if (payload.assignSlot && created.length > 0) {
        const first = created[0];
        gen.assignImage(payload.assignSlot, { id: first.id, url: first.url } as any);
    }

    // 4) return full refreshed state
    return state(projectId, svc);
}

function kindFor(gen: any, urls: string[]) {
    if (gen.type === 'text') return 'text';
    return urls.length > 1 ? 'multi' : 'image';
}

// ---------- Meshy actions (fixed to use build(), no getStore) ----------
export async function actionGenerate3D(projectId: string, headId: string) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();

    // Kick off the task (no wait so we can stream progress in the UI)
    const taskId: string = await gen.requestModelFromMeshy({
        textStage: gen.type === 'text' ? 'preview' : undefined,
        waitFor: 'none'
    });

    const urls = gen.getSelectedImageUrls?.() ?? [];
    const kind = kindFor(gen, urls);

    // UI will connect to this SSE route to get realtime updates
    return {
        taskId,
        status: 'PENDING',
        streamUrl: `/api/meshy/stream?kind=${kind}&id=${encodeURIComponent(taskId)}`
    };
}

export async function actionRecordVersion(
    projectId: string,
    headId: string,
    taskId: string,
    modelUrl: string
) {
    const { svc } = await build(projectId, headId);
    await svc.recordVersion({ id: taskId, url: modelUrl } as any);
    return { ok: true };
}

/** OPTIONAL: blocking version if you ever want to wait server-side.
 * Uses resource endpoints that return `model_urls` (NOT `output_url`).
 */
export async function actionGenerate3DBlocking(projectId: string, headId: string) {
    const { svc } = await build(projectId, headId);
    const gen = svc.getGenerator();

    // Wait for completion (polling via the Generator helper)
    const taskId: string = await gen.requestModelFromMeshy({ waitFor: 'succeeded' });

    // Fetch the final task object from the right endpoint and extract a model URL:
    const urls = gen.getSelectedImageUrls?.() ?? [];
    const kind = kindFor(gen, urls);

    const apiKey = process.env.MESHY_API_KEY!;
    const headers = { Authorization: `Bearer ${apiKey}` };

    const baseV1 = 'https://api.meshy.ai/openapi/v1';
    const baseV2 = 'https://api.meshy.ai/openapi/v2';
    const path =
        kind === 'text'
            ? `${baseV2}/text-to-3d/${taskId}`
            : kind === 'multi'
                ? `${baseV1}/multi-image-to-3d/${taskId}`
                : `${baseV1}/image-to-3d/${taskId}`;

    const res = await fetch(path, { headers });
    if (!res.ok) throw new Error(`Meshy fetch failed (${res.status})`);
    const final = await res.json();

    // ✅ Meshy returns model_urls on the task object
    const modelUrl =
        final?.model_urls?.glb ??
        final?.model_urls?.fbx ??
        final?.model_urls?.obj ??
        final?.model_urls?.usdz;

    if (!modelUrl) throw new Error('Meshy finished but no model URL found.');

    await svc.recordVersion({ id: taskId, url: modelUrl } as any);
    return { status: final?.status ?? 'SUCCEEDED', modelUrl };
}
