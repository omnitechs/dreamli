// components/ExploreCTA.tsx
import React from "react";
import Link from "next/link";

type Props = {
    href?: string;               // where the button goes
    onClick?: () => void;        // optional click handler if you don't want a link
    title?: string;
    subtitle?: string;
    label?: string;
};

export default function ExploreCTA({
                                       href = "/gifts",
                                       onClick,
                                       title = "Prefer to explore our gifts yourself?",
                                       subtitle = "Set filters for budget, occasion, recipient, age group, or style, and browse our complete catalog of exclusive and personalized gifts.",
                                       label = "Start exploring",
                                   }: Props) {
    const Button = (
        <button
            type="button"
            onClick={onClick}
            className="group inline-flex items-center gap-3 rounded-full px-6 sm:px-8 py-3 sm:py-4
                 text-white font-semibold shadow-lg
                 bg-gradient-to-r from-[#8472DF] to-[#93C4FF]
                 hover:shadow-xl hover:opacity-95 active:opacity-90 transition"
            aria-label={label}
        >
            <i className="ri-search-line text-xl sm:text-2xl" />
            <span className="text-base sm:text-lg">{label}</span>
        </button>
    );

    return (
        <section className="text-center px-6 pb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2E2E2E]">
                {title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#2E2E2E]/70 max-w-2xl mx-auto">
                {subtitle}
            </p>

            <div className="mt-5 sm:mt-6">
                {onClick ? Button : (
                    <Link href={href} className="inline-block">
                        {Button}
                    </Link>
                )}
            </div>
        </section>
    );
}
