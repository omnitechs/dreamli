// app/projects/[projectId]/page.tsx
import { initProject } from "./actions";
import ProjectClient from "./project-client";

type Props = { params: { projectId: string } };

export default async function ProjectPage({ params }: Props) {
    const projectId = await params.projectId;
    const initial = await initProject(projectId);
    return <ProjectClient initial={initial} />;
}