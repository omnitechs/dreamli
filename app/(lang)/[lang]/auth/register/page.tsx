// app/register/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "../RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  // Next 15: searchParams must be awaited before using its properties
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const session = await auth();

  const sp = await searchParams;
  const redirectRaw = sp?.redirect;
  const redirectTo = Array.isArray(redirectRaw)
    ? redirectRaw[0]
    : redirectRaw;

  if (session) {
    redirect(redirectTo ?? "/");
  }

  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <a className="underline" href={loginHref}>
          Sign in
        </a>
      </p>
    </main>
  );
}
