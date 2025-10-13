"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import {
    addImages, removeImage, toggleSelect, setMode, updateText,
    addMessage, clearMessages, removeSelectedImages, setSelected, replaceWithSnapshot,
} from "./store/slices/generatorSlice";
import { useCreateCommitMutation } from "./services/api";
import {fromSnapshot, toSnapshot} from "./libs/snapshots";
import { persistor } from "./store";
import {setHead} from "@/app/(lang)/[lang]/ai/store/slices/commitsSlice";
import {CommitButton} from "@/app/(lang)/[lang]/ai/components/Commit/CommitButton";
import {Commit} from "@/app/(lang)/[lang]/ai/components/Commit";
import {ImageGallery} from "@/app/(lang)/[lang]/ai/components/ImageGallery";
import {ModelsPanel} from "@/app/(lang)/[lang]/ai/components/ModelsPanel";


type Props ={
    projectId: string,
}
export default function GeneratorPlayground(props:Props): JSX.Element {
    const projectId = props.projectId ?? null;
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const gen = useSelector((s: RootState) => (s as any)?.generator) ?? {
        type: 'text', textPrompt: '', images: [], selected: [],
        approvalSet: [], dirtySinceLastModel: false, messages: [],
    };
    const commitsState = useSelector((s: RootState) => (s as any)?.commits) ?? { entities: {}, headId: null };
    const commits = Object.values(commitsState.entities ?? {});
    const headId = commitsState.headId ?? null;

    const [createCommit, { isLoading: savingCommit }] = useCreateCommitMutation();

    // ---------- uploads ----------
    const onPickFiles = useCallback(() => fileInputRef.current?.click(), []);
    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files) return;
        for (const file of Array.from(files)) {
            const tempId = crypto.randomUUID();
            const tempUrl = URL.createObjectURL(file);
            // optimistic add
            dispatch(addImages([{ id: tempId, url: tempUrl, meta: { name: file.name, size: file.size, type: file.type } }]));
            try {
                // simple dev upload — store to /public/uploads
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/uploads/presign', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('upload failed');
                const data = await res.json();
                // swap blob -> public url, keeping same id
                dispatch(addImages([{ id: tempId, url: data.url, key: data.key } as any]));
            } catch {
                dispatch(removeImage(tempId));
            }
        }
    }, [dispatch]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // ---------- commit ----------
    const onCommit = useCallback(async () => {
        const snapshot = toSnapshot(gen as any);
        await createCommit({
            projectId: projectId,
            parentId: headId ?? null,
            snapshot,
            message: `Checkpoint: ${new Date().toLocaleString()}`,
        });
    }, [createCommit, gen, headId]);

    // ---------- tools ----------
    const selectAll = () => dispatch(setSelected(gen.images.map((i: any) => i.id)));
    const clearSel = () => dispatch(setSelected([]));
    const removeSelected = () => dispatch(removeSelectedImages());
    const purgePersist = async () => { await persistor.purge(); location.reload(); };

    // ---------- messages ----------
    const [msgRole, setMsgRole] = useState<'user' | 'assistant' | 'system'>('user');
    const [msgText, setMsgText] = useState('');
    const addMsg = () => {
        if (!msgText.trim()) return;
        const id = crypto.randomUUID();
        // const attachments = (gen.selected ?? []).map((imageId: string) => ({ type: 'image', imageId })) as any;
        dispatch(addMessage({
            id, role: msgRole, content: msgText.trim(),
            createdAt: new Date().toISOString(),
        }));
        setMsgText('');
    };

    const selectedSet = useMemo(() => new Set(gen.selected ?? []), [gen.selected]);
    const images = gen.images ?? [];
    const selectedCount = (gen.selected ?? []).length;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header & Tools */}
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Generator Playground</h1>
                <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50"
                            onClick={() => dispatch(setMode(gen.type === 'text' ? 'image' : 'text'))}>
                        Mode: {gen.type}
                    </button>
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={onPickFiles}>
                        Upload Images
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                           onChange={(e) => handleFiles(e.target.files)} />
                    <button onClick={onCommit} disabled={savingCommit}
                            className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white disabled:opacity-50">
                        {savingCommit ? 'Saving…' : 'Commit Snapshot'}
                    </button>

                    {/* Playground tools */}
                    <span className="mx-2 h-6 w-px bg-gray-200 self-center" />
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={selectAll}>
                        Select All
                    </button>
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={clearSel}>
                        Clear Selection
                    </button>
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={removeSelected}>
                        Remove Selected
                    </button>
                    <button className="px-3 py-2 rounded-xl shadow text-sm border text-red-600 hover:bg-red-50" onClick={purgePersist}>
                        Purge Persist
                    </button>
                </div>
            </header>

            {/* Text prompt */}
            <div className="bg-white rounded-2xl shadow p-4 border">
                <label className="block text-sm text-gray-600 mb-2">Text Prompt</label>
                <textarea value={gen.textPrompt} onChange={(e) => dispatch(updateText(e.target.value))}
                          placeholder="Describe your idea…" className="w-full min-h-[90px] rounded-xl border p-3" />
            </div>

            {/* Dropzone + Images */}
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)} onDrop={onDrop}
                 className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300'}`}>
                Drag & drop images here, or use the Upload button above.
            </div>

            <ImageGallery/>

            {/* Messages composer */}
            <section className="bg-white rounded-2xl shadow p-4 border space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium">Messages ({gen.messages?.length ?? 0})</h2>
                    <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={() => dispatch(clearMessages())}>
                        Clear Messages
                    </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                        value={msgRole}
                        onChange={(e) => setMsgRole(e.target.value as any)}
                        className="sm:w-40 rounded-lg border p-2 text-sm"
                    >
                        <option value="user">user</option>
                        <option value="assistant">assistant</option>
                        <option value="system">system</option>
                    </select>

                    <textarea
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        placeholder="Write a message…"
                        className="flex-1 min-h-[70px] rounded-lg border p-2 text-sm"
                    />

                    <button onClick={addMsg}
                            className="px-3 py-2 rounded-xl shadow text-sm border bg-black text-white self-start">
                        Add Message
                    </button>
                </div>

                {/* Attached selection preview */}
                {selectedCount > 0 && (
                    <div className="text-xs text-gray-600">
                        Will attach {selectedCount} selected image{selectedCount > 1 ? 's' : ''} to this message.
                    </div>
                )}

                {/* Messages list */}
                {gen.messages?.length ? (
                    <ul className="divide-y">
                        {gen.messages.map((m: any) => (
                            <li key={m.id} className="py-2 flex gap-3">
                                <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-gray-100 self-start">{m.role}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                                    {m.attachments?.length ? (
                                        <div className="mt-1 flex gap-2 flex-wrap">
                                            {m.attachments.filter((a: any) => a.type === 'image').map((a: any) => {
                                                const img = images.find((i: any) => i.id === a.imageId);
                                                if (!img) return null;
                                                return (
                                                    <img key={a.imageId} src={img.url} alt="att" className="w-10 h-10 object-cover rounded" />
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                    <div className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                                </div>
                                <button onClick={() => dispatch({ type: 'generator/removeMessage', payload: m.id })}
                                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50 self-start">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-sm text-gray-500">No messages yet.</div>
                )}
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-2xl shadow p-4 border">
                <h2 className="font-medium mb-3">Commit Timeline</h2>

                {(!commits || commits.length === 0) ? (
                    <div className="text-sm text-gray-500">No commits yet. Create one above.</div>
                ) : (
                    <ul className="space-y-2">
                        {Object.values(commits)
                            .filter(Boolean) // <- guard against undefined holes
                            .map((c: any) => (
                                <Commit key={c.id} type={"li"} commit={c} headId={headId}/>
                            ))}
                    </ul>
                )}
            </section>
            <ModelsPanel/>

            {/* Debug */}
            <details className="bg-white rounded-2xl shadow p-4 border" open>
                <summary className="cursor-pointer font-medium">Debug: Generator JSON</summary>
                <pre className="text-xs overflow-auto mt-2 p-3 bg-gray-50 rounded-xl border">
{JSON.stringify(gen, null, 2)}
        </pre>
            </details>
        </div>
    );
}
