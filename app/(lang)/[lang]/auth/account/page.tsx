// app/account/page.tsx
import type {LanguageCode} from "@/config/i18n";

export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import AdminUsersManager from "./AdminUsersManager";
import AccountClient from "./AccountClient";

export default async function AccountPage(props: { params: Promise<{ lang: LanguageCode }> }) {
  const session = await auth();
    const { lang } = await props.params;
  if (!session) {
    redirect(`/${lang}/auth/login?redirect=/${lang}/auth/account`);
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
    <main className="mx-auto max-w-4xl p-6 md:p-8 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
        <AccountClient me={clientMe} lang={lang} />
      </section>

      {((session.user as any)?.role === "admin") && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">Admin</h2>
          <AdminUsersManager />
        </section>
      )}
    </main>
  );
}
