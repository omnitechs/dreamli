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

// Dedicated FREE Hero chat hook, using the dedicated /api/hero/chat endpoint.
// No credits, no streaming, simple JSON extraction from Responses API.
export function useHeroFreeChat(opts: Options) {
  const { i18n, locale, storageKey, maxMsgs = 10 } = opts;

  const SKEY = storageKey ?? `hero:chat:free:v1:${locale ?? 'default'}`;

  // Avoid clobbering existing history in React StrictMode: gate persistence until after hydration.
  const hasHydrated = useRef(false);

  const [messages, setMessages] = useState<Msg[]>([
    { from: 'ai', text: i18n.greeting },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const sending = useRef(false);

  // Hydrate from localStorage (also when SKEY changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(SKEY);
      if (raw) {
        const parsed: Msg[] = JSON.parse(raw);
        setMessages(parsed);
      }
    } catch {}
    // Mark as hydrated so persistence can start writing
    hasHydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SKEY]);

  // Persist whenever messages change, but only after we've hydrated once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasHydrated.current) return;
    try {
      localStorage.setItem(SKEY, JSON.stringify(messages));
    } catch {}
  }, [messages, SKEY]);

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
      const res = await fetch('/api/hero/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      // Attempt to extract plain text from Responses API result
      const extractText = (obj: any): string => {
        // Prefer new SDK convenience field if present
        if (typeof obj?.output_text === 'string' && obj.output_text) return obj.output_text;
        // Fallback: walk outputs/content shapes
        let out = '';
        const outputs = obj?.output || obj?.choices || [];
        for (const o of outputs) {
          const parts = o?.content || o?.message?.content || [];
          for (const p of parts) {
            if (typeof p?.text === 'string') out += p.text;
          }
        }
        return out || '';
      };

      const text = extractText(data) || '';
      setMessages((m) => {
        const next = m.slice();
        const last = next[next.length - 1];
        if (last?.from === 'ai') next[next.length - 1] = { ...last, text };
        return next;
      });
    } catch {
      setMessages((m) => [...m, { from: 'ai', text: `⚠️ ${i18n.errorStreaming}` }]);
    } finally {
      sending.current = false;
      setThinking(false);
      // Trigger a state update to ensure persistence runs after completion
      setMessages((m) => m.slice());
    }
  }

  function clearHistory() {
    const seed: Msg[] = [{ from: 'ai', text: i18n.greeting }];
    setMessages(seed);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(SKEY, JSON.stringify(seed)); } catch {}
    }
  }

  return { messages, input, setInput, send, thinking, clearHistory };
}
