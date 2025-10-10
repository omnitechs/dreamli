// app/(lang)/[lang]/test/workplace/WorkplaceClient.tsx
"use client";

import { useState, useTransition } from "react";
import {
    actionSetPrompt,
    actionPostMessage,
    actionAddImages,
    actionSelectImage,
    actionUnselectImage,
    actionClearSelection,
    actionAssignSlot,
    actionClearSlot, // kept for backward-compat if you still use it
    actionGenerate3D,
    actionUnassignSlot, // new: clearer naming
    actionDeleteImage,  // new: delete from library + unassign everywhere
    actionSetMode,
    actionAssignSlotFromSelection,
    actionBulkAssignFromSelection,
} from "./actions";
import type { Message } from "@/app/(lang)/[lang]/projects/classes/interface";

type Props = {
    initialHeadId: string;
    initialMessages: Message[];
    initialGenerator: any;
};

const SLOTS: Array<"front" | "back" | "side" | "threeQuarter" | "top" | "bottom"> = [
    "front",
    "back",
    "side",
    "threeQuarter",
    "top",
    "bottom",
];

export default function WorkplaceClient({ initialHeadId, initialMessages, initialGenerator }: Props) {
    const [headId, setHeadId] = useState<string>(initialHeadId);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [generator, setGenerator] = useState<any>(initialGenerator);
    const [prompt, setPrompt] = useState<string>(initialGenerator?.textPrompt ?? "");
    const [text, setText] = useState<string>("");
    const [mode, setMode] = useState<"text" | "image">(initialGenerator?.type ?? "text");
    const [isPending, startTransition] = useTransition();

    const refresh = (r: any) => {
        setHeadId(r.headId);
        setMessages(r.messages);
        setGenerator(r.generator);
    };

    // Slot ops (clear naming)
    const unassignSlot = (slot: (typeof SLOTS)[number]) => {
        startTransition(async () => refresh(await actionUnassignSlot(headId, slot)));
    };

    const deleteImage = (url: string) => {
        startTransition(async () => refresh(await actionDeleteImage(headId, url)));
    };

    // Prompt & mode
    const doSetPrompt = () => {
        startTransition(async () => refresh(await actionSetPrompt(headId, prompt)));
    };
    const doSetMode = (m: "text" | "image") => {
        setMode(m);
        startTransition(async () => refresh(await actionSetMode(headId, m)));
    };

    // Chat
    const doPostMsg = () => {
        if (!text.trim()) return;
        startTransition(async () => {
            refresh(await actionPostMessage(headId, text.trim()));
            setText("");
        });
    };

    // Files / URLs
    const onUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        form.reset(); // avoid pooled event issue
        startTransition(async () => {
            const r = await actionAddImages(headId, fd);
            refresh(r);
        });
    };

    // Selection toggle
    const toggleSelect = (url: string) => {
        const isSelected = Array.isArray(generator?.selectedUrls)
            ? generator.selectedUrls.includes(url)
            : false;

        startTransition(async () => {
            const r = isSelected ? await actionUnselectImage(headId, url) : await actionSelectImage(headId, url);
            refresh(r);
        });
    };

    // Slot assign helpers
    const assignSlot = (slot: (typeof SLOTS)[number], url: string) => {
        startTransition(async () => refresh(await actionAssignSlot(headId, slot, url)));
    };
    const assignSlotFromSelection = (slot: (typeof SLOTS)[number]) => {
        startTransition(async () => refresh(await actionAssignSlotFromSelection(headId, slot)));
    };
    const bulkAssignFromSelection = () => {
        startTransition(async () => refresh(await actionBulkAssignFromSelection(headId)));
    };

    // (optional legacy) Clear slot
    const clearSlot = (slot: (typeof SLOTS)[number]) => {
        startTransition(async () => refresh(await actionClearSlot(headId, slot)));
    };

    // Generate 3D
    const doGenerate3D = () => {
        startTransition(async () => {
            const r = await actionGenerate3D(headId);
            refresh(r);
            alert(`Task ${r.taskId} finished (${r.status}). Model URL: ${r.modelUrl}`);
        });
    };

    const imgs: Array<{ url: string }> = (generator?.images ?? [])
        .map((i: any) => ({ url: i.url ?? i.src }))
        .filter((x: any) => !!x.url);

    const designated = generator?.designated ?? {};

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Workplace — 3D Builder</h1>
                <div className="text-xs opacity-70 font-mono">headId: {headId}</div>
            </header>

            {/* Mode & Prompt */}
            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Mode & Prompt</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => doSetMode("text")}
                        className={`rounded-lg px-3 py-2 border ${mode === "text" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                        disabled={isPending}
                    >
                        Text mode
                    </button>
                    <button
                        onClick={() => doSetMode("image")}
                        className={`rounded-lg px-3 py-2 border ${mode === "image" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                        disabled={isPending}
                    >
                        Image mode
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm block mb-1">Prompt</label>
                        <input
                            className="w-full rounded-lg border px-3 py-2"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type a prompt…"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={doSetPrompt}
                            disabled={isPending}
                            className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                        >
                            Save Prompt (commit)
                        </button>
                    </div>
                </div>

                <pre className="mt-3 text-[11px] bg-gray-50 rounded-lg p-3 overflow-auto">
{JSON.stringify(generator, null, 2)}
        </pre>
            </section>

            {/* Add Images */}
            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Add Images</h2>
                <form onSubmit={onUploadSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input name="files" type="file" accept="image/*" multiple className="border rounded-lg px-3 py-2" />
                    <input name="imageUrl" type="url" placeholder="https://…" className="flex-1 border rounded-lg px-3 py-2" />
                    <button type="submit" className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60" disabled={isPending}>
                        Add
                    </button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {imgs.map(({ url }) => {
                        const isSelected = Array.isArray(generator?.selectedUrls)
                            ? generator.selectedUrls.includes(url)
                            : false;

                        return (
                            <div key={url} className={`rounded-xl border overflow-hidden ${isSelected ? "ring-2 ring-blue-500" : ""}`}>
                                <img src={url} alt="" className="w-full h-32 object-cover" />
                                <div className="p-2 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => toggleSelect(url)}
                                        className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                                        disabled={isPending}
                                    >
                                        {isSelected ? "Unselect" : "Select"}
                                    </button>

                                    {/* Delete image entirely (from library + unassign everywhere) */}
                                    <button
                                        onClick={() => deleteImage(url)}
                                        className="text-xs border rounded px-2 py-1 hover:bg-red-50"
                                        disabled={isPending}
                                        title="Delete this image from the library and unassign it from any slots"
                                    >
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Designated Slots */}
            <section className="rounded-2xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium">Designated Slots</h2>
                    <div className="flex items-center gap-2 text-xs">
            <span className="opacity-60">
              Selected: {Array.isArray(generator?.selectedUrls) ? generator.selectedUrls.length : 0}
            </span>
                        <button
                            onClick={() => startTransition(async () => refresh(await actionClearSelection(headId)))}
                            className="border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-60"
                            disabled={isPending}
                            title="Clear current selection"
                        >
                            Clear Selection
                        </button>
                        <button
                            onClick={bulkAssignFromSelection}
                            disabled={isPending}
                            className="border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-60"
                            title="Assign selection to slots in order: front, back, side, threeQuarter, top, bottom"
                        >
                            Assign All From Selection
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SLOTS.map((slot) => {
                        const u = designated?.[slot]?.url ?? designated?.[slot]?.src;

                        return (
                            <div key={slot} className="rounded-xl border p-3 space-y-2">
                                <div className="text-xs opacity-70 capitalize">{slot}</div>

                                <div className="mt-1 h-28 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                                    {u ? (
                                        <img src={u} alt={slot} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs opacity-50">empty</span>
                                    )}
                                </div>

                                {/* Per-slot controls */}
                                <div className="flex items-center gap-2">
                                    {/* Assign from dropdown of all images */}
                                    <select
                                        className="flex-1 border rounded px-2 py-1 text-xs"
                                        defaultValue=""
                                        onChange={(e) => {
                                            const url = e.target.value;
                                            if (!url) return;
                                            assignSlot(slot, url);
                                            // reset to placeholder after assign to avoid confusion
                                            e.currentTarget.selectedIndex = 0;
                                        }}
                                        disabled={isPending || imgs.length === 0}
                                    >
                                        <option value="" disabled>
                                            Assign from images…
                                        </option>
                                        {imgs.map(({ url }) => (
                                            <option key={url} value={url}>
                                                {url}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Assign first selected to this slot */}
                                    <button
                                        onClick={() => assignSlotFromSelection(slot)}
                                        disabled={isPending}
                                        className="text-xs border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-60"
                                        title="Assign the first selected image to this slot"
                                    >
                                        From Selected
                                    </button>

                                    {/* Unassign only (keep image in library) */}
                                    <button
                                        onClick={() => unassignSlot(slot)}
                                        disabled={isPending}
                                        className="text-xs border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-60"
                                        title="Unassign the image from this slot (keeps image)"
                                    >
                                        Unassign
                                    </button>

                                    {/* Delete the underlying image entirely */}
                                    <button
                                        onClick={() => {
                                            const urlToDelete = designated?.[slot]?.url ?? designated?.[slot]?.src;
                                            if (!urlToDelete) return;
                                            deleteImage(urlToDelete);
                                        }}
                                        disabled={isPending || !designated?.[slot]}
                                        className="text-xs border rounded px-2 py-1 hover:bg-red-50 disabled:opacity-60"
                                        title="Delete this image from the library and unassign it from all slots"
                                    >
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Build 3D */}
            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Build 3D</h2>
                <div className="flex gap-2">
                    <button
                        onClick={doGenerate3D}
                        disabled={isPending}
                        className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                    >
                        Generate 3D (Meshy)
                    </button>
                </div>
            </section>

            {/* Chat / Logs */}
            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Chat / Logs</h2>
                <div className="flex gap-2">
                    <input
                        className="flex-1 rounded-lg border px-3 py-2"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a message…"
                    />
                    <button
                        onClick={doPostMsg}
                        disabled={isPending}
                        className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                    >
                        Send (commit)
                    </button>
                </div>

                <div className="space-y-2">
                    {messages.length === 0 ? (
                        <div className="text-sm opacity-60">No messages yet.</div>
                    ) : (
                        messages.map((m) => (
                            <div key={m.id} className="rounded-xl border p-3">
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
            </section>
        </div>
    );
}
