// app/projects/[projectId]/page.tsx
import { ProjectWorkspace } from './ProjectWorkspace';

export async function generateStaticParams() {
    // keep your static params if you want, or drop this
    return [
        { projectId: 'demo' },
    ];
}

export default function ProjectPage({ params }: { params: { projectId: string } }) {
    return <ProjectWorkspace projectId={params.projectId} />;
}
