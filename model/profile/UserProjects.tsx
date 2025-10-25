
'use client';

import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { useLikeModelMutation, useUnlikeModelMutation } from '@/app/(lang)/[lang]/ai/services/api';
import { makeToggleLikeHandler } from '@/components/projectCardActions';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Project {
  id: string; // projectId
  name: string;
  thumbnail: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  isPublic: boolean;
  representativeModelId?: string; // any SUCCEEDED model within the project
  userLiked?: boolean; // whether current viewer liked representative model
}

interface UserProjectsProps {
  projects: Project[];
  isOwnProfile: boolean;
  baseLang?: string; // e.g., 'en'
}

function slugify(s?: string) {
  const base = (s || '').toLowerCase();
  return base
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'project';
}

export default function UserProjects({ projects, isOwnProfile, baseLang }: UserProjectsProps) {
  const { data: session } = useSession();
  const isAuthed = !!(session as any)?.user?.id;
  const pathname = usePathname();
  const router = useRouter();
  const [likeModel] = useLikeModelMutation();
  const [unlikeModel] = useUnlikeModelMutation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isOwnProfile ? 'Your Projects' : 'Projects'}
        </h2>
        {isOwnProfile && (
          <Link
            href={`/${baseLang || 'en'}/ai`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Create New
          </Link>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const href = `/${baseLang || 'en'}/ai/projects/${encodeURIComponent(slugify(project.name))}/${encodeURIComponent(project.id)}`;
            const canInteract = !!project.representativeModelId;
            return (
              <ProjectCard
                key={project.id}
                href={href}
                title={project.name}
                imageUrl={project.thumbnail}
                likesCount={project.likes}
                commentsCount={project.comments}
                viewsCount={project.views}
                likedByMe={canInteract ? !!project.userLiked : false}
                onToggleLike={canInteract ? makeToggleLikeHandler({
                  lang: baseLang || 'en',
                  pathname,
                  router,
                  isAuthed,
                  likeModel: (args: { modelId: string }) => likeModel(args),
                  unlikeModel: (args: { modelId: string }) => unlikeModel(args),
                  redirectFallbackPath: '/profile',
                })(project.representativeModelId!) : undefined}
                badgeText={!project.isPublic && isOwnProfile ? 'Private' : undefined}
                metaText={new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-folder-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isOwnProfile ? 'No projects yet' : 'No public projects'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isOwnProfile 
              ? 'Start creating your first AI-generated 3D project!' 
              : 'This user hasn\'t shared any public projects yet.'
            }
          </p>
          {isOwnProfile && (
            <Link
              href={`/${baseLang || 'en'}/ai`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              Create Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
