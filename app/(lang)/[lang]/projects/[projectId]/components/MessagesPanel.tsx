
'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ProjectState } from '../../types';
import { actionPostMessage } from '../actions';
import { Send, User, Bot, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import {GeneratorModel3D} from "@/app/(lang)/[lang]/projects/classes/generator";

interface MessagesPanelProps {
  messages: Message[];
  projectId: string;
  headId: string;
  onStateUpdate: (state: ProjectState) => void;
  models: GeneratorModel3D[];
}

export function MessagesPanel({ messages, projectId, headId, onStateUpdate ,models}: MessagesPanelProps) {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;

    setSending(true);
    try {
      const updatedState = await actionPostMessage(projectId, headId, messageText.trim());
      onStateUpdate(updatedState);
      setMessageText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const toggleActionExpanded = (messageId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedActions(newExpanded);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'assistant':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user':
        return 'text-blue-600 bg-blue-50';
      case 'assistant':
        return 'text-green-600 bg-green-50';
      case 'system':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

    const pickModelUrl = (m: any): string | undefined => {
        return m?.modelUrls?.glb || m?.modelUrls?.fbx || m?.modelUrls?.obj || m?.modelUrls?.usdz;
    }

  return (
    <div className="bg-white xl:border-r border-gray-200 xl:h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-semibold text-gray-900">Messages & Logs</h2>
      </div>

      {/* Messages List */}
        <div className="px-4 pt-4">
            {Array.isArray(models) && models.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Generated 3D Models</h3>
                        <span className="text-xs text-gray-500">{models.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {models.map((m: any) => {
                            const url = pickModelUrl(m);
                            const created = m?.createdAt ? new Date(m.createdAt).toLocaleString() : '';
                            return (
                                <div key={m?.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {m?.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={m.thumbnailUrl} alt="Model thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-xs text-gray-400">No thumbnail</div>
                                        )}
                                    </div>
                                    <div className="p-3 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {m?.provider && (
                                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {m.provider}
                    </span>
                                            )}
                                            {m?.kind && (
                                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {m.kind}
                    </span>
                                            )}
                                            {m?.stage && (
                                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      {m.stage}
                    </span>
                                            )}
                                        </div>
                                        {created && <div className="text-xs text-gray-500">{created}</div>}
                                        <div className="flex gap-2">
                                            {url && (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition"
                                                >
                                                    Open 3D
                                                </a>
                                            )}
                                            {m?.modelUrls?.glb && (
                                                <a
                                                    href={m.modelUrls.glb}
                                                    download
                                                    className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                                >
                                                    GLB
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group">
            {/* Message Header */}
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getRoleColor(message.role)}`}>
                {getRoleIcon(message.role)}
                <span className="font-medium capitalize">{message.role}</span>
              </div>
              <span>•</span>
              <span>{formatTime(message.createdAt)}</span>
            </div>

            {/* Message Content */}
            <div className="bg-gray-50 rounded-xl p-3 mb-2">
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>

            {/* Action Panel */}
            {message.action && (
              <div className="ml-4">
                <button
                  onClick={() => toggleActionExpanded(message.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {expandedActions.has(message.id) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  Action: {message.action.type}
                </button>
                
                {expandedActions.has(message.id) && (
                  <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                    <pre className="text-xs text-gray-300 overflow-auto">
                      {JSON.stringify(message.action, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bot className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Start by describing what you'd like to create</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your 3D project or ask a question..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={sending}
              rows={1}
            />
            <button
              type="submit"
              disabled={!messageText.trim() || sending}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Press Cmd/Ctrl + Enter to send</span>
            <span>{messageText.length}/1000</span>
          </div>
        </form>
      </div>
    </div>
  );
}
