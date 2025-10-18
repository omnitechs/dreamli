// app/login/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "../LoginForm";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { redirect?: string };
}) {
  const session = await auth();
  const lang = params?.lang ?? "en";

  if (session) {
    // If already signed in, go to the intended redirect or the localized account page
    const fallback = `/${lang}/auth/account`;
    const dest = searchParams?.redirect && searchParams.redirect.startsWith("/")
      ? searchParams.redirect
      : fallback;
    redirect(dest);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-gray-500">
        Don’t have an account?{" "}
        <a
          className="underline"
          href={`/${lang}/auth/register${searchParams?.redirect ? `?redirect=${encodeURIComponent(searchParams.redirect)}` : ""}`}
        >
          Create one
        </a>
      </p>
    </main>
  );
}
