// @flow
import * as React from 'react';
import useMessage from "@/app/(lang)/[lang]/ai/hooks/useMessage";

type Props = {

};

export function Messanger(props: Props) {
    const {addMsg,setMsgText,msgText,msgRole,setMsgRole,clearMessage,messages,removeMessageById}=useMessage()
    return (
        <section className="bg-white rounded-2xl shadow p-4 border space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Messages ({messages?.length ?? 0})</h2>
                <button className="px-3 py-2 rounded-xl shadow text-sm border hover:bg-gray-50" onClick={clearMessage}>
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


            {/* Messages list */}
            {messages?.length ? (
                <ul className="divide-y">
                    {messages.map((m: any) => (
                        <li key={m.id} className="py-2 flex gap-3">
                            <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded bg-gray-100 self-start">{m.role}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                                <div className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                            </div>
                            <button onClick={() => removeMessageById(m.id)}
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
    );
};