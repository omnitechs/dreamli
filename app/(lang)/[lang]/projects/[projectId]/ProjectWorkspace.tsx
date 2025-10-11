
'use client';

import { useEffect, useState } from 'react';
import { ProjectState } from '../types';
import { initProject } from './actions';
import { CommitsPanel } from './components/CommitsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { GeneratorPanel } from './components/GeneratorPanel';

interface ProjectWorkspaceProps {
  projectId: string;
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const state = await initProject(projectId);
        setProjectState(state);
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!projectState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop 3-pane layout */}
        <div className="hidden xl:grid xl:grid-cols-[280px_minmax(0,0.7fr)_minmax(0,1fr)] min-h-screen">
        <CommitsPanel 
          commits={projectState.commits}
          headId={projectState.headId}
          projectId={projectId}
          onStateUpdate={setProjectState}
        />
        <MessagesPanel 
          messages={projectState.messages}
          projectId={projectId}
          headId={projectState.headId}
          models={(projectState.generator as any)?.models ?? []}
          onStateUpdate={setProjectState}
        />
        <GeneratorPanel 
          generator={projectState.generator}
          headId={projectState.headId}
          projectId={projectId}
          onStateUpdate={setProjectState}
        />
      </div>

      {/* Mobile/tablet stacked layout */}
      <div className="xl:hidden">
        <div className="space-y-6 p-4">
          <CommitsPanel 
            commits={projectState.commits}
            headId={projectState.headId}
            projectId={projectId}
            onStateUpdate={setProjectState}
          />
          <MessagesPanel 
            messages={projectState.messages}
            projectId={projectId}
            headId={projectState.headId}
            models={(projectState.generator as any)?.models ?? []}
            onStateUpdate={setProjectState}
          />
          <GeneratorPanel 
            generator={projectState.generator}
            headId={projectState.headId}
            projectId={projectId}
            onStateUpdate={setProjectState}
          />
        </div>
      </div>
    </div>
  );
}
