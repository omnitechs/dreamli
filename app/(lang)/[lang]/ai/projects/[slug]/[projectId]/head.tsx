import { prisma } from '@/lib/prisma';

function titleize(s?: string | null) {
  return (s || 'Project').toString();
}

export default async function Head({ params }: { params: { slug: string; projectId: string } }) {
  const { projectId } = params;
  let projectName = 'Project';
  try {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { name: true } });
    if (project?.name) projectName = project.name;
  } catch {}
  const title = `${titleize(projectName)} – 3D Models`;
  const desc = `Browse all 3D models created in project "${projectName}".`;
  return (
    <>
      <title>{title}</title>
      <meta name="robots" content="index, follow" />
      <meta name="description" content={desc} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
    </>
  );
}
