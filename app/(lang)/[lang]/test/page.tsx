import { listProjects, createProject } from "./actions";

export default async function ProjectsPage() {
    const ownerId = "demo-user"; // replace with your auth user id
    const projects = await listProjects(ownerId);

    async function create(formData: FormData) {
        "use server";
        const name = String(formData.get("name") ?? "").trim();
        if (!name) return;
        const id = await createProject(ownerId, name);
        // redirect
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
                    <a
                        key={p.id}
                        href={`test/${p.id}`}
                        className="border rounded-xl p-4 hover:bg-gray-50"
                    >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs opacity-60 mt-1">id: {p.id}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
