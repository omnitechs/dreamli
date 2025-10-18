// app/register/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "../RegisterForm";

export default async function RegisterPage({
                                               searchParams,
                                           }: {
    searchParams?: { redirect?: string };
}) {
    const session = await auth();
    if (session) {
        redirect(searchParams?.redirect ?? "/");
    }

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
            <RegisterForm />
            <p className="mt-4 text-sm text-gray-500">
                Already have an account?{" "}
                <a
                    className="underline"
                    href={`/login${searchParams?.redirect ? `?redirect=${encodeURIComponent(searchParams.redirect)}` : ""}`}
                >
                    Sign in
                </a>
            </p>
        </main>
    );
}
