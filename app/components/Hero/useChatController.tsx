'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = { from: 'ai' | 'user'; text: string };

type ChatI18n = {
    greeting: string;          // e.g., t('chat.greeting')
    errorStreaming: string;    // e.g., t('chat.errorStreaming')
};

type Options = {
    i18n: ChatI18n;
    locale?: string;           // 'en' | 'nl' | ... (for per-locale storage)
    storageKey?: string;       // override if you want a custom key
    maxMsgs?: number;          // override default window
};

export function useChatController(opts: Options) {
    const {
        i18n,
        locale,
        storageKey,
        maxMsgs = 10
    } = opts;

    const SKEY = storageKey ?? `chat:local:v1:${locale ?? 'default'}`;

    const [messages, setMessages] = useState<Msg[]>([
        { from: 'ai', text: i18n.greeting },
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const sending = useRef(false);

    // Hydrate from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const raw = localStorage.getItem(SKEY);
        if (raw) {
            try {
                const parsed: Msg[] = JSON.parse(raw);
                setMessages(parsed.slice(-maxMsgs));
            } catch {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SKEY]); // re-hydrate if locale/storage key changes

    // Persist whenever messages change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const trimmed = messages.slice(-maxMsgs);
        localStorage.setItem(SKEY, JSON.stringify(trimmed));
    }, [messages, SKEY, maxMsgs]);

    async function send(e?: React.FormEvent) {
        e?.preventDefault?.();
        if (!input.trim() || sending.current) return;

        const lastN = messages.slice(-maxMsgs);
        const userMsg = { from: 'user' as const, text: input.trim() };
        const payload = { message: userMsg.text, history: lastN, locale };

        // optimistic UI
        setMessages((m) => [...m, userMsg, { from: 'ai', text: '' }]);
        setInput('');
        sending.current = true;
        setThinking(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.body) throw new Error('No response body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const append = (chunk: string) => {
                if (!chunk) return;
                setMessages((m) => {
                    const next = m.slice();
                    const last = next[next.length - 1];
                    if (last?.from === 'ai') {
                        next[next.length - 1] = { ...last, text: (last.text ?? '') + chunk };
                    }
                    return next;
                });
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
                    if (data === '[DONE]') {
                        setThinking(false);
                        return;
                    }
                    try {
                        const evt = JSON.parse(data);
                        if (evt.type === 'response.output_text.delta' && typeof evt.delta === 'string') {
                            append(evt.delta);
                        } else if (evt.type?.endsWith('.delta') && Array.isArray(evt.output)) {
                            for (const part of evt.output) {
                                if (typeof part?.delta === 'string') append(part.delta);
                                else if (typeof part?.text === 'string') append(part.text);
                            }
                        } else if (evt.type === 'response.output_text' && typeof evt.text === 'string') {
                            append(evt.text);
                        } else if (evt.type === 'response.completed') {
                            setThinking(false);
                        } else if (evt.type === 'error' || evt.error) {
                            append('⚠️ ' + (evt.error?.message || i18n.errorStreaming));
                            setThinking(false);
                        }
                    } catch {
                        append(data);
                    }
                }
            }
        } catch {
            setMessages((m) => [...m, { from: 'ai', text: `⚠️ ${i18n.errorStreaming}` }]);
        } finally {
            sending.current = false;
            setThinking(false);
            setMessages((m) => m.slice(-maxMsgs));
        }
    }

    function clearHistory() {
        const seed: Msg[] = [{ from: 'ai', text: i18n.greeting }];
        setMessages(seed);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SKEY, JSON.stringify(seed));
        }
    }

    return { messages, input, setInput, send, thinking, clearHistory };
}
