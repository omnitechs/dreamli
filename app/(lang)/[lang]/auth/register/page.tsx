// app/(lang)/[lang]/auth/register/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "../RegisterForm";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  // Next 15: params/searchParams are async
  params: Promise<{ lang: string }>;
  // Next 15: searchParams must be awaited before using its properties
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const session = await auth();
  const { lang: langParam } = await params;
  const lang = langParam ?? "en";
  const t = await getTranslations("Auth.register");

  const sp = await searchParams;
  const redirectRaw = sp?.redirect;
  const redirectTo = Array.isArray(redirectRaw)
    ? redirectRaw[0]
    : redirectRaw;

  if (session) {
    const fallback = `/${lang}/auth/account`;
    const dest = redirectTo && redirectTo.startsWith("/") ? redirectTo : fallback;
    redirect(dest);
  }

  const loginHref = `/${lang}/auth/login` + (redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">{t("title")}</h1>
      {/* Wrap client component using useSearchParams in Suspense to satisfy Next.js CSR bailout requirements */}
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
      <p className="mt-4 text-sm text-gray-500">
        {t("haveAccount")} {" "}
        <a className="underline" href={loginHref}>
          {t("signIn")}
        </a>
      </p>
    </main>
  );
}
