// app/(lang)/[lang]/projects/[projectId]/components/MessagesPanel.tsx
'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { Send, User, Bot, Settings, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import type { Message,  } from '../../types';
import useMessage from '@/app/(lang)/[lang]/ai/hooks/useMessage';
import useModels from '@/app/(lang)/[lang]/ai/hooks/useModels';
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import ModelGallery from "../GeneratorPanel/ModelGallery"


export function Messenger() {
    // Redux messages composer + store
    const { messages: storeMessages, msgText, setMsgText, addMsg, setMsgRole } = useMessage();
    const { models } = useModels(); // live models from Redux (streaming)
    const {headId} = useCommit()

    // default role: user
    useState(() => setMsgRole('user' as const));

    // local UI state
    const [sending, setSending] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // expand/collapse for action payloads (placeholder to match old UI)
    const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

    // scroll stabilization (same as before)
    const scrollRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number>(0);
    const userAtBottomRef = useRef<boolean>(true);
    const nearBottom = (el: HTMLElement) => el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        userAtBottomRef.current = nearBottom(el);
    };

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const prevHeight = prevScrollHeightRef.current;
        const nextHeight = el.scrollHeight;

        if (!userAtBottomRef.current && prevHeight > 0) {
            const delta = nextHeight - prevHeight;
            if (delta !== 0) el.scrollTop += delta;
        }
        if (userAtBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
        prevScrollHeightRef.current = nextHeight;
    }, [storeMessages, models, headId]);

    // helpers
    const formatTime = (timestamp: string) =>
        new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const getRoleIcon = (role: string) =>
        role === 'user' ? <User className="w-4 h-4" /> :
            role === 'assistant' ? <Bot className="w-4 h-4" /> :
                role === 'system' ? <Settings className="w-4 h-4" /> :
                    <div className="w-4 h-4 rounded-full bg-gray-400" />;

    const getRoleColor = (role: string) =>
        role === 'user' ? 'text-blue-600 bg-blue-50'
            : role === 'assistant' ? 'text-green-600 bg-green-50'
                : role === 'system' ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 bg-gray-50';

    const pickModelUrl = (m: any): string | undefined =>
        m?.modelUrls?.glb || m?.modelUrls?.fbx || m?.modelUrls?.obj || m?.modelUrls?.usdz;

    // send (Redux-only)
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = (msgText ?? '').trim();
        if (!text || sending) return;

        if (!headId) {                   // keep your commit guard if desired
            setErrorText('Select a commit first — messages branch from the selected commit.');
            return;
        }

        setSending(true);
        setErrorText(null);

        // immediate add to Redux
        addMsg();

        // reset composer height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        // no server call; just clear sending quickly
        setTimeout(() => setSending(false), 100);
    };

    // Enter sends, Shift+Enter newline
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as unknown as React.FormEvent);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsgText(e.target.value);
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };

    const toggleActionExpanded = (messageId: string) => {
        const next = new Set(expandedActions);
        next.has(messageId) ? next.delete(messageId) : next.add(messageId);
        setExpandedActions(next);
    };

    return (
        <div className="bg-white xl:border-r border-gray-200 xl:h-screen flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <h2 className="text-lg font-semibold text-gray-900">Messages & Logs</h2>
            </div>
            <ModelGallery/>
            {/*/!* Models (Redux) *!/*/}
            {/*<div className="px-4 pt-4">*/}
            {/*    {Array.isArray(models) && models.length > 0 && (*/}
            {/*        <div className="mb-4">*/}
            {/*            <div className="flex items-center justify-between mb-2">*/}
            {/*                <h3 className="text-sm font-semibold text-gray-900">Generated 3D Models</h3>*/}
            {/*                <span className="text-xs text-gray-500">{models.length}</span>*/}
            {/*            </div>*/}
            {/*            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">*/}
            {/*                {models.map((m: any) => {*/}
            {/*                    const url = pickModelUrl(m);*/}
            {/*                    const created = m?.createdAt ? new Date(m.createdAt).toLocaleString() : '';*/}
            {/*                    return (*/}
            {/*                        <div key={m?.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">*/}
            {/*                            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">*/}
            {/*                                {m?.thumbnailUrl ? (*/}
            {/*                                    // eslint-disable-next-line @next/next/no-img-element*/}
            {/*                                    <img*/}
            {/*                                        src={m.thumbnailUrl}*/}
            {/*                                        alt="Model thumbnail"*/}
            {/*                                        className="w-full h-full object-cover"*/}
            {/*                                        loading="lazy"*/}
            {/*                                        decoding="async"*/}
            {/*                                    />*/}
            {/*                                ) : (*/}
            {/*                                    <div className="text-xs text-gray-400">No thumbnail</div>*/}
            {/*                                )}*/}
            {/*                            </div>*/}
            {/*                            <div className="p-3 space-y-2">*/}
            {/*                                <div className="flex flex-wrap items-center gap-2">*/}
            {/*                                    {m?.provider && (*/}
            {/*                                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">*/}
            {/*                {m.provider}*/}
            {/*              </span>*/}
            {/*                                    )}*/}
            {/*                                    {m?.kind && (*/}
            {/*                                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">*/}
            {/*                {m.kind}*/}
            {/*              </span>*/}
            {/*                                    )}*/}
            {/*                                    {m?.stage && (*/}
            {/*                                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">*/}
            {/*                {m.stage}*/}
            {/*              </span>*/}
            {/*                                    )}*/}
            {/*                                </div>*/}
            {/*                                {created && <div className="text-xs text-gray-500">{created}</div>}*/}
            {/*                                <div className="flex gap-2">*/}
            {/*                                    {url && (*/}
            {/*                                        <a*/}
            {/*                                            href={url}*/}
            {/*                                            target="_blank"*/}
            {/*                                            rel="noopener noreferrer"*/}
            {/*                                            className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition"*/}
            {/*                                        >*/}
            {/*                                            Open 3D*/}
            {/*                                        </a>*/}
            {/*                                    )}*/}
            {/*                                    {m?.modelUrls?.glb && (*/}
            {/*                                        <a*/}
            {/*                                            href={m.modelUrls.glb}*/}
            {/*                                            download*/}
            {/*                                            className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"*/}
            {/*                                        >*/}
            {/*                                            GLB*/}
            {/*                                        </a>*/}
            {/*                                    )}*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}

            {/* Error banners */}
            {errorText && (
                <div className="mx-4 mb-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {errorText}
                </div>
            )}
            {!headId && (
                <div className="mx-4 mb-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Select a commit to make new messages branch from that snapshot.
                </div>
            )}

            {/* Messages List */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-auto p-4 space-y-4"
                style={{ overflowAnchor: 'none' }}
            >
                {storeMessages.map((message:Message) => (
                    <div key={message.id} className="group">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getRoleColor(message.role)}`}>
                                {getRoleIcon(message.role)}
                                <span className="font-medium capitalize">{message.role}</span>
                            </div>
                            <span>•</span>
                            <span>{formatTime(message.createdAt)}</span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-2">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                {message.content}
                            </p>
                        </div>

                        {/* action panel placeholder retained (no server action in new system) */}
                        {(message as any).action && (
                            <div className="ml-4">
                                <button
                                    onClick={() => {
                                        const next = new Set(expandedActions);
                                        next.has(message.id) ? next.delete(message.id) : next.add(message.id);
                                        setExpandedActions(next);
                                    }}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {expandedActions.has(message.id) ? (
                                        <ChevronDown className="w-3 h-3" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3" />
                                    )}
                                    Action: {(message as any).action.type}
                                </button>

                                {expandedActions.has(message.id) && (
                                    <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                    <pre className="text-xs text-gray-300 overflow-auto">
                      {JSON.stringify((message as any).action, null, 2)}
                    </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {storeMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Bot className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs text-gray-400 mt-1">Start by describing what you'd like to create</p>
                    </div>
                )}
            </div>

            {/* Composer */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="space-y-3">
                    <div className="relative">
            <textarea
                ref={textareaRef}
                value={msgText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe your 3D project or ask a question..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={sending}
                rows={1}
            />
                        <button
                            type="submit"
                            disabled={!msgText.trim() || sending || !headId}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={!headId ? 'Select a commit first' : 'Send'}
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Enter to send • Shift+Enter for newline</span>
                        <span>{(msgText ?? '').length}/1000</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
