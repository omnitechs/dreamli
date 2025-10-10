import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProjectsPage() {
    // replace with your authed user id
    const ownerId = "demo-user";
    const projects = await prisma.project.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
    });

    async function create(formData: FormData) {
        "use server";
        const name = String(formData.get("name") ?? "").trim();
        if (!name) return;
        await prisma.project.create({ data: { ownerId, name } });
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Projects</h1>

            <form action={create} className="flex gap-2">
                <input name="name" className="border rounded px-3 py-2 flex-1" placeholder="New project name" />
                <button className="border rounded px-3 py-2">Create</button>
            </form>

            <div className="grid sm:grid-cols-2 gap-3">
                {projects.map(p => (
                    <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="border rounded-xl p-4 hover:bg-gray-50"
                    >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs opacity-60 mt-1">id: {p.id}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
