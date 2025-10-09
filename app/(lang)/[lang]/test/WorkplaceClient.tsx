"use client";

import { useState, useTransition } from "react";
import { actionSetPrompt, actionPostMessage, actionRecordVersion } from "./actions";
import type { Message } from "@/app/(lang)/[lang]/test/classes/interface";

type Props = {
    initialHeadId: string;
    initialMessages: Message[];
    initialGenerator: any;
};

export default function WorkplaceClient({ initialHeadId, initialMessages, initialGenerator }: Props) {
    const [headId, setHeadId] = useState<string>(initialHeadId);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [generator, setGenerator] = useState<any>(initialGenerator);
    const [prompt, setPrompt] = useState<string>(initialGenerator?.textPrompt ?? "");
    const [text, setText] = useState<string>("");

    const [isPending, startTransition] = useTransition();

    const doSetPrompt = () => {
        startTransition(async () => {
            const { headId: h, messages: m, generator: g } = await actionSetPrompt(headId, prompt);
            setHeadId(h); setMessages(m); setGenerator(g);
        });
    };

    const doPostMsg = () => {
        if (!text.trim()) return;
        startTransition(async () => {
            const { headId: h, messages: m, generator: g } = await actionPostMessage(headId, text.trim());
            setHeadId(h); setMessages(m); setGenerator(g);
            setText("");
        });
    };

    const doRecordVersion = () => {
        startTransition(async () => {
            const { headId: h, messages: m, generator: g } = await actionRecordVersion(headId);
            setHeadId(h); setMessages(m); setGenerator(g);
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Workplace Demo</h1>
                <div className="text-sm opacity-70">
                    headId: <span className="font-mono">{headId}</span>
                </div>
            </header>

            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Generator</h2>
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

                <pre className="mt-3 text-xs bg-gray-50 rounded-lg p-3 overflow-auto">
{JSON.stringify(generator, null, 2)}
        </pre>
            </section>

            <section className="rounded-2xl border p-4 space-y-3">
                <h2 className="font-medium">Chat</h2>
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
                    <button
                        onClick={doRecordVersion}
                        disabled={isPending}
                        className="rounded-lg px-4 py-2 border hover:bg-gray-50 disabled:opacity-60"
                    >
                        Record Version
                    </button>
                </div>

                <div className="space-y-2">
                    {messages.length === 0 ? (
                        <div className="text-sm opacity-60">No messages yet.</div>
                    ) : (
                        messages.map((m) => (
                            <div key={m.id} className="rounded-xl border p-3">
                                <div className="text-xs opacity-60">{m.role} • {new Date(m.createdAt).toLocaleString()}</div>
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
