// components/auth/LoginForm.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("Auth.login");
  const te = useTranslations("Auth.login.errors");

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

  const mapError = useCallback(
    (code?: string | null) => {
      switch (code) {
        case "CredentialsSignin":
        case "credentials":
          return te("credentials");
        case "OAuthAccountNotLinked":
          return te("oauthAccountNotLinked");
        case "Configuration":
        case "AccessDenied":
        case "Verification":
          return te("default");
        default:
          return te("default");
      }
    },
    [te]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const callbackUrl = computeCallbackUrl();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setBusy(false);

    const success = !!(res?.ok && !res?.error);
    if (success) {
      if (typeof window !== "undefined") {
        window.location.assign(callbackUrl);
      }
      return;
    }

    // Show localized error inline instead of redirecting to /api/auth/signin?error=
    const code = res?.error ?? "credentials";
    const msg = mapError(code);
    setError(msg);

    // Also reflect the error in the URL while preserving any existing redirect param
    // This keeps the intended post-login destination (redirect) in the URL
    try {
      if (typeof window !== "undefined") {
        const usp = new URLSearchParams(params.toString());
        usp.set("error", code);
        const q = usp.toString();
        const newUrl = q ? `${pathname}?${q}` : pathname || "/";
        window.history.replaceState(null, "", newUrl);
      }
    } catch {
      // no-op
    }
  }

  async function onGoogle() {
    setBusy(true);
    setError(null);
    const callbackUrl = computeCallbackUrl();
    await signIn("google", { callbackUrl });
    setBusy(false);
  }

  // If the URL already contains an error from a previous redirect (e.g. OAuthAccountNotLinked),
  // display a localized message instead of the default NextAuth English screen.
  useEffect(() => {
    const err = params.get("error");
    if (err) {
      setError(mapError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

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
            onInvalid={(e) => {
              const el = e.currentTarget as HTMLInputElement;
              const v = el.validity;
              if (v.valueMissing) {
                el.setCustomValidity(te("requiredEmail"));
              } else if (v.typeMismatch) {
                el.setCustomValidity(te("invalidEmail"));
              } else {
                el.setCustomValidity("");
              }
            }}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
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
            onInvalid={(e) => {
              const el = e.currentTarget as HTMLInputElement;
              if (el.validity.valueMissing) {
                el.setCustomValidity(te("requiredPassword"));
              } else {
                el.setCustomValidity("");
              }
            }}
            onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
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
