// app/(lang)/[lang]/ai/components/Messenger.tsx
"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Send, User, Bot, Settings, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import type { Message } from "../../types";
import useMessage from "@/app/(lang)/[lang]/ai/hooks/useMessage";
import useModels from "@/app/(lang)/[lang]/ai/hooks/useModels";
import useCommit from "@/app/(lang)/[lang]/ai/hooks/useCommit";
import ModelGallery from "../GeneratorPanel/ModelGallery";
import useImages from "@/app/(lang)/[lang]/ai/hooks/useImages";
import useImageJobs from "@/app/(lang)/[lang]/ai/hooks/useImageJobs";
import { useMeshyStream } from "@/app/(lang)/[lang]/ai/hooks/useMeshyStream";
import useGenerator from "@/app/(lang)/[lang]/ai/hooks/useGenerator";
import { useDispatch } from "react-redux";
import {
    addMessage as addMsgAction,
    editMessage as editMsgAction,
    updateText as updateGenText,
} from "@/app/store/slices/generatorSlice";
import { useLocale, useTranslations } from "next-intl";
import AiSessionModelsNavbarClient from "@/app/(lang)/[lang]/ai/AiSessionModelsNavbarClient";
import ProjectModelsNavbarClient from "@/app/(lang)/[lang]/ai/projects/[slug]/[projectId]/ProjectModelsNavbarClient";

type AnglePromptMap = Record<string, string>;
type ProposedAction = {
    title: string;
    kind?: string;
    prompt?: string;
    refs?: string[];
    confirm?: string;
    meta?: { angles?: string[]; prompts?: AnglePromptMap; [k: string]: any };
};

/** ------- global send lock across duplicate mounts ------- */
const getGlobal = () => (typeof window !== "undefined" ? (window as any) : (globalThis as any));
function acquireGlobalSend(): boolean {
    const g = getGlobal();
    if (g.__dreamli_ai_send_busy) return false;
    g.__dreamli_ai_send_busy = true;
    return true;
}
function releaseGlobalSend() {
    const g = getGlobal();
    g.__dreamli_ai_send_busy = false;
}

