// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
    const t = useTranslations("Auth.register");
    const tl = useTranslations("Auth.login");

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    function currentLang() {
        const seg = pathname?.split("/").filter(Boolean)[0] || "en";
        return seg;
    }

    function computeFallback(): string {
        return `/${currentLang()}/auth/account`;
    }

    function computeRedirect() {
        const r = params.get("redirect");
        if (r && r.startsWith("/")) return r;
        return computeFallback();
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError(null);

        // 1) Create user
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setBusy(false);
            setError(data?.error ?? "Failed to register");
            return;
        }

        // 2) Auto-login with credentials
        const redirectTo = computeRedirect();

        const login = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setBusy(false);

        if (login?.ok) {
            // Force a full reload so session cookie is applied everywhere (header, server components)
            if (typeof window !== 'undefined') {
                window.location.assign(redirectTo);
            } else {
                router.replace(redirectTo);
                router.refresh();
            }
        } else {
            // Fallback: go to login with prefilled redirect
            router.replace(
                `/${currentLang()}/auth/login?redirect=${encodeURIComponent(redirectTo)}`
            );
        }
    }

    async function onGoogle() {
        setBusy(true);
        setError(null);
        const callbackUrl = computeRedirect();
        await signIn("google", { callbackUrl });
        setBusy(false);
    }

    return (
        <>
            <button
                type="button"
                onClick={onGoogle}
                className="w-full rounded border px-4 py-2"
                disabled={busy}
            >
                {tl("withGoogle")}
            </button>

            <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="h-px flex-1 bg-gray-200" />
                <span>{tl("or")}</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
            {error && (
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-1">
                <label className="block text-sm">{t("name")}</label>
                <input
                    type="text"
                    autoComplete="name"
                    className="w-full rounded border px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm">{t("email")}</label>
                <input
                    type="email"
                    autoComplete="email"
                    className="w-full rounded border px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm">{t("password")}</label>
                <input
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded border px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full rounded border px-4 py-2"
                disabled={busy}
            >
                {busy ? t("creating") : t("submit")}
            </button>
        </form>
        </>
    );
}
