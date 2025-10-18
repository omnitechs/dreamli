// app/account/page.tsx
export const dynamic = "force-dynamic";

import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import AdminUsersManager from "./AdminUsersManager";
import AccountClient from "./AccountClient";

type Props = { params: { lang: string } };
export default async function AccountPage({ params }: Props) {
    const session = await auth();
    if (!session) {
        const lang = params?.lang ?? "en";
        redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account`);
    }

    async function signOutAction() {
        "use server";
        await signOut({ redirectTo: "/" });
    }

    // Load full user info including credits (defensive: prefer id, fallback to email)
    const userId = (session!.user as any)?.id as string | undefined;
    const userEmail = session.user?.email as string | undefined;

    let me = null as null | { id: string; name: string | null; email: string | null; createdAt: Date; role: any; creditsBalance: any };
    if (userId) {
        me = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true, role: true, creditsBalance: true },
        });
    } else if (userEmail) {
        me = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { id: true, name: true, email: true, createdAt: true, role: true, creditsBalance: true },
        });
    }

    const clientMe = me ? {
        id: me.id,
        name: me.name,
        email: me.email,
        role: String(me.role),
        creditsBalance: String(me.creditsBalance ?? '0.00'),
        createdAt: me.createdAt instanceof Date ? me.createdAt.toISOString() : String(me.createdAt),
    } : null;

    return (
        <main className="mx-auto max-w-3xl p-6 space-y-6">
            <section className="space-y-2">
                <h1 className="text-2xl font-semibold">My account</h1>
                <AccountClient me={clientMe} />
                <form action={signOutAction}>
                    <button className="px-3 py-2 rounded border">Sign out</button>
                </form>
            </section>

            {((session.user as any)?.role === "admin") && (
                <section>
                    <AdminUsersManager />
                </section>
            )}
        </main>
    );
}
