// app/projects/[projectId]/project-client.tsx
"use client";

import { useState, useTransition } from "react";
import {
    initProject,
    checkoutCommit,
    actionSetPrompt,
    actionSetMode,
    actionPostMessage,
    actionAddImages,
    actionSelectImage,
    actionUnselectImage,
    actionClearSelection,
    actionAssignSlot,
    actionAssignSlotFromSelection,
    actionBulkAssignFromSelection,
    actionUnassignSlot,
    actionDeleteImage,
    actionGenerate3D,
} from "./actions";

type Props = { initial: any };

const SLOTS: Array<"front" | "back" | "side" | "threeQuarter" | "top" | "bottom"> = [
    "front","back","side","threeQuarter","top","bottom",
];

export default function ProjectClient({ initial }: Props) {
    const [state, setState] = useState<any>(initial);
    const [isPending, startTransition] = useTransition();

    const refresh = (r: any) => setState(r);

    // Commit selection
    const selectCommit = (id: string) => {
        startTransition(async () => refresh(await checkoutCommit(state.projectId, id)));
    };

    // Prompt & mode
    const [prompt, setPrompt] = useState(state.generator?.textPrompt ?? "");
    const [mode, setMode] = useState<"text" | "image">(state.generator?.type ?? "text");

    const savePrompt = () => {
        startTransition(async () => {
            const r = await actionSetPrompt(state.projectId, state.headId, prompt);
            refresh(r);
        });
    };

    const setModeServer = (m: "text" | "image") => {
        setMode(m);
        startTransition(async () => refresh(await actionSetMode(state.projectId, state.headId, m)));
    };

    // Chat
    const [chat, setChat] = useState("");
    const sendChat = () => {
        if (!chat.trim()) return;
        startTransition(async () => {
            const r = await actionPostMessage(state.projectId, state.headId, chat.trim());
            setChat("");
            refresh(r);
        });
    };

    // Upload
    const onUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        form.reset();
        startTransition(async () => {
            const r = await actionAddImages(state.projectId, state.headId, fd);
            refresh(r);
        });
    };

    // Selection
    const toggleSelect = (url: string) => {
        const isSelected = Array.isArray(state?.generator?.selectedUrls)
            ? state.generator.selectedUrls.includes(url)
            : false;

        startTransition(async () => {
            const r = isSelected
                ? await actionUnselectImage(state.projectId, state.headId, url)
                : await actionSelectImage(state.projectId, state.headId, url);
            refresh(r);
        });
    };

    const clearSelection = () => {
        startTransition(async () => refresh(await actionClearSelection(state.projectId, state.headId)));
    };

    // Slots
    const assignSlot = (slot: (typeof SLOTS)[number], url: string) => {
        startTransition(async () => refresh(await actionAssignSlot(state.projectId, state.headId, slot, url)));
    };
    const assignSlotFromSel = (slot: (typeof SLOTS)[number]) => {
        startTransition(async () => refresh(await actionAssignSlotFromSelection(state.projectId, state.headId, slot)));
    };
    const bulkAssign = () => {
        startTransition(async () => refresh(await actionBulkAssignFromSelection(state.projectId, state.headId)));
    };
    const unassignSlot = (slot: (typeof SLOTS)[number]) => {
        startTransition(async () => refresh(await actionUnassignSlot(state.projectId, state.headId, slot)));
    };

    // Delete image
    const deleteImage = (url: string) => {
        startTransition(async () => refresh(await actionDeleteImage(state.projectId, state.headId, url)));
    };

    // Meshy
    const generate3D = () => {
        startTransition(async () => {
            const r = await actionGenerate3D(state.projectId, state.headId);
            refresh(r);
            alert(`Task ${r.taskId} finished (${r.status}). Model URL: ${r.modelUrl}`);
        });
    };

    // derived
    const commits = (state.commits ?? []) as Array<any>;
    const gen = state.generator ?? {};
    const imgs: Array<{ url: string }> = (gen?.images ?? [])
        .map((i: any) => ({ url: i.url ?? i.src }))
        .filter((x: any) => !!x.url);
    const designated = gen?.designated ?? {};

    return (
        <div className="grid grid-cols-[280px_1fr_360px] gap-4 p-4 h-[calc(100vh-2rem)]">
            {/* LEFT: commits */}
            <aside className="border rounded-xl overflow-auto">
                <div className="p-3 border-b font-medium">Commits</div>
                <div className="divide-y">
                    {commits.map(c => {
                        const selected = c.id === state.headId;
                        return (
                            <button
                                key={c.id}
                                onClick={() => selectCommit(c.id)}
                                className={`w-full text-left p-3 ${selected ? "bg-gray-100" : "hover:bg-gray-50"}`}
                            >
                                <div className="text-xs opacity-60">{new Date(c.timestamp).toLocaleString()}</div>
                                <div className="text-sm">{c.summary ?? "(no summary)"}</div>
                                {c.isVersion ? (
                                    <div className="text-[10px] mt-1 inline-block rounded bg-emerald-100 px-2 py-[2px]">
                                        version
                                    </div>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* CENTER: messages / logs */}
            <main className="border rounded-xl overflow-auto">
                <div className="p-3 border-b font-medium">Messages & Logs</div>

                <div className="p-3 space-y-3">
                    {/* chat composer */}
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            value={chat}
                            onChange={(e) => setChat(e.target.value)}
                            placeholder="Write a message…"
                        />
                        <button
                            onClick={sendChat}
                            disabled={isPending}
                            className="border rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
                        >
                            Send (commit)
                        </button>
                    </div>

                    {/* list */}
                    {state.messages.length === 0 ? (
                        <div className="text-sm opacity-60">No messages.</div>
                    ) : (
                        state.messages.map((m: any) => (
                            <div key={m.id} className="rounded-lg border p-3">
                                <div className="text-xs opacity-60">
                                    {m.role} • {new Date(m.createdAt).toLocaleString()}
                                </div>
                                <div className="mt-1">{m.content}</div>
                                {m.action ? (
                                    <pre className="mt-2 text-[11px] bg-gray-50 rounded p-2 overflow-auto">
{JSON.stringify(m.action, null, 2)}
                  </pre>
                                ) : null}
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* RIGHT: generator panel */}
            <aside className="border rounded-xl overflow-auto">
                <div className="p-3 border-b font-medium">Generator</div>

                <div className="p-3 space-y-6">
                    {/* head & mode */}
                    <div className="text-xs opacity-60 break-all">Head: {state.headId}</div>

                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setModeServer("text")}
                                className={`rounded-lg px-3 py-2 border ${mode === "text" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                disabled={isPending}
                            >
                                Text mode
                            </button>
                            <button
                                onClick={() => setModeServer("image")}
                                className={`rounded-lg px-3 py-2 border ${mode === "image" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                disabled={isPending}
                            >
                                Image mode
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-1 gap-2">
                            <label className="text-sm">Prompt</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border rounded px-3 py-2"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Type a prompt…"
                                />
                                <button
                                    onClick={savePrompt}
                                    disabled={isPending}
                                    className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* upload */}
                    <div className="space-y-2">
                        <div className="font-medium">Add Images</div>
                        <form onSubmit={onUploadSubmit} className="flex flex-col gap-2">
                            <input name="files" type="file" accept="image/*" multiple className="border rounded px-3 py-2" />
                            <div className="flex gap-2">
                                <input name="imageUrl" type="url" placeholder="https://…" className="flex-1 border rounded px-3 py-2" />
                                <button type="submit" className="border rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-60" disabled={isPending}>
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* images grid */}
                    <div className="space-y-2">
                        <div className="font-medium">Images</div>
                        <div className="grid grid-cols-2 gap-2">
                            {imgs.map(({ url }) => {
                                const isSelected = Array.isArray(gen?.selectedUrls)
                                    ? gen.selectedUrls.includes(url)
                                    : false;

                                return (
                                    <div key={url} className={`rounded border overflow-hidden ${isSelected ? "ring-2 ring-blue-500" : ""}`}>
                                        <img src={url} alt="" className="w-full h-24 object-cover" />
                                        <div className="p-2 flex items-center justify-between gap-2">
                                            <button
                                                onClick={() => toggleSelect(url)}
                                                className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                                                disabled={isPending}
                                            >
                                                {isSelected ? "Unselect" : "Select"}
                                            </button>
                                            <button
                                                onClick={() => deleteImage(url)}
                                                className="text-xs border rounded px-2 py-1 hover:bg-red-50"
                                                disabled={isPending}
                                                title="Delete this image from the library and unassign it from any slots"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs opacity-60">
                                Selected: {Array.isArray(gen?.selectedUrls) ? gen.selectedUrls.length : 0}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={clearSelection}
                                    className="text-xs border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-60"
                                    disabled={isPending}
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={bulkAssign}
                                    className="text-xs border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-60"
                                    disabled={isPending}
                                    title="Assign selection in order: front, back, side, threeQuarter, top, bottom"
                                >
                                    Assign All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* designated slots */}
                    <div className="space-y-2">
                        <div className="font-medium">Designated Slots</div>
                        <div className="grid grid-cols-2 gap-2">
                            {SLOTS.map((slot) => {
                                const u = designated?.[slot]?.url ?? designated?.[slot]?.src;
                                return (
                                    <div key={slot} className="rounded border p-2 space-y-2">
                                        <div className="text-xs opacity-70 capitalize">{slot}</div>
                                        <div className="h-24 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                                            {u ? <img src={u} alt={slot} className="w-full h-full object-cover" /> : <span className="text-xs opacity-50">empty</span>}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                className="flex-1 border rounded px-2 py-1 text-xs"
                                                defaultValue=""
                                                onChange={(e) => {
                                                    const url = e.target.value;
                                                    if (!url) return;
                                                    assignSlot(slot, url);
                                                    e.currentTarget.selectedIndex = 0;
                                                }}
                                                disabled={isPending || imgs.length === 0}
                                            >
                                                <option value="" disabled>Assign from images…</option>
                                                {imgs.map(({ url }) => (
                                                    <option key={url} value={url}>{url}</option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => assignSlotFromSel(slot)}
                                                disabled={isPending}
                                                className="text-xs border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-60"
                                                title="Assign first selected image to this slot"
                                            >
                                                From Sel
                                            </button>

                                            <button
                                                onClick={() => unassignSlot(slot)}
                                                disabled={isPending}
                                                className="text-xs border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-60"
                                                title="Unassign image from this slot"
                                            >
                                                Unassign
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const urlToDelete = u;
                                                    if (!urlToDelete) return;
                                                    deleteImage(urlToDelete);
                                                }}
                                                disabled={isPending || !u}
                                                className="text-xs border rounded px-2 py-1 hover:bg-red-50 disabled:opacity-60"
                                                title="Delete this image from the library and unassign it from all slots"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Meshy */}
                    <div className="space-y-2">
                        <div className="font-medium">3D</div>
                        <button
                            onClick={generate3D}
                            disabled={isPending}
                            className="rounded px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                        >
                            Generate 3D (Meshy)
                        </button>
                    </div>

                    {/* debug snapshot (optional) */}
                    <pre className="text-[11px] bg-gray-50 rounded p-3 overflow-auto">
{JSON.stringify(gen, null, 2)}
          </pre>
                </div>
            </aside>
        </div>
    );
}
