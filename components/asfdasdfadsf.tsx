import React from "react";
import {useChatController} from "@/components/Hero/useChatController";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

function ChatHeader() {
    return (
        <header className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8472DF] to-[#93C4FF] rounded-full grid place-items-center">
                <i className="ri-robot-line text-white text-lg" />
            </div>
            <div>
                <h3 className="font-bold text-[#2E2E2E]">AI Gift Assistant</h3>
                <p className="text-sm text-[#2E2E2E]/60">Online now</p>
            </div>
        </header>
    );
}

export function ChatBubble({ from = "ai", children }: { from?: "ai" | "user"; children: string }) {
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
                            className={isUser ? "underline" : "underline decoration-[#8472DF]/50 hover:decoration-[#8472DF]"}
                        />
                    ),
                    // keep lists and paragraphs nicely spaced
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

function ChatTranscript({ items, thinking }: { items: { from: "ai" | "user"; text: string }[]; thinking: boolean }) {
    return (
        <ul className="space-y-3">
            {items.map((m, i) => (
                <ChatBubble key={i} from={m.from}>
                    {m.text}
                </ChatBubble>
            ))}
            {thinking && <ThinkingBubble />}
        </ul>
    );
}

function ChatInputBar({ value, onChange, onSend }: any) {
    return (
        <form className="flex items-center gap-2 pt-2" onSubmit={onSend}>
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#8472DF]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type="submit"
                className="w-10 h-10 bg-[#8472DF] text-white rounded-full grid place-items-center hover:bg-[#8472DF]/90 transition-colors"
                aria-label="Send message"
            >
                <i className="ri-send-plane-line" />
            </button>
        </form>
    );
}

/* ---------- Composite Chat Card ---------- */

function AIChatAssistant() {
    const { messages, input, setInput, send, thinking } = useChatController();

    return (
        <aside className="relative">
            <article className="bg-white rounded-3xl p-8 shadow-2xl border border-[#F3E8FF] mb-6">
                <ChatHeader />
                <ChatTranscript items={messages} thinking={thinking} />
                <ChatInputBar value={input} onChange={setInput} onSend={send} />
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
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight">
                        Find the perfect gift <span className="text-[#8472DF]">your way</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}

function HeroContent() {
    return (
        <div className="pb-16 sm:pb-24 lg:pb-32">
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
    return (
        <section className="bg-gradient-to-br from-[#DBEAFE]/20 to-[#F3E8FF]/20">
            <HeroTitle />
            <HeroContent />
        </section>
    );
}
