
'use client';

import { useState } from 'react';

interface Memory {
  id: number;
  type: 'photo' | 'video' | 'note';
  content: string;
  caption?: string;
  date: string;
  isPublic: boolean;
  fileName?: string;
  fileSize?: string;
  likes?: number;
  comments?: {
    id: number;
    author: string;
    text: string;
    time: string;
  }[];
}

interface UserMemoriesProps {
  isOwner?: boolean;
}

export default function UserMemories({ isOwner = false }: UserMemoriesProps) {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 1,
      type: 'video',
      content: 'https://www.youtube.com/embed/mWRc20Uhqfc',
      caption: 'Adam\'s first day with his Dreamli!',
      date: 'June 22, 2024',
      isPublic: false,
      likes: 12,
      comments: [
        { id: 1, author: 'Grandma Sarah', text: 'So sweet! ', time: '2 hours ago' },
        { id: 2, author: 'Uncle Mike', text: 'He looks so happy!', time: '1 hour ago' }
      ]
    },
    {
      id: 2,
      type: 'video',
      content: 'https://www.youtube.com/embed/SxtsbCTxiuA',
      caption: 'Adam coloring his practice model',
      date: 'June 23, 2024',
      isPublic: false,
      likes: 8,
      comments: [
        { id: 1, author: 'Aunt Lisa', text: 'Adorable! ', time: '3 hours ago' }
      ]
    },
    {
      id: 3,
      type: 'note',
      content: 'He practices so hard to make his doll perfect.',
      caption: 'He draws and paints much more than before.',
      date: 'June 24, 2024',
      isPublic: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [newMemory, setNewMemory] = useState({
    type: 'photo' as 'photo' | 'video' | 'note',
    content: '',
    caption: '',
    isPublic: true,
    selectedFile: null as File | null,
    fileName: '',
    fileSize: ''
  });
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [showCommentSections, setShowCommentSections] = useState<{ [key: number]: boolean }>([]);
  const [viewerName, setViewerName] = useState('');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [tempName, setTempName] = useState('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB' ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File, isEdit: boolean = false) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be smaller than 50MB');
      return;
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/mov', 'video/avi', 'video/webm'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image (JPG, PNG, GIF) or video (MP4, MOV, AVI, WEBM) file');
      return;
    }

    const fileType = file.type.startsWith('image/') ? 'photo' : 'video';
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;

      if (isEdit && editingMemory) {
        setEditingMemory({
          ...editingMemory,
          type: fileType,
          content: result,
          fileName: file.name,
          fileSize: formatFileSize(file.size)
        });
        setEditingFile(file);
      } else {
        setNewMemory({
          ...newMemory,
          type: fileType,
          content: result,
          selectedFile: file,
          fileName: file.name,
          fileSize: formatFileSize(file.size)
        });
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAddMemory = () => {
    if (newMemory.type === 'note' && !newMemory.content.trim()) return;
    if ((newMemory.type === 'photo' || newMemory.type === 'video') && !newMemory.selectedFile && !newMemory.content.trim()) return;

    const memory: Memory = {
      id: Date.now(),
      type: newMemory.type,
      content: newMemory.content,
      caption: newMemory.caption || undefined,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      isPublic: newMemory.isPublic,
      fileName: newMemory.fileName || undefined,
      fileSize: newMemory.fileSize || undefined
    };

    setMemories([...memories, memory]);
    setNewMemory({
      type: 'photo',
      content: '',
      caption: '',
      isPublic: true,
      selectedFile: null,
      fileName: '',
      fileSize: ''
    });
    setShowAddModal(false);
  };

  const handleEditMemory = () => {
    if (!editingMemory) return;
    if (editingMemory.type === 'note' && !editingMemory.content.trim()) return;
    if ((editingMemory.type === 'photo' || editingMemory.type === 'video') && !editingMemory.content.trim()) return;

    setMemories(memories.map(memory =>
      memory.id === editingMemory.id ? editingMemory : memory
    ));
    setEditingMemory(null);
    setEditingFile(null);
    setShowEditModal(false);
  };

  const openEditModal = (memory: Memory) => {
    setEditingMemory({ ...memory });
    setEditingFile(null);
    setShowEditModal(true);
  };

  const toggleVisibility = (id: number) => {
    setMemories(memories.map(memory =>
      memory.id === id ? { ...memory, isPublic: !memory.isPublic } : memory
    ));
  };

  const deleteMemory = (id: number) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  const addComment = (memoryId: number) => {
    const commentText = newComments[memoryId]?.trim();
    if (!commentText || !viewerName.trim()) return;

    const newComment = {
      id: Date.now(),
      author: viewerName,
      text: commentText,
      time: 'Now'
    };

    setMemories(memories.map(memory =>
      memory.id === memoryId
        ? { ...memory, comments: [...(memory.comments || []), newComment] }
        : memory
    ));

    setNewComments({ ...newComments, [memoryId]: '' });
  };

  const toggleCommentSection = (memoryId: number) => {
    setShowCommentSections({
      ...showCommentSections,
      [memoryId]: !showCommentSections[memoryId]
    });
  };

  const handleNameEdit = () => {
    setTempName(viewerName);
    setShowNameEdit(true);
  };

  const saveNameEdit = () => {
    if (tempName.trim()) {
      setViewerName(tempName.trim());
    }
    setShowNameEdit(false);
    setTempName('');
  };

  const cancelNameEdit = () => {
    setShowNameEdit(false);
    setTempName('');
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Moments</h2>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <i className="ri-add-line text-lg"></i>
              <span>Add Memory</span>
            </div>
          </button>
        )}
      </div>

      {/* Viewer Name Input (for non-owners) */}
      {!isOwner && !viewerName && (
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
              <i className="ri-user-line text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">Welcome to Adam's memories!</h3>
              <input
                type="text"
                value={viewerName}
                onChange={(e) => setViewerName(e.target.value)}
                placeholder="Enter your name to leave comments"
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Viewer Name Display (for non-owners who have entered their name) */}
      {!isOwner && viewerName && (
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-lg"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commenting as</p>
                <p className="font-semibold text-gray-800">{viewerName}</p>
              </div>
            </div>
            <button
              onClick={handleNameEdit}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              title="Edit name"
            >
              <i className="ri-edit-line text-sm text-gray-600"></i>
            </button>
          </div>
        </div>
      )}

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            {/* Content Section */}
            <div className="relative">
              {memory.type === 'photo' && (
                <img
                  src={memory.content}
                  alt="Memory"
                  className="w-full h-48 object-cover object-top"
                />
              )}

              {memory.type === 'video' && (
                <iframe
                  src={memory.content}
                  title="Memory video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-48"
                ></iframe>
              )}

              {memory.type === 'note' && (
                <div className="p-6 bg-gradient-to-br from-[#FFF5F5] to-[#F0F8FF] min-h-[12rem] flex items-center">
                  <p className="text-gray-700 leading-relaxed">{memory.content}</p>
                </div>
              )}

              {/* Visibility indicator */}
              <div className="absolute top-3 right-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${memory.isPublic ? 'bg-green-500' : 'bg-gray-500'}`}>
                  <i className={`${memory.isPublic ? 'ri-eye-line' : 'ri-eye-off-line'} text-white text-sm`}></i>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-4">
              {/* Caption */}
              {memory.caption && (
                <h3 className="text-gray-800 font-semibold text-lg leading-tight">{memory.caption}</h3>
              )}

              {/* File info */}
              {memory.fileName && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <i className={`${memory.type === 'photo' ? 'ri-image-line' : 'ri-video-line'} text-base`}></i>
                  <span className="truncate">{memory.fileName}</span>
                  {memory.fileSize && <span>({memory.fileSize})</span>}
                </div>
              )}

              {/* Likes and Comments Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {memory.likes !== undefined && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <i className="ri-heart-line text-base"></i>
                      <span>{memory.likes} likes</span>
                    </div>
                  )}
                  <button
                    onClick={() => toggleCommentSection(memory.id)}
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <i className="ri-chat-3-line text-base"></i>
                    <span>{memory.comments?.length || 0} comments</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showCommentSections[memory.id] && (
                <div className="space-y-3">
                  {/* Existing Comments */}
                  {memory.comments && memory.comments.length > 0 && (
                    <div className="space-y-3 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-4 max-h-48 overflow-y-auto border border-purple-100">
                      {memory.comments.map((comment) => (
                        <div key={comment.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50 shadow-sm">
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="ri-user-smile-line text-xs text-white"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-purple-800">{comment.author}:</span>
                              <span className="text-sm text-gray-700 ml-1">{comment.text}</span>
                              <div className="mt-1">
                                <span className="text-xs text-purple-500 bg-purple-100 px-2 py-1 rounded-full">{comment.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Comment */}
                  {viewerName && (
                    <div className="flex space-x-2 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-2xl border border-green-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-chat-smile-3-line text-sm text-white"></i>
                      </div>
                      <input
                        type="text"
                        value={newComments[memory.id] || ''}
                        onChange={(e) => setNewComments({ ...newComments, [memory.id]: e.target.value })}
                        placeholder="Write a happy comment... 😊"
                        maxLength={200}
                        className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 outline-none transition-colors text-sm shadow-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addComment(memory.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => addComment(memory.id)}
                        disabled={!newComments[memory.id]?.trim()}
                        className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        <i className="ri-heart-3-line text-white text-sm"></i>
                      </button>
                    </div>
                  )}

                  {/* Name prompt for non-owners */}
                  {!isOwner && !viewerName && (
                    <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-emotion-happy-line text-lg text-white"></i>
                      </div>
                      <p className="text-sm text-pink-600 font-medium">Join the conversation! 🎉</p>
                      <p className="text-xs text-pink-500 mt-1">Enter your name above to spread some joy</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">{memory.date}</span>

                {isOwner && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleVisibility(memory.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                      title={memory.isPublic ? 'Make private' : 'Make public'}
                    >
                      <i className={`${memory.isPublic ? 'ri-eye-line' : 'ri-eye-off-line'} text-sm text-gray-600`}></i>
                    </button>
                    <button
                      onClick={() => openEditModal(memory)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Edit memory"
                    >
                      <i className="ri-edit-line text-sm text-blue-600"></i>
                    </button>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete memory"
                    >
                      <i className="ri-delete-bin-line text-sm text-red-600"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-camera-line text-3xl text-white"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No memories yet</h3>
          <p className="text-gray-600 mb-6">Start creating beautiful memories with your Dreamli!</p>
          {isOwner && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Add First Memory
            </button>
          )}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Memory</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Type
                  </label>
                  <div className="flex space-x-2">
                    {(['photo', 'video', 'note'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewMemory({ ...newMemory, type, content: '', selectedFile: null, fileName: '', fileSize: '' })}
                        className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap capitalize ${newMemory.type === type ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {newMemory.type === 'note' ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write something
                      </label>
                      <textarea
                        value={newMemory.content}
                        onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                        placeholder="Share your thoughts or a special moment..."
                        maxLength={500}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm resize-none"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload {newMemory.type === 'photo' ? 'Image' : 'Video'}
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept={newMemory.type === 'photo' ? 'image/jpeg,image/png,image/gif' : 'video/mp4,video/mov,video/avi,video/webm'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#FFB6C1] file:to-[#B9E4C9] file:text-gray-800 hover:file:from-[#FFA0B4] hover:file:to-[#a8d9b8] file:cursor-pointer"
                        />

                        {newMemory.selectedFile && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                              <i className={`${newMemory.type === 'photo' ? 'ri-image-line' : 'ri-video-line'} text-sm text-white`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{newMemory.fileName}</p>
                              <p className="text-xs text-gray-500">{newMemory.fileSize}</p>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          Supported formats: {newMemory.type === 'photo' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI, WEBM'} (Max 50MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={newMemory.caption}
                    onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                    placeholder="Add a caption..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNewMemory({ ...newMemory, isPublic: !newMemory.isPublic })}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${newMemory.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${newMemory.isPublic ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                  <span className="text-sm text-gray-700">
                    {newMemory.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMemory}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Add Memory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {showEditModal && editingMemory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Memory</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Type
                  </label>
                  <div className="flex space-x-2">
                    {(['photo', 'video', 'note'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setEditingMemory({ ...editingMemory, type, content: type === 'note' ? editingMemory.content : '', fileName: '', fileSize: '' })}
                        className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap capitalize ${editingMemory.type === type ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {editingMemory.type === 'note' ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write something
                      </label>
                      <textarea
                        value={editingMemory.content}
                        onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value })}
                        placeholder="Share your thoughts or a special moment..."
                        maxLength={500}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm resize-none"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload {editingMemory.type === 'photo' ? 'Image' : 'Video'}
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept={editingMemory.type === 'photo' ? 'image/jpeg,image/png,image/gif' : 'video/mp4,video/mov,video/avi,video/webm'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file, true);
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#FFB6C1] file:to-[#B9E4C9] file:text-gray-800 hover:file:from-[#FFA0B4] hover:file:to-[#a8d9b8] file:cursor-pointer"
                        />

                        {(editingFile || editingMemory.fileName) && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                              <i className={`${editingMemory.type === 'photo' ? 'ri-image-line' : 'ri-video-line'} text-sm text-white`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {editingFile ? editingFile.name : editingMemory.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {editingFile ? formatFileSize(editingFile.size) : editingMemory.fileSize}
                              </p>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          Supported formats: {editingMemory.type === 'photo' ? 'JPG, PNG, GIF' : 'MP4, MOV, AVI, WEBM'} (Max 50MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={editingMemory.caption || ''}
                    onChange={(e) => setEditingMemory({ ...editingMemory, caption: e.target.value })}
                    placeholder="Add a caption..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditingMemory({ ...editingMemory, isPublic: !editingMemory.isPublic })}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${editingMemory.isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${editingMemory.isPublic ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </button>
                  <span className="text-sm text-gray-700">
                    {editingMemory.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditMemory}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Edit Modal */}
      {showNameEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Your Name</h3>
                <button
                  onClick={cancelNameEdit}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                    autoFocus
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {tempName.length}/50 characters
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={cancelNameEdit}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNameEdit}
                    disabled={!tempName.trim()}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
