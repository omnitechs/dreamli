// app/login/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "../LoginForm";

export default async function LoginPage({
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
            <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
            <LoginForm />
            <p className="mt-4 text-sm text-gray-500">
                Don’t have an account?{" "}
                <a
                    className="underline"
                    href={`/nl/auth/register${searchParams?.redirect ? `?redirect=${encodeURIComponent(searchParams.redirect)}` : ""}`}
                >
                    Create one
                </a>
            </p>
        </main>
    );
}
