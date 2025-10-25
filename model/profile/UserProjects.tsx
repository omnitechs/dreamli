
'use client';

import Link from 'next/link';

interface Project {
  id: string; // projectId
  name: string;
  thumbnail: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  isPublic: boolean;
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
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${baseLang || 'en'}/ai/projects/${encodeURIComponent(slugify(project.name))}/${encodeURIComponent(project.id)}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="aspect-video relative overflow-hidden">
                  {/* Using img to avoid remote domain restrictions; UI remains identical */}
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {!project.isPublic && isOwnProfile && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Private
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <i className="ri-heart-line text-red-500"></i>
                      <span>{project.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-eye-line"></i>
                      <span>{project.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-chat-3-line"></i>
                      <span>{project.comments}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
