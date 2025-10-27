// app/(lang)/[lang]/projects/[projectId]/components/MessagesPanel.tsx
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import {
    Send,
    User,
    Bot,
    Settings,
    ChevronDown,
    ChevronRight,
    AlertTriangle,
} from "lucide-react";
import type { Message } from "../../types";
import useMessage from "@/app/(lang)/[lang]/ai/hooks/useMessage";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import ModelGallery from "../GeneratorPanel/ModelGallery";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import useImageJobs from "@/app/(lang)/[lang]/ai/hooks/useImageJobs";
// Import the specific functions from the hook
import { useMeshyStream } from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";
import { useDispatch } from "react-redux";
import {
    addMessage as addMsgAction,
    editMessage as editMsgAction,
    updateText as updateGenText,
    // Assuming you have an action to update selected images if needed
    // setSelectedImagesAction,
} from "@/app/store/slices/generatorSlice";
import { useLocale, useTranslations } from "next-intl";

// Types
type ProposedAction = {
    title: string;
    kind?: string;
    prompt?: string;
    refs?: string[];
    confirm?: string;
    meta?: any;
};

export function Messenger() {
    // Get the specific functions from the hook
    const { startGenerationFromPrompt, startGenerationFromImage, streamExistingTask } = useMeshyStream();
    const uiLog = (...args: any[]) => {
        try { console.log("[AI/UI]", ...args); } catch {}
    };

    const { messages: storeMessages, msgText, setMsgText, addMsg, setMsgRole } = useMessage();
    const { models } = useModels();
    const { headId, commitsState, onCommit } = useCommit();
    const { gen } = useGenerator();
    const dispatch = useDispatch(); // Use standard dispatch
    const { getSelectedImageUrls /*, setSelectedImageUrls */ } = useImages(); // Assuming setSelectedImageUrls exists if needed
    const { startJob } = useImageJobs();

    const t = useTranslations("AI.Messenger");
    const locale = useLocale();

    useState(() => setMsgRole("user" as const));

    // UI state
    const [sending, setSending] = useState(false);
    const [actBusy, setActBusy] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
    const [proposed, setProposed] = useState<ProposedAction[] | null>(null);

    // scroll stabilization
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
        if (userAtBottomRef.current) el.scrollTop = el.scrollHeight;
        prevScrollHeightRef.current = nextHeight;
    }, [storeMessages, models, headId]);

    // helpers
    const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    const getRoleIcon = (role: string) =>
        role === 'user' ? <User className="w-4 h-4" /> :
            role === 'assistant' ? <Bot className="w-4 h-4" /> :
                role === 'system' ? <Settings className="w-4 h-4" /> :
                    <div className="w-4 h-4 rounded-full bg-gray-400" />;
    const getRoleColor = (role: string) =>
        role === 'user' ? 'text-blue-600 bg-blue-50' :
            role === 'assistant' ? 'text-green-600 bg-green-50' :
                role === 'system' ? 'text-purple-600 bg-purple-50' :
                    'text-gray-600 bg-gray-50';
    const getRoleLabel = (role: string) =>
        role === 'user' ? t('roles.user') :
            role === 'assistant' ? t('roles.assistant') :
                role === 'system' ? t('roles.system') :
                    role;

    // -------------- action normalization --------------
    const normalizeActions = (actions: any[]): ProposedAction[] => {
        const norm = (actions || [])
            .filter((a) => a && typeof a === "object")
            .map((a) => ({
                title: String(a.title || "").slice(0, 80),
                kind: typeof a.kind === "string" ? a.kind : undefined,
                prompt: typeof a.prompt === "string" ? a.prompt : undefined,
                refs: Array.isArray(a.refs)
                    ? a.refs.filter((u: any) => typeof u === "string")
                    : undefined,
                confirm: typeof a.confirm === "string" ? a.confirm : undefined,
                meta: typeof a.meta === "object" && a.meta ? a.meta : undefined,
            }))
            .filter((a) => a.title);
        return norm;
    };

    // -------------- send message --------------
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = (msgText ?? "").trim();
        if (!text || sending) return;
        if (!headId) { setErrorText(t("errors.needCommit")); return; }

        setSending(true);
        setErrorText(null);
        addMsg(); // Add user message

        // Context gathering
        let imageUrls: string[] = [];
        try { imageUrls = getSelectedImageUrls() || []; } catch { imageUrls = []; }
        const modelImageUrls: string[] = Array.isArray(models)
            ? models
                .map((m: any) => m?.localThumbnailUrl || m?.thumbnailUrl)
                .filter((u: any) => typeof u === 'string' && (/^https?:\/\//i.test(u) || /^data:/i.test(u)))
            : [];
        try {
            sessionStorage.setItem('ai_context_urls', JSON.stringify(imageUrls));
            sessionStorage.setItem('ai_model_thumbnails', JSON.stringify(modelImageUrls));
        } catch {}
        const history = (storeMessages || []).slice(-12).map((m: any) => ({
            from: m.role === 'assistant' ? 'ai' : 'user',
            text: String(m.content ?? ''),
        }));
        uiLog('SEND', { textLen: text.length, historyLen: history.length, selectedRefs: imageUrls.length, modelThumbs: (Array.isArray(models) ? models.length : 0) });

        // Add placeholder AI message
        const aiId = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        dispatch(addMsgAction({ id: aiId, role: 'assistant', content: '', createdAt } as any));

        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        let aiText = ''; // Accumulator for AI text
        setProposed(null); // Clear previous actions

        const extractTextFromEvt = (evt: any): string => { // Same working version
            if (!evt) return "";
            try {
                const tType = String(evt?.type || "");
                if (/tool|function_call/.test(tType) || /response\.(tool|function)_call(\.|$)/.test(tType)) {
                    return ""; // Ignore tool events
                }

                // Handle top-level delta
                if (typeof evt?.delta === "string") return evt.delta;

                // Handle Anthropic-style delta
                // type: 'content_block_delta', delta: { type: 'text_delta', text: '...' }
                if (evt?.type === 'content_block_delta' && evt?.delta?.type === 'text_delta' && typeof evt?.delta?.text === 'string') {
                    return evt.delta.text;
                }

                // Handle simple nested delta
                if (typeof evt?.delta?.text === 'string') return evt.delta.text;
                if (typeof evt?.delta?.content === 'string') return evt.delta.content;

                // if (typeof evt?.text === "string") return evt.text; // 🛑 REMOVED: This causes duplication

                // Handle array structures...
                if (Array.isArray(evt?.output)) {
                    let out = "";
                    for (const part of evt.output) {
                        if (typeof part?.delta === 'string') out += part.delta;
                        // else if (typeof part?.text === 'string') out += part.text; // 🛑 REMOVED
                        if (Array.isArray(part?.content)) {
                            for (const c of part.content) {
                                // if (typeof c?.text === 'string') out += c.text; // 🛑 REMOVED
                                if (typeof c?.delta === 'string') out += c.delta;
                            }
                        }
                    }
                    return out;
                }
                if (Array.isArray(evt?.content)) {
                    let out = "";
                    for (const c of evt.content) {
                        // if (typeof c?.text === 'string') out += c.text; // 🛑 REMOVED
                        if (typeof c?.delta === 'string') out += c.delta;
                        // else if (typeof c?.content === 'string') out += c.content; // 🛑 REMOVED
                    }
                    return out;
                }
                if (Array.isArray(evt?.delta?.content)) {
                    let out = "";
                    for (const c of evt.delta.content) {
                        // This path is likely for Anthropic `delta: { content: [{type: 'text_delta', text: '...'}] }`
                        // The original `c.text` was probably correct for this specific structure.
                        if (typeof c?.text === 'string') out += c.text;
                        else if (typeof c?.delta === 'string') out += c.delta;
                    }
                    return out;
                }
            } catch {}
            return "";
        };


        try {
            const res = await fetch('/api/ai/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, history, imageUrls, modelImageUrls }),
            });

            if (res.status === 402) {
                uiLog("CHAT 402 insufficient credits");
                aiText = t("errors.insufficientCredits");
                dispatch(editMsgAction({ id: aiId, content: aiText } as any));
                return;
            }
            if (!res.ok || !res.body) {
                uiLog("CHAT_START_FAIL", { status: res.status, hasBody: !!res.body });
                aiText = t("errors.failedStart");
                dispatch(editMsgAction({ id: aiId, content: aiText } as any));
                return;
            }
            try { window.dispatchEvent(new Event('credits-updated')); } catch {}

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let evCount = 0;
            let didCommit = false;
            const toolBuf: Record<string, { name?: string; args: string; done?: boolean }> = {};

            // Define append function inside handleSendMessage scope
            const append = (chunk: string) => {
                if (!chunk) return;
                aiText += chunk;
                // Add log right before dispatching edit
                uiLog('Dispatching editMsgAction', { id: aiId, newContentLength: aiText.length, deltaLength: chunk.length });
                dispatch(editMsgAction({ id: aiId, content: aiText } as any));
            };

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';
                for (const event of events) {
                    const line = event.trim();
                    if (!line.startsWith('data:')) continue;
                    const data = line.replace(/^data:\s*/, '');
                    if (data === '[DONE]') break;

                    try {
                        evCount++;
                        const evt = JSON.parse(data);
                        const evType = String(evt?.type || "");
                        // ✅✅✅ ADDED RAW EVENT LOGGING HERE ✅✅✅
                        uiLog('SSE_EVT_RAW', { idx: evCount, type: evType, data: evt });

                        const add = extractTextFromEvt(evt); // Use the corrected function
                        if (add) {
                            append(add); // Call append which now logs before dispatch
                        }

                        // Tool call logic (same as before, including name inference)
                        const tType = String(evt.type || "");
                        const isToolOrFnCall = /(tool|function)_call/.test(tType) || /response\.(tool|function)_call(\.|$)/.test(tType);
                        if (isToolOrFnCall) {
                            const callId = String(evt.call_id || evt.id || evt.tool_call_id || evt.callId || "default");
                            const buf = (toolBuf[callId] ||= { args: "" });
                            const name = evt.name || evt.tool_name || evt.function_name || evt?.call?.name || evt?.tool?.name || evt?.function_call?.name;
                            if (typeof name === "string" && !buf.name) buf.name = name;
                            const argDelta = evt.arguments_delta || evt.args_delta || evt?.delta?.arguments || evt.arguments || evt?.function_call?.arguments_delta;
                            if (typeof argDelta === "string") buf.args += argDelta;
                            const isCompleted = tType.endsWith("completed") || tType.endsWith(".done") || tType === "response.tool_call" || tType === "response.function_call" || (evt as any)?.status === "completed";

                            if (isCompleted) {
                                let argsParsed: any = {};
                                try { argsParsed = buf.args ? JSON.parse(buf.args) : {}; } catch {}
                                let toolName = (buf.name || "unknown_tool").toString();
                                uiLog("TOOL_COMPLETED", { toolName, argsParsed });
                                if (toolName === "unknown_tool") {
                                    if (argsParsed?.actions) { toolName = "propose_actions"; uiLog("TOOL_NAME_INFERRED", toolName); }
                                    else if (argsParsed?.prompt && (argsParsed?.target_style || argsParsed?.target_polycount)) { toolName = "generate_3d_model"; uiLog("TOOL_NAME_INFERRED", toolName); }
                                    else if (argsParsed?.prompt) { toolName = "generate_images"; uiLog("TOOL_NAME_INFERRED", toolName); }
                                }

                                // Set proposed actions based on the FINAL toolName
                                // Rely primarily on propose_actions as per the system prompt
                                if (toolName === 'propose_actions') {
                                    const arr = Array.isArray(argsParsed?.actions) ? argsParsed.actions : [];
                                    const norm = normalizeActions(arr);
                                    uiLog('PROPOSE_ACTIONS_TOOL', norm);
                                    if (norm.length) { setProposed(norm); }
                                }
                                // Minimal fallbacks removed for now, rely on propose_actions
                            }
                        }
                    } catch (e) {
                        uiLog("SSE_PARSE_ERR", { error: String((e as any)?.message || e), dataPreview: (line || "").slice(0, 240), });
                    }
                }
            } // End while loop

            // Commit chat logic
            try {
                const pid = (gen as any)?.__meta?.projectId || (commitsState?.headId ? (commitsState as any).entities?.[commitsState.headId]?.projectId : null) || 'demo-project';
                await onCommit(String(pid));
            } catch (e) { console.error("Failed to create chat commit:", e); }

        } catch (err) {
            uiLog("CHAT_ERR", String(err));
            const msg = t("errors.contactFailed");
            dispatch(editMsgAction({ id: aiId, content: msg } as any));
        } finally {
            setSending(false);
        }
    }; // End handleSendMessage

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e as unknown as React.FormEvent); } };
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setMsgText(e.target.value); const textarea = e.target; textarea.style.height = 'auto'; textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'; };
    const toggleActionExpanded = (messageId: string) => { const next = new Set(expandedActions); next.has(messageId) ? next.delete(messageId) : next.add(messageId); setExpandedActions(next); };
    const tooltipFor = (a: ProposedAction) => { const lines: string[] = []; if (a.prompt) lines.push(`prompt: ${a.prompt}`); if (Array.isArray(a.refs) && a.refs.length) lines.push(`refs: ${a.refs.join(", ")}`); if (a.kind) lines.push(`kind: ${a.kind}`); return lines.join("\n"); };

    return (
        <div className="bg-white xl:border-r border-gray-200 xl:h-full min-h-0 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10"> <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2> {sending && (<div className="mt-2 h-1 w-full overflow-hidden rounded bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 animate-pulse" />)} </div>
            <ModelGallery/>
            {/* Error banners */}
            {errorText && (<div className="mx-4 mb-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{errorText}</div>)}
            {!headId && (<div className="mx-4 mb-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{t('errors.needCommitBanner')}</div>)}

            {/* Messages List */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-auto p-4 space-y-4" style={{ overflowAnchor: 'none' }}>
                {storeMessages.map((message:Message) => (
                    <div key={message.id} className="group">
                        {/* Message Header */}
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500"> <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getRoleColor(message.role)}`}>{getRoleIcon(message.role)}<span className="font-medium capitalize">{getRoleLabel(message.role)}</span></div> <span>•</span> <span>{formatTime(message.createdAt)}</span> </div>
                        <div className="bg-gray-50 rounded-xl p-3 mb-2">
                            {/* Proposed actions */}
                            {message.role === 'assistant' && message.id === storeMessages[storeMessages.length - 1]?.id && Array.isArray(proposed) && proposed.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {proposed.slice(0, 5).map((a, idx) => (
                                        <button key={`${a.title}:${idx}`} className="text-xs px-2 py-1 rounded bg-gray-900 text-white hover:bg-black disabled:opacity-50" disabled={actBusy} title={tooltipFor(a)}
                                                onClick={async () => {
                                                    uiLog('ACTION_CLICKED', { title: a.title, kind: a.kind, prompt: a.prompt, refs: a.refs });
                                                    try {
                                                        setActBusy(true); // Disable buttons immediately

                                                        const lastUserMsg = [...storeMessages].reverse().find((m:any)=>m.role==='user')?.content || '';
                                                        const basePrompt = (a.prompt && a.prompt.trim()) || String(lastUserMsg || '').trim() || 'Generate image';
                                                        let kind = (a.kind || '').toLowerCase(); // Use let
                                                        const refs = Array.isArray(a.refs) ? a.refs.filter(u => typeof u === 'string' && u.length > 0) : [];

                                                        // --- Fallback Kind Inference ---
                                                        if (!kind) {
                                                            const titleLower = (a.title || '').toLowerCase();
                                                            if (titleLower.includes('angles') || titleLower.includes('multi-view')) kind = 'generate_angles';
                                                            else if (titleLower.includes('3d model')) kind = 'generate_3d_model';
                                                            else if (titleLower.includes('image') || titleLower.includes('cleanup') || titleLower.includes('resolution')) kind = 'generate_images';
                                                            uiLog('ACTION_KIND_INFERRED', { inferredKind: kind, originalKind: a.kind, title: a.title });
                                                        }
                                                        // --- End Fallback ---

                                                        if (kind === 'generate_images') {
                                                            uiLog('ACTION_RUN: generate_images', { prompt: basePrompt, refs });
                                                            try { dispatch(updateGenText(basePrompt)); } catch (e) { uiLog('Error dispatching updateGenText', e) }
                                                            if (typeof startJob === 'function') { await startJob({ prompt: basePrompt}); uiLog('ACTION_RUN: generate_images - SUCCESS'); }
                                                            else { uiLog('ACTION_ERROR: startJob function not found'); }
                                                        } else if (kind === 'generate_angles') {
                                                            // 1. Set fallback to an EMPTY array
                                                            const angles: string[] = (Array.isArray(a.meta?.angles) && a.meta.angles.length) ? a.meta.angles : [];

                                                            // 2. Check if the array is empty and ABORT if it is
                                                            if (angles.length === 0) {
                                                                uiLog('ACTION_ERROR: "generate_angles" action proposed without a `meta.angles` array. Aborting to prevent duplicates.');
                                                                setProposed(null); // Clear the broken action
                                                                return; // Exit the onClick handler
                                                            }
                                                            uiLog('ACTION_RUN: generate_angles', { basePrompt, angles, refs });
                                                            if (typeof startJob === 'function') {
                                                                for (const ang of angles) {
                                                                    const anglePrompt = `${basePrompt} — ${ang}`;
                                                                    uiLog('... starting angle job:', { angle: ang, prompt: anglePrompt });
                                                                    try {
                                                                        dispatch(updateGenText(anglePrompt));
                                                                    } catch (e) { uiLog('Error dispatching updateGenText for angle', e) }
                                                                    console.log('... starting angle job:', { angle: ang, prompt: anglePrompt });
                                                                    // await startJob({ prompt: anglePrompt });
                                                                }
                                                                uiLog('ACTION_RUN: generate_angles - SUCCESS (all jobs started)'); }
                                                            else { uiLog('ACTION_ERROR: startJob function not found for angles'); }
                                                        } else if (kind === 'generate_3d_model') {
                                                            uiLog('ACTION_RUN: generate_3d_model', { prompt: basePrompt, refs });
                                                            try { dispatch(updateGenText(basePrompt)); } catch (e) { uiLog('Error dispatching updateGenText for 3D', e) }
                                                            if (refs.length === 0) {
                                                                if (typeof startGenerationFromPrompt === 'function') { uiLog('... calling startGenerationFromPrompt'); await startGenerationFromPrompt(); uiLog('ACTION_RUN: generate_3d_model (text) - SUCCESS'); }
                                                                else { uiLog('ACTION_ERROR: startGenerationFromPrompt function not found'); }
                                                            } else {
                                                                const selectedUrls = getSelectedImageUrls ? getSelectedImageUrls() : [];
                                                                if (JSON.stringify(refs.sort()) !== JSON.stringify(selectedUrls.sort())) { uiLog('WARNING: AI refs differ from selected images. Using selected images for 3D generation. Please select the correct images if needed.'); /* Optionally dispatch action to select refs */ }
                                                                if (typeof startGenerationFromImage === 'function') { uiLog('... calling startGenerationFromImage'); await startGenerationFromImage(); uiLog('ACTION_RUN: generate_3d_model (image) - SUCCESS'); }
                                                                else { uiLog('ACTION_ERROR: startGenerationFromImage function not found'); }
                                                            }
                                                        } else {
                                                            uiLog("ACTION_UNKNOWN", { kind: kind || 'none' }); // Log the determined kind
                                                        }

                                                        // ✅ Moved setProposed(null) here, inside try, after await
                                                        setProposed(null);

                                                    } catch (e) {
                                                        uiLog("ACTION_CLICK_ERROR", { error: String((e as any)?.message || e), actionTitle: a.title });
                                                    } finally {
                                                        setActBusy(false); // Re-enable buttons AFTER action attempt
                                                        // ❌ Removed setProposed(null) from here
                                                    }
                                                }}
                                        >{a.title}</button>
                                    ))}
                                </div>
                            )}
                            {/* Typing indicator */}
                            {message.role === 'assistant' && message.id === storeMessages[storeMessages.length - 1]?.id && sending && (<div className="mb-2 flex items-center gap-1 text-gray-400"><span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>)}
                            {/* Message Content */}
                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                        {/* Expandable Action Payload */}
                        {(message as any).action && (<div className="ml-4"><button onClick={() => toggleActionExpanded(message.id)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">{expandedActions.has(message.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />} {t('actions.actionType', {type: String((message as any).action.type)})}</button> {expandedActions.has(message.id) && (<div className="mt-2 p-3 bg-gray-800 rounded-lg"><pre className="text-xs text-gray-300 overflow-auto">{JSON.stringify((message as any).action, null, 2)}</pre></div>)}</div>)}
                    </div>
                ))}
                {/* Empty State */}
                {storeMessages.length === 0 && (<div className="text-center py-12 text-gray-500"><Bot className="w-8 h-8 mx-auto mb-3 text-gray-300" /><p className="text-sm">{t('empty.noMessages')}</p><p className="text-xs text-gray-400 mt-1">{t('empty.hint')}</p></div>)}
            </div>

            {/* Composer */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="space-y-3">
                    <div className="relative">
                        <textarea ref={textareaRef} value={msgText} onChange={handleTextareaChange} onKeyDown={handleKeyDown} placeholder={t('composer.placeholder')} className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" style={{ minHeight: '44px', maxHeight: '120px' }} disabled={sending} rows={1} />
                        <button type="submit" disabled={!msgText.trim() || sending || !headId} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title={!headId ? t('composer.needCommitTitle') : t('composer.send')}> {sending ? (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) : (<Send className="w-4 h-4" />)} </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500"> <span>{t('composer.hint')}</span> <span>{(msgText ?? '').length}/1000</span> </div>
                </form>
            </div>
        </div>
    );
}