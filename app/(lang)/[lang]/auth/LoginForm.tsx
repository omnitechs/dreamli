// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("Auth.login");

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

  function computeCallbackUrl() {
    const redirectParam = params.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) return redirectParam;
    return computeFallback();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const callbackUrl = computeCallbackUrl();

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl,
    });

    setBusy(false);
  }

  async function onGoogle() {
    setBusy(true);
    setError(null);
    const callbackUrl = computeCallbackUrl();
    await signIn("google", { callbackUrl });
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onGoogle}
        className="w-full rounded border px-4 py-2"
        disabled={busy}
      >
        {t("withGoogle")}
      </button>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="h-px flex-1 bg-gray-200" />
        <span>{t("or")}</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {error && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
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
          {busy ? t("signingIn") : t("submit")}
        </button>
      </form>
    </div>
  );
}
