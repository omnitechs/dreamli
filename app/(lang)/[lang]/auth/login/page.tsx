// app/(lang)/[lang]/auth/login/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "../LoginForm";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function LoginPage({
  params,
  searchParams,
}: {
  // Next 15: params/searchParams are async
  params: Promise<{ lang: string }>;
  // Next 15: searchParams must be awaited before accessing
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const session = await auth();
  const { lang: langParam } = await params;
  const lang = langParam ?? "en";
  const t = await getTranslations("Auth.login");

  const sp = await searchParams;
  const rp = sp?.redirect;
  const redirectTo = Array.isArray(rp) ? rp[0] : rp;

  if (session) {
    // If already signed in, go to the intended redirect or the localized account page
    const fallback = `/${lang}/auth/account`;
    const dest = redirectTo && redirectTo.startsWith("/") ? redirectTo : fallback;
    redirect(dest);
  }

  const registerHref = `/${lang}/auth/register` + (redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">{t("title")}</h1>
      {/* Wrap client component using useSearchParams in Suspense to satisfy Next.js CSR bailout requirements */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="mt-4 text-sm text-gray-500">
        {t("noAccount")} {" "}
        <a className="underline" href={registerHref}>
          {t("createOne")}
        </a>
      </p>
    </main>
  );
}
