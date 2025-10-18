// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const role = (session.user as any)?.role ?? "user";
    if (role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            creditsBalance: true,
            createdAt: true,
            role: true,
        },
    });

    return NextResponse.json({ ok: true, users });
}
