// app/account/page.tsx
export const dynamic = "force-dynamic";

import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import {useSession} from "next-auth/react";

export default async function AccountPage() {
    const session = await auth();
    if (!session) {
        console.log("redirecting to login");
        // redirect(`/login?redirect=/account`); // or locale-aware path
    }

    async function signOutAction() {
        "use server";
        await signOut({ redirectTo: "/" });
    }

    return (
        <main className="mx-auto max-w-md p-6 space-y-4">
            <div>Signed in as <b>{session.user?.email}</b></div>
            <form action={signOutAction}>
                <button className="px-3 py-2 rounded border">Sign out</button>
            </form>
        </main>
    );
}
