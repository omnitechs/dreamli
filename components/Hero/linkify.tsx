// Linkify.tsx
import React from "react";

const urlRe = /((https?:\/\/|www\.)[^\s<]+[^<.,:;"')\]\s])/gi;

export function Linkify({ text }: { text: string }) {
    const parts = text.split(urlRe);
    return (
        <>
            {parts.map((part, i) => {
                if (urlRe.test(part)) {
                    const href = part.startsWith("http") ? part : `https://${part}`;
                    return (
                        <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-[#8472DF]/50 hover:decoration-[#8472DF] break-words"
                        >
                            {part}
                        </a>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
