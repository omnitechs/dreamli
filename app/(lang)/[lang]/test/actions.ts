"use server";

import WorkplaceService from "@/app/(lang)/[lang]/test/classes/service";
import { CommitStorePrisma } from "@/app/(lang)/[lang]/test/classes/CommitStorePrisma";
import type { UUID, Message } from "@/app/(lang)/[lang]/test/classes/interface";

/** build service from optional headId */
async function build(headId?: UUID) {
    const store = new CommitStorePrisma();
    const headCommit = headId ? await store.get(headId) : null;
    const svc = new WorkplaceService(store, headCommit ?? null);
    return { svc, store };
}

/** Traverse linked list (DB) and collect messages in chronological order */
async function loadHistory(headId: UUID | undefined) {
    if (!headId) return [] as Message[];
    const store = new CommitStorePrisma();

    const chain: { id: UUID; parentId?: UUID; messages: Message[] }[] = [];
    let id: UUID | undefined = headId;

    while (id) {
        const c = await store.get(id);
        if (!c) break;
        chain.push({ id: c.id, parentId: c.parentId as UUID | undefined, messages: c.toJSON().messages });
        id = (c.parentId as UUID | undefined) ?? undefined;
    }
    chain.reverse();

    const all: Message[] = [];
    for (const c of chain) if (c.messages?.length) all.push(...c.messages);
    return all;
}

/** Initialize (or resume) a workspace by headId; returns UI state */
export async function initWorkplace(headId?: UUID) {
    const { svc } = await build(headId);
    const newHead = svc.getHeadId();
    const messages = await loadHistory(newHead);
    const generator = svc.getGenerator().toJSON();
    return { headId: newHead, messages, generator };
}

export async function actionSetPrompt(headId: UUID | undefined, text: string) {
    const { svc } = await build(headId);
    svc.getGenerator().updatePrompt(text); // auto-commit + save via service
    const newHead = svc.getHeadId();
    const messages = await loadHistory(newHead);
    const generator = svc.getGenerator().toJSON();
    return { headId: newHead, messages, generator };
}

export async function actionPostMessage(headId: UUID | undefined, text: string) {
    const { svc } = await build(headId);
    svc.postMessage(text, "user");
    const newHead = svc.getHeadId();
    const messages = await loadHistory(newHead);
    const generator = svc.getGenerator().toJSON();
    return { headId: newHead, messages, generator };
}

export async function actionRecordVersion(headId: UUID | undefined) {
    const { svc } = await build(headId);
    // dummy model, replace with your real one
    const model = { id: crypto.randomUUID(), url: "/models/demo.glb" } as any;
    await svc.recordVersion(model);
    const newHead = svc.getHeadId();
    const messages = await loadHistory(newHead);
    const generator = svc.getGenerator().toJSON();
    return { headId: newHead, messages, generator };
}
