
'use client';

import { useState } from 'react';
import { ProjectState } from '../../types';
import { actionClearSelection, actionBulkAssignFromSelection } from '../actions';
import { Check, X, Grid } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  projectId: string;
  headId: string;
  onStateUpdate: (state: ProjectState) => void;
}

export function SelectionToolbar({ selectedCount, projectId, headId, onStateUpdate }: SelectionToolbarProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleClearSelection = async () => {
    if (loading) return;

    setLoading('clear');
    try {
      const updatedState = await actionClearSelection(projectId, headId);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to clear selection:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleBulkAssign = async () => {
    if (loading) return;

    setLoading('assign');
    try {
      const updatedState = await actionBulkAssignFromSelection(projectId, headId);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to bulk assign:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-700">
          <Check className="w-4 h-4" />
          <span className="font-medium text-sm">
            Selected: {selectedCount}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClearSelection}
            disabled={loading !== null}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
          >
            {loading === 'clear' ? (
              <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <X className="w-3 h-3" />
            )}
            Clear Selection
          </button>

          <button
            onClick={handleBulkAssign}
            disabled={loading !== null}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
          >
            {loading === 'assign' ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Grid className="w-3 h-3" />
            )}
            Assign All
          </button>
        </div>
      </div>
    </div>
  );
}
