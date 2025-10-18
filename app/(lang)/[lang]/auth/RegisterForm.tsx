// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const params = useSearchParams();
    const router = useRouter();

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
        const redirectTo = params.get("redirect") ?? "/";

        const login = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setBusy(false);

        if (login?.ok) {
            router.replace(redirectTo);
        } else {
            // Fallback: go to login with prefilled redirect
            router.replace(
                `/login?redirect=${encodeURIComponent(redirectTo)}`
            );
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            {error && (
                <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-1">
                <label className="block text-sm">Name</label>
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
                <label className="block text-sm">Email</label>
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
                <label className="block text-sm">Password</label>
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
                {busy ? "Creating…" : "Create account"}
            </button>
        </form>
    );
}
