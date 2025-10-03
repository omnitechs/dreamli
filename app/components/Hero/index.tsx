import React from "react";
import { useChatController } from "@/app/components/Hero/useChatController";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ExploreCTA from "@/app/components/Hero/ExploreCTA";

/* ---------- Chat UI Primitives ---------- */

export function ThinkingBubble() {
    return (
        <li className="bg-[#F8F9FF] text-[#2E2E2E] p-4 rounded-2xl rounded-bl-sm inline-flex items-center gap-2 w-fit">
      <span className="w-6 h-6 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full grid place-items-center">
        <i className="ri-robot-line text-white text-sm" />
      </span>
            <span className="inline-flex gap-1 pl-1">
        <span className="w-2 h-2 rounded-full bg-[#B9C3FF] animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-[#B9C3FF] animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-[#B9C3FF] animate-bounce [animation-delay:300ms]" />
      </span>
        </li>
    );
}

function ChatHeader({ onClear }: { onClear: () => void }) {
    return (
        <header className="flex items-center justify-between gap-3 mb-4">
            {/* Left side: avatar + title */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full grid place-items-center">
                    <i className="ri-robot-line text-white text-lg" />
                </div>
                <div>
                    <h3 className="font-bold text-[#2E2E2E]">AI Gift Assistant</h3>
                    <p className="text-sm text-[#2E2E2E]/60">Online now</p>
                </div>
            </div>

            {/* Right side: Clear button */}
            <button
                onClick={onClear}
                className="text-sm px-3 py-1.5 rounded-full border border-[#E6E6F5] hover:bg-[#F8F9FF] transition-colors"
            >
                Clear history
            </button>
        </header>
    );
}

export function ChatBubble({
                               from = "ai",
                               children,
                           }: {
    from?: "ai" | "user";
    children: string;
}) {
    const isUser = from === "user";
    return (
        <li
            className={[
                "p-4 rounded-2xl leading-relaxed",
                isUser
                    ? "bg-[#8472DF] text-white rounded-br-sm ml-8"
                    : "bg-[#F8F9FF] text-[#2E2E2E] rounded-bl-sm",
            ].join(" ")}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: (props) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={
                                isUser
                                    ? "underline"
                                    : "underline decoration-[#8472DF]/50 hover:decoration-[#8472DF]"
                            }
                        />
                    ),
                    p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => <strong className="font-semibold" {...props} />,
                }}
            >
                {children}
            </ReactMarkdown>
        </li>
    );
}

function ChatTranscript({
                            items,
                            thinking,
                        }: {
    items: { from: "ai" | "user"; text: string }[];
    thinking: boolean;
}) {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const endRef = React.useRef<HTMLDivElement | null>(null);
    const userAnchoring = React.useRef(true); // true = follow bottom

    // Helper: am I close enough to bottom?
    const isNearBottom = React.useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return true;
        const threshold = 48; // px
        return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    }, []);

    // Track user-initiated scrolls to enable/disable anchoring
    const onScroll = React.useCallback(() => {
        userAnchoring.current = isNearBottom();
    }, [isNearBottom]);

    // When messages update, only auto-scroll if anchored or actively thinking
    React.useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        if (userAnchoring.current || thinking) {
            // Use 'auto' to avoid jumpy smooth chaining during streaming
            endRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, [items, thinking]);

    // If container resizes (e.g., window resize), keep position if anchored
    React.useEffect(() => {
        const el = scrollerRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(() => {
            if (userAnchoring.current) {
                endRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="flex-1 overflow-y-auto min-h-0 pr-1 overscroll-contain"
            style={{ scrollbarGutter: "stable both-edges" }}
            aria-live="polite"
        >
            <ul className="space-y-3">
                {items.map((m, i) => (
                    <ChatBubble key={i} from={m.from}>
                        {m.text}
                    </ChatBubble>
                ))}
                {thinking && <ThinkingBubble />}
            </ul>
            <div ref={endRef} />
        </div>
    );
}

function ChatInputBar({
                          value,
                          onChange,
                          onSend,
                          sending,      // rename prop
                      }: {
    value: string;
    onChange: (v: string) => void;
    onSend: (e?: React.FormEvent) => void;
    sending: boolean; // true when the model is thinking
}) {
    const sendDisabled = sending || !value.trim();

    return (
        <form className="flex items-center gap-2 pt-2" onSubmit={onSend}>
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#8472DF]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                // keep input enabled; optionally lock typing only while thinking:
                readOnly={sending}
            />
            <button
                type="submit"
                className="w-10 h-10 bg-[#8472DF] text-white rounded-full grid place-items-center hover:bg-[#8472DF]/90 transition-colors disabled:opacity-50"
                aria-label="Send message"
                disabled={sendDisabled}
            >
                <i className="ri-send-plane-line" />
            </button>
        </form>
    );
}

/* ---------- Composite Chat Card ---------- */

function AIChatAssistant() {
    const { messages, input, setInput, send, thinking, clearHistory } = useChatController();

    return (
        <aside className="relative">
            <article className="bg-white rounded-3xl p-8 shadow-2xl border border-[#F3E8FF] mb-6 flex flex-col max-h-[80vh]">
                <ChatHeader onClear={clearHistory} />
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ChatTranscript items={messages} thinking={thinking} />
                </div>
                {/* pass only 'thinking' as sending */}
                <ChatInputBar value={input} onChange={setInput} onSend={send} sending={thinking} />
            </article>

            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFB067] rounded-full animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#93C4FF]/20 rounded-full animate-bounce" />
        </aside>
    );
}

/* ---------- Page Section ---------- */

function HeroTitle() {
    return (
        <div className="pt-12 pb-8">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight">
                        Find the perfect gift <span className="text-[#8472DF]">your way</span>
                    </h1>
                    <p className="mt-7 text-xl">
                        Not sure what to choose? With Dreamli you can find gifts in two ways
                    </p>
                </div>
            </div>
        </div>
    );
}

function HeroContent() {
    return (
        <div className="pb-12 sm:pb-12 lg:pb-12">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-1 gap-16 items-start">
                        <AIChatAssistant />
                        {/* Add your second column content here when ready */}
                    </div>
                </div>
            </div>
        </div>
    );
}



export default function Hero() {
    // Keep page scrollable; the chat card is capped internally.
    return (
        <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20">
            <HeroTitle />
            <HeroContent />
            <ExploreCTA href="/gifts" />
        </section>
    );
}
