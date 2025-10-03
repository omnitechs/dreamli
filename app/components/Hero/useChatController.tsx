import { useEffect, useRef, useState } from "react";

type Msg = { from: "ai" | "user"; text: string };
const SKEY = "chat:local:v1";
const MAX_MSGS = 10;

export function useChatController() {
    const [messages, setMessages] = useState<Msg[]>([
        {
            from: "ai",
            text: "Hi! I'm here to help you find the perfect gift. What are you looking for?",
        },
    ]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const sending = useRef(false);

    // Hydrate from localStorage (trim just in case)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem(SKEY);
        if (raw) {
            try {
                const parsed: Msg[] = JSON.parse(raw);
                setMessages(parsed.slice(-MAX_MSGS));
            } catch {}
        }
    }, []);

    // Persist whenever messages change (keep last 10 only)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const trimmed = messages.slice(-MAX_MSGS);
        localStorage.setItem(SKEY, JSON.stringify(trimmed));
    }, [messages]);

    async function send(e?: React.FormEvent) {
        e?.preventDefault?.();
        if (!input.trim() || sending.current) return;

        // include last 10 as history for context
        const last10 = messages.slice(-MAX_MSGS);
        const userMsg = { from: "user", text: input.trim() };
        const payload = { message: userMsg.text, history: last10 };

        // append user + placeholder AI bubble
        // @ts-ignore
        setMessages((m) => [...m, userMsg, { from: "ai", text: "" }]);
        setInput("");
        sending.current = true;
        setThinking(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            const append = (chunk: string) => {
                if (!chunk) return;
                setMessages((m) => {
                    const next = m.slice();
                    const last = next[next.length - 1];
                    if (last?.from === "ai") {
                        next[next.length - 1] = { ...last, text: (last.text ?? "") + chunk };
                    }
                    return next;
                });
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
                    if (data === "[DONE]") {
                        setThinking(false);
                        return;
                    }

                    try {
                        const evt = JSON.parse(data);

                        // robust handling of response stream variants
                        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                            append(evt.delta);
                        } else if (evt.type?.endsWith(".delta") && Array.isArray(evt.output)) {
                            for (const part of evt.output) {
                                if (typeof part?.delta === "string") append(part.delta);
                                else if (part?.type?.endsWith("output_text.delta") && typeof part?.delta === "string") append(part.delta);
                                else if (typeof part?.text === "string") append(part.text);
                            }
                        } else if (evt.type === "response.output_text" && typeof evt.text === "string") {
                            append(evt.text);
                        } else if (evt.type === "response.completed") {
                            setThinking(false);
                        } else if (evt.type === "error" || evt.error) {
                            append("⚠️ " + (evt.error?.message || "Streaming error"));
                            setThinking(false);
                        }
                    } catch {
                        // if not JSON, append raw data
                        append(data);
                    }
                }
            }
        } catch {
            setMessages((m) => [...m, { from: "ai", text: "⚠️ Error streaming response" }]);
        } finally {
            sending.current = false;
            setThinking(false);
            // ensure we never exceed window
            setMessages((m) => m.slice(-MAX_MSGS));
        }
    }

    return { messages, input, setInput, send, thinking };
}
