
'use client';

import { useState } from 'react';
import { GeneratorSnapshot, ProjectState } from '../../types';
import { actionSetMode, actionSetPrompt } from '../actions';
import { AlignLeft, Image } from 'lucide-react';

interface ModePromptCardProps {
  generator: GeneratorSnapshot;
  projectId: string;
  headId: string;
  onStateUpdate: (state: ProjectState) => void;
}

export function ModePromptCard({ generator, projectId, headId, onStateUpdate }: ModePromptCardProps) {
  const [prompt, setPrompt] = useState(generator.textPrompt);
  const [saving, setSaving] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);

  const handleModeSwitch = async (mode: 'text' | 'image') => {
    if (mode === generator.type || switchingMode) return;

    setSwitchingMode(true);
    try {
      const updatedState = await actionSetMode(projectId, headId, mode);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to switch mode:', error);
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleSavePrompt = async () => {
    if (prompt === generator.textPrompt || saving) return;

    setSaving(true);
    try {
      const updatedState = await actionSetPrompt(projectId, headId, prompt);
      onStateUpdate(updatedState);
    } catch (error) {
      console.error('Failed to save prompt:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePromptBlur = () => {
    if (prompt !== generator.textPrompt) {
      handleSavePrompt();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSavePrompt();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Mode & Prompt</h3>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeSwitch('text')}
          disabled={switchingMode}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${generator.type === 'text'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }
            ${switchingMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <AlignLeft className="w-4 h-4" />
          Text mode
        </button>
        <button
          onClick={() => handleModeSwitch('image')}
          disabled={switchingMode}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap
            ${generator.type === 'image'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }
            ${switchingMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Image className="w-4 h-4" />
          Image mode
        </button>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Text Prompt {generator.type === 'image' && '(disabled in image mode)'}
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onBlur={handlePromptBlur}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create in 3D..."
            disabled={generator.type === 'image'}
            className={`
              w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm
              ${generator.type === 'image' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            `}
            rows={3}
          />
          {prompt !== generator.textPrompt && generator.type === 'text' && (
            <button
              onClick={handleSavePrompt}
              disabled={saving}
              className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {saving ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