export function Messenger() {
    const { startGenerationFromPrompt, startGenerationFromImage } = useMeshyStream();
    const { startJob } = useImageJobs();

    const uiLog = (...args: any[]) => {
        try {
            console.log("[AI/UI]", ...args);
        } catch {}
    };

    const { messages: storeMessages, msgText, setMsgText, addMsg, setMsgRole } = useMessage();
    const { models } = useModels();
    const { headId, commitsState, onCommit } = useCommit();
    const { gen } = useGenerator();
    const dispatch = useDispatch();
    const { getSelectedImageUrls } = useImages();

    const t = useTranslations("AI.Messenger");
    const locale = useLocale();

    useEffect(() => {
        setMsgRole("user" as const);
    }, [setMsgRole]);

    const [sending, setSending] = useState(false);
    const [actBusy, setActBusy] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
    const [proposed, setProposed] = useState<ProposedAction[] | null>(null);

    // local lock (prevents rapid double submit within same instance)
    const sendLockRef = useRef(false);

    // Scroll stabilization
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

    // External quick-ask bridge (kept; global lock will block duplicates)
    useEffect(() => {
        const handler = (ev: Event) => {
            try {
                const ce = ev as CustomEvent<{ prompt?: string }>;
                const prompt =
                    (ce?.detail?.prompt && String(ce.detail.prompt).trim()) ||
                    "Please review my current images and selections, share your opinion, and propose next steps.";
                if (sending) return;
                setMsgRole("user" as const);
                setMsgText(prompt);
                setTimeout(() => {
                    try {
                        formRef.current?.requestSubmit();
                    } catch {}
                }, 0);
            } catch {}
        };
        try {
            window.addEventListener("ai-messenger-quick-ask" as any, handler as any);
        } catch {}
        return () => {
            try {
                window.removeEventListener("ai-messenger-quick-ask" as any, handler as any);
            } catch {}
        };
    }, [sending, setMsgRole, setMsgText]);

    // UI helpers
    const formatTime = (timestamp: string) =>
        new Date(timestamp).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
    const getRoleIcon = (role: string) =>
        role === "user" ? (
            <User className="w-4 h-4" />
        ) : role === "assistant" ? (
            <Bot className="w-4 h-4" />
        ) : role === "system" ? (
            <Settings className="w-4 h-4" />
        ) : (
            <div className="w-4 h-4 rounded-full bg-gray-400" />
        );
    const getRoleColor = (role: string) =>
        role === "user"
            ? "text-blue-600 bg-blue-50"
            : role === "assistant"
                ? "text-green-600 bg-green-50"
                : role === "system"
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-600 bg-gray-50";
    const getRoleLabel = (role: string) =>
        role === "user" ? t("roles.user") : role === "assistant" ? t("roles.assistant") : role === "system" ? t("roles.system") : role;

    // Button classes (your exact styles)
    const classesPurple =
        "px-4 py-2 bg-purple-600 text-white font-medium rounded-xl disabled:opacity-50";
    const classesBlue =
        "px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap";

    const getActionClasses = (kind?: string): string => {
        switch ((kind || "").toLowerCase()) {
            case "generate_3d_model":
                return classesPurple;
            case "generate_images":
            case "generate_angles":
            default:
                return classesBlue;
        }
    };

    // Normalize actions
    const normalizeActions = (actions: any[]): ProposedAction[] => {
        const norm = (actions || [])
            .filter((a) => a && typeof a === "object")
            .map((a) => ({
                title: String(a.title || "").slice(0, 120),
                kind: typeof a.kind === "string" ? a.kind : undefined,
                prompt: typeof a.prompt === "string" ? a.prompt : undefined,
                refs: Array.isArray(a.refs) ? a.refs.filter((u: any) => typeof u === "string") : undefined,
                confirm: typeof a.confirm === "string" ? a.confirm : undefined,
                meta: typeof a.meta === "object" && a.meta ? a.meta : undefined,
            }))
            .filter((a) => a.title);
        return norm;
    };

    // Tooltip shows per-angle prompts if present
    const tooltipFor = (a: ProposedAction) => {
        const lines: string[] = [];
        if (a.kind) lines.push(`kind: ${a.kind}`);
        if (Array.isArray(a.refs) && a.refs.length) lines.push(`refs: ${a.refs.join(", ")}`);
        if (typeof a.prompt === "string" && a.prompt.trim()) lines.push(`prompt: ${a.prompt.trim()}`);
        if (a.meta?.prompts && typeof a.meta.prompts === "object") {
            lines.push("angle prompts:");
            const entries = Object.entries(a.meta.prompts as AnglePromptMap);
            for (const [angle, pr] of entries) {
                lines.push(`- ${angle}: ${String(pr).slice(0, 400)}`);
            }
        }
        return lines.join("\n");
    };

    // -------------- send message --------------
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        // global + local locks to stop duplicates from multiple mounts
        if (sendLockRef.current) return;
        if (!acquireGlobalSend()) return;
        sendLockRef.current = true;

        const text = (msgText ?? "").trim();
        if (!text) {
            sendLockRef.current = false;
            releaseGlobalSend();
            return;
        }
        if (!headId) {
            setErrorText(t("errors.needCommit"));
            sendLockRef.current = false;
            releaseGlobalSend();
            return;
        }
        if (sending) {
            sendLockRef.current = false;
            releaseGlobalSend();
            return;
        }

        setSending(true);
        setErrorText(null);
        addMsg(); // Add user message

        // Context
        let imageUrls: string[] = [];
        try {
            imageUrls = getSelectedImageUrls() || [];
        } catch {
            imageUrls = [];
        }

        const modelImageUrls: string[] = Array.isArray(models)
            ? models
                .map((m: any) => m?.localThumbnailUrl || m?.thumbnailUrl)
                .filter((u: any) => typeof u === "string" && (/^https?:\/\//i.test(u) || /^data:/i.test(u)))
            : [];
        try {
            sessionStorage.setItem("ai_context_urls", JSON.stringify(imageUrls));
            sessionStorage.setItem("ai_model_thumbnails", JSON.stringify(modelImageUrls));
        } catch {}
        const history = (storeMessages || []).slice(-12).map((m: any) => ({
            from: m.role === "assistant" ? "ai" : "user",
            text: String(m.content ?? ""),
        }));
        uiLog("SEND", {
            textLen: text.length,
            historyLen: history.length,
            selectedRefs: imageUrls.length,
            modelThumbs: Array.isArray(models) ? models.length : 0,
        });

        // one assistant placeholder per send
        const aiId = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        dispatch(addMsgAction({ id: aiId, role: "assistant", content: "", createdAt } as any));

        if (textareaRef.current) textareaRef.current.style.height = "auto";

        let aiText = "";
        setProposed(null);

        const extractTextFromEvt = (evt: any): string => {
            if (!evt) return "";
            try {
                const tType = String(evt?.type || "");
                if (/tool|function_call/.test(tType) || /response\.(tool|function)_call(\.|$)/.test(tType)) {
                    return "";
                }
                if (typeof evt?.delta === "string") return evt.delta;
                if (evt?.type === "content_block_delta" && evt?.delta?.type === "text_delta" && typeof evt?.delta?.text === "string") {
                    return evt.delta.text;
                }
                if (typeof evt?.delta?.text === "string") return evt.delta.text;
                if (typeof evt?.delta?.content === "string") return evt.delta.content;
                if (Array.isArray(evt?.output)) {
                    let out = "";
                    for (const part of evt.output) {
                        if (typeof part?.delta === "string") out += part.delta;
                        if (Array.isArray(part?.content)) {
                            for (const c of part.content) {
                                if (typeof c?.delta === "string") out += c.delta;
                            }
                        }
                    }
                    return out;
                }
                if (Array.isArray(evt?.content)) {
                    let out = "";
                    for (const c of evt.content) {
                        if (typeof c?.delta === "string") out += c.delta;
                    }
                    return out;
                }
                if (Array.isArray(evt?.delta?.content)) {
                    let out = "";
                    for (const c of evt.delta.content) {
                        if (typeof c?.text === "string") out += c.text;
                        else if (typeof c?.delta === "string") out += c.delta;
                    }
                    return out;
                }
            } catch {}
            return "";
        };

        // client-side idempotency id
        const clientTxnId = crypto.randomUUID();

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, history, imageUrls, modelImageUrls, clientTxnId }),
            });

            if (res.status === 409) {
                uiLog("DROPPED_DUPLICATE_BY_SERVER", clientTxnId);
                dispatch(editMsgAction({ id: aiId, content: t("errors.failedStart") } as any));
                return;
            }
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
            try {
                window.dispatchEvent(new Event("credits-updated"));
            } catch {}

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let evCount = 0;

            const toolBuf: Record<string, { name?: string; args: string; done?: boolean }> = {};
            const toolCalls: Array<{ name: string; args: any }> = [];

            const append = (chunk: string) => {
                if (!chunk) return;
                aiText += chunk;
                dispatch(editMsgAction({ id: aiId, content: aiText } as any));
            };

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split("\n\n");
                buffer = events.pop() || "";

                for (const event of events) {
                    const line = event.trim();
                    if (!line.startsWith("data:")) continue;
                    const data = line.replace(/^data:\s*/, "");
                    if (data === "[DONE]") break;

                    try {
                        evCount++;
                        const evt = JSON.parse(data);
                        const evType = String(evt?.type || "");
                        uiLog("SSE_EVT_RAW", { idx: evCount, type: evType });

                        const add = extractTextFromEvt(evt);
                        if (add) append(add);

                        const tType = String(evt.type || "");
                        const isToolOrFnCall =
                            /(tool|function)_call/.test(tType) || /response\.(tool|function)_call(\.|$)/.test(tType);
                        if (isToolOrFnCall) {
                            const callId = String(evt.call_id || evt.id || evt.tool_call_id || evt.callId || "default");
                            const buf = (toolBuf[callId] ||= { args: "" });
                            const name =
                                evt.name ||
                                evt.tool_name ||
                                evt.function_name ||
                                evt?.call?.name ||
                                evt?.tool?.name ||
                                evt?.function_call?.name;
                            if (typeof name === "string" && !buf.name) buf.name = name;
                            const argDelta =
                                evt.arguments_delta ||
                                evt.args_delta ||
                                evt?.delta?.arguments ||
                                evt.arguments ||
                                evt?.function_call?.arguments_delta;
                            if (typeof argDelta === "string") buf.args += argDelta;

                            const isCompleted =
                                tType.endsWith("completed") ||
                                tType.endsWith(".done") ||
                                tType === "response.tool_call" ||
                                tType === "response.function_call" ||
                                (evt as any)?.status === "completed";

                            if (isCompleted) {
                                let argsParsed: any = {};
                                try {
                                    argsParsed = buf.args ? JSON.parse(buf.args) : {};
                                } catch {}
                                let toolName = (buf.name || "unknown_tool").toString();
                                if (toolName === "unknown_tool") {
                                    if (argsParsed?.actions) toolName = "propose_actions";
                                    else if (argsParsed?.prompt && (argsParsed?.target_style || argsParsed?.target_polycount))
                                        toolName = "generate_3d_model";
                                    else if (argsParsed?.prompt) toolName = "generate_images";
                                }
                                toolCalls.push({ name: toolName, args: argsParsed });
                            }
                        }
                    } catch (e) {
                        uiLog("SSE_PARSE_ERR", {
                            error: String((e as any)?.message || e),
                            dataPreview: (line || "").slice(0, 240),
                        });
                    }
                }
            }

            // Finalize actions
            let finalVisibleText = aiText.trim();
            let proposedActions: ProposedAction[] = [];

            const realActionCall = toolCalls.find((tc) => tc.name === "propose_actions");
            if (realActionCall && Array.isArray(realActionCall.args?.actions)) {
                proposedActions = normalizeActions(realActionCall.args.actions);
            } else {
                // Leaked JSON fallback
                const jsonMarker = '{"actions":';
                const idx = finalVisibleText.indexOf(jsonMarker);
                if (idx !== -1) {
                    const cleanText = finalVisibleText.substring(0, idx).trim();
                    const jsonString = finalVisibleText.substring(idx);
                    try {
                        const parsed = JSON.parse(jsonString);
                        if (parsed && Array.isArray(parsed.actions)) {
                            proposedActions = normalizeActions(parsed.actions);
                            finalVisibleText = cleanText;
                        }
                    } catch {}
                }
            }

            if (finalVisibleText === "" && proposedActions.length > 0) {
                finalVisibleText = "Here are the next steps I've prepared:";
            }

            dispatch(editMsgAction({ id: aiId, content: finalVisibleText } as any));
            if (proposedActions.length > 0) setProposed(proposedActions);

            try {
                const pid =
                    (gen as any)?.__meta?.projectId ||
                    (commitsState?.headId ? (commitsState as any).entities?.[commitsState.headId]?.projectId : null) ||
                    "demo-project";
                await onCommit(String(pid));
            } catch (e) {
                console.error("Failed to create chat commit:", e);
            }
        } catch (err) {
            uiLog("CHAT_ERR", String(err));
            const msg = t("errors.contactFailed");
            if (!aiText) dispatch(editMsgAction({ id: aiId, content: msg } as any));
        } finally {
            setSending(false);
            sendLockRef.current = false;
            releaseGlobalSend();
        }
    };

    // Keyboard: route Enter to form submit ONCE
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!sendLockRef.current) formRef.current?.requestSubmit();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMsgText(e.target.value);
        const ta = e.target;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    };

    const toggleActionExpanded = (messageId: string) => {
        const next = new Set(expandedActions);
        next.has(messageId) ? next.delete(messageId) : next.add(messageId);
        setExpandedActions(next);
    };

    const runAction = async (a: ProposedAction) => {
        uiLog("ACTION_CLICKED", { title: a.title, kind: a.kind, meta: a.meta });
        try {
            setActBusy(true);

            const lastUserMsg = [...storeMessages].reverse().find((m: any) => m.role === "user")?.content || "";
            const basePrompt = (a.prompt && a.prompt.trim()) || String(lastUserMsg || "").trim() || "Generate image";
            let kind = (a.kind || "").toLowerCase();
            const refs = Array.isArray(a.refs) ? a.refs.filter((u) => typeof u === "string" && u.length > 0) : [];

            if (!kind) {
                const titleLower = (a.title || "").toLowerCase();
                if (titleLower.includes("angles") || titleLower.includes("multi-view")) kind = "generate_angles";
                else if (titleLower.includes("3d model")) kind = "generate_3d_model";
                else kind = "generate_images";
            }

            if (kind === "generate_images") {
                const promptToUse = basePrompt;
                try {
                    dispatch(updateGenText(promptToUse));
                } catch {}
                if (typeof startJob === "function") {
                    await startJob({ prompt: promptToUse });
                }
            } else if (kind === "generate_angles") {
                const angles = Array.isArray(a.meta?.angles) ? a.meta!.angles! : [];
                const perAnglePrompts: AnglePromptMap = (a.meta?.prompts || {}) as AnglePromptMap;

                if (!angles.length) {
                    uiLog('ACTION_ERROR: "generate_angles" proposed without meta.angles; aborting.');
                    return;
                }

                if (typeof startJob === "function") {
                    for (const angle of angles) {
                        const pForAngle = (perAnglePrompts?.[angle] || `${basePrompt} — ${angle}`).trim();
                        try {
                            dispatch(updateGenText(pForAngle));
                        } catch {}
                        await startJob({ prompt: pForAngle });
                    }
                }
            } else if (kind === "generate_3d_model") {
                const promptToUse = basePrompt;
                try {
                    dispatch(updateGenText(promptToUse));
                } catch {}
                if (refs.length === 0) {
                    if (typeof startGenerationFromPrompt === "function") {
                        await startGenerationFromPrompt();
                    }
                } else {
                    const selectedUrls = getSelectedImageUrls ? getSelectedImageUrls() : [];
                    if (JSON.stringify(refs.slice().sort()) !== JSON.stringify((selectedUrls || []).slice().sort())) {
                        uiLog("WARNING: AI refs differ from selected images. Using current selections.");
                    }
                    if (typeof startGenerationFromImage === "function") {
                        await startGenerationFromImage();
                    }
                }
            } else {
                uiLog("ACTION_UNKNOWN", { kind });
            }

            setProposed(null); // hide buttons after running
        } catch (e) {
            uiLog("ACTION_CLICK_ERROR", { error: String((e as any)?.message || e), actionTitle: a.title });
        } finally {
            setActBusy(false);
        }
    };

    return (
        <div className="bg-white xl:border-r border-gray-200 xl:h-full min-h-0 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
                {sending && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 animate-pulse" />
                )}
            </div>

            <AiSessionModelsNavbarClient />
            <ModelGallery />

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
                    {t("errors.needCommitBanner")}
                </div>
            )}

            {/* Messages List */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-auto p-4 space-y-4"
                style={{ overflowAnchor: "none" }}
            >
                {storeMessages.map((message: Message) => (
                    <div key={message.id} className="group">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getRoleColor(message.role)}`}>
                                {getRoleIcon(message.role)}
                                <span className="font-medium capitalize">{getRoleLabel(message.role)}</span>
                            </div>
                            <span>•</span>
                            <span>{formatTime(message.createdAt)}</span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-2">
                            {message.role === "assistant" &&
                                message.id === storeMessages[storeMessages.length - 1]?.id &&
                                sending && (
                                    <div className="mb-2 flex items-center gap-1 text-gray-400">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                )}
                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>

                        {(message as any).action && (
                            <div className="ml-4">
                                <button
                                    onClick={() => toggleActionExpanded(message.id)}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {expandedActions.has(message.id) ? (
                                        <ChevronDown className="w-3 h-3" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3" />
                                    )}
                                    Dev payload
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
                        <p className="text-sm">{t("empty.noMessages")}</p>
                        <p className="text-xs text-gray-400 mt-1">{t("empty.hint")}</p>
                    </div>
                )}
            </div>
            {/* Proposed Actions BAR — below chat */}
            {Array.isArray(proposed) && proposed.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-3 bg-white">
                    <div className="flex flex-wrap gap-2">
                        {proposed.slice(0, 6).map((a, idx) => (
                            <button
                                key={`${a.title}:${idx}`}
                                type="button"
                                className={getActionClasses(a.kind)}
                                disabled={actBusy}
                                title={tooltipFor(a)}
                                onClick={() => runAction(a)}
                            >
                                {a.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Composer */}
            <div className="border-t border-gray-200 p-4">
                <form ref={formRef} onSubmit={handleSendMessage} className="space-y-3">
                    <div className="relative">
            <textarea
                ref={textareaRef}
                value={msgText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={t("composer.placeholder")}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{ minHeight: "44px", maxHeight: "240px" }}
                disabled={sending}
                rows={4}
            />
                        <button
                            type="submit"
                            disabled={!msgText.trim() || sending || sendLockRef.current || !headId}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={!headId ? t("composer.needCommitTitle") : t("composer.send")}
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="order-2 sm:order-1">{t("composer.hint")}</span>
                        <span className="order-1 sm:order-2 self-end sm:self-auto">{(msgText ?? "").length}/1000</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
