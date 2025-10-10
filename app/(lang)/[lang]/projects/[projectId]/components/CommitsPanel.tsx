
'use client';

import { useState } from 'react';
import { CommitJSON, ProjectState } from '../../types';
import { checkoutCommit } from '../actions';
import { Clock, Star, GitBranch } from 'lucide-react';

interface CommitsPanelProps {
  commits: CommitJSON[];
  headId: string;
  projectId: string;
  onStateUpdate: (state: ProjectState) => void;
}

export function CommitsPanel({ commits, headId, projectId, onStateUpdate }: CommitsPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectCommit = async (commitId: string) => {
    if (commitId === headId) return;

    setLoading(commitId);
    try {
      const updatedState = await checkoutCommit(projectId, commitId);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to checkout commit:', error);
    } finally {
      setLoading(null);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupCommitsByDate = (commits: CommitJSON[]) => {
    const groups: { [key: string]: CommitJSON[] } = {};
    commits.forEach(commit => {
      const dateKey = formatDate(commit.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(commit);
    });
    return groups;
  };

  const commitGroups = groupCommitsByDate(commits);

  return (
    <div className="bg-white border-r border-gray-200 xl:h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Commits
        </h2>
      </div>

      {/* Commits List */}
      <div className="flex-1 overflow-auto">
        {Object.entries(commitGroups).map(([dateGroup, dateCommits]) => (
          <div key={dateGroup} className="border-b border-gray-100 last:border-b-0">
            <div className="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              {dateGroup}
            </div>
            <div className="space-y-1 p-2">
              {dateCommits.map((commit) => (
                <div
                  key={commit.id}
                  onClick={() => handleSelectCommit(commit.id)}
                  className={`
                    relative rounded-xl p-3 cursor-pointer transition-all border
                    ${commit.id === headId 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }
                    ${loading === commit.id ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {loading === commit.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Commit Icon */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                      ${commit.isVersion 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {commit.isVersion ? (
                        <Star className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    {/* Commit Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {commit.id.substring(0, 8)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(commit.timestamp)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-900 font-medium leading-tight">
                        {commit.summary || 'Untitled commit'}
                      </p>

                      {commit.isVersion && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Star className="w-3 h-3 mr-1" />
                            Version
                          </span>
                        </div>
                      )}

                      {commit.model && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
                            3D Model Ready
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {commits.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <GitBranch className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No commits yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
