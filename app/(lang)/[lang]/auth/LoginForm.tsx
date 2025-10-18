// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, usePathname } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useSearchParams();
  const pathname = usePathname();

  function computeFallback(): string {
    // derive lang from current pathname: /{lang}/auth/login
    const seg = pathname?.split("/").filter(Boolean)[0] || "en";
    return `/${seg}/auth/account`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const redirectTo = params.get("redirect")?.startsWith("/")
      ? (params.get("redirect") as string)
      : computeFallback();

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: redirectTo,
    });

    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
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
          autoComplete="current-password"
          className="w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full rounded border px-4 py-2"
        disabled={busy}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
