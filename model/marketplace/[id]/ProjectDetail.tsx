'use client';

import { useState } from 'react';
import { Heart, Share2, Download, Send, Paperclip, X, MessageCircle, Image as ImageIcon, FileText } from 'lucide-react';
import Image from 'next/image';

const mockProject = {
  id: '9',
  name: 'Futuristic Spaceship',
  creator: 'Alex Chen',
  creatorAvatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20young%20asian%20male%20designer%20with%20clean%20simple%20white%20background%20studio%20lighting%20modern%20minimal%20aesthetic&width=100&height=100&seq=creator9&orientation=squarish',
  likes: 234,
  comments: 45,
  createdAt: '2024-01-15',
  description: 'A sleek futuristic spaceship design with advanced propulsion systems and modular components.',
  modelUrl: 'https://example.com/model.glb',
  images: {
    front: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20front%20view%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft&width=400&height=400&seq=ship9front&orientation=squarish',
    back: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20rear%20view%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft%20engines&width=400&height=400&seq=ship9back&orientation=squarish',
    side: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20side%20profile%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft&width=400&height=400&seq=ship9side&orientation=squarish',
    threeQuarter: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20three%20quarter%20angle%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft&width=400&height=400&seq=ship9three&orientation=squarish',
    top: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20top%20down%20view%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft&width=400&height=400&seq=ship9top&orientation=squarish',
    bottom: 'https://readdy.ai/api/search-image?query=futuristic%20sleek%20spaceship%20bottom%20view%20white%20simple%20background%203d%20render%20clean%20modern%20design%20sci%20fi%20spacecraft&width=400&height=400&seq=ship9bottom&orientation=squarish',
  },
  chat: [
    { id: '1', role: 'user', content: 'Create a futuristic spaceship with sleek design', timestamp: '2024-01-15 10:30' },
    { id: '2', role: 'assistant', content: 'I\'ll create a futuristic spaceship design. Starting with the basic hull structure...', timestamp: '2024-01-15 10:31' },
    { id: '3', role: 'user', content: 'Make it more aerodynamic', timestamp: '2024-01-15 10:35' },
    { id: '4', role: 'assistant', content: 'Updated the design with improved aerodynamics and streamlined surfaces.', timestamp: '2024-01-15 10:36' },
  ],
  existingComments: [
    {
      id: '1',
      author: 'Sarah Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20young%20woman%20designer%20with%20clean%20simple%20white%20background%20studio%20lighting%20modern%20minimal%20aesthetic&width=80&height=80&seq=commenter1&orientation=squarish',
      content: 'This is absolutely stunning! The aerodynamic design is perfect.',
      timestamp: '2024-01-16 14:20',
      attachments: []
    },
    {
      id: '2',
      author: 'Mike Torres',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20young%20male%20designer%20with%20clean%20simple%20white%20background%20studio%20lighting%20modern%20minimal%20aesthetic&width=80&height=80&seq=commenter2&orientation=squarish',
      content: 'Love the propulsion system details. Could you share the technical specs?',
      timestamp: '2024-01-16 16:45',
      attachments: [
        { type: 'image', url: 'https://readdy.ai/api/search-image?query=technical%20blueprint%20spaceship%20propulsion%20system%20white%20background%20engineering%20diagram%20clean%20modern&width=300&height=200&seq=attach1&orientation=landscape', name: 'propulsion-ref.jpg' }
      ]
    }
  ]
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mockProject.likes);
  const [commentText, setCommentText] = useState('');
  const [attachments, setAttachments] = useState<Array<{ type: string; url: string; name: string }>>([]);
  const [comments, setComments] = useState(mockProject.existingComments);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePostComment = () => {
    if (commentText.trim() || attachments.length > 0) {
      const newComment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20young%20person%20designer%20with%20clean%20simple%20white%20background%20studio%20lighting%20modern%20minimal%20aesthetic&width=80&height=80&seq=you&orientation=squarish',
        content: commentText,
        timestamp: new Date().toLocaleString(),
        attachments: attachments
      };
      setComments([...comments, newComment]);
      setCommentText('');
      setAttachments([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={mockProject.creatorAvatar}
                alt={mockProject.creator}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockProject.name}</h1>
                <p className="text-sm text-gray-600">by {mockProject.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border-2 border-red-200'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-200 transition-colors whitespace-nowrap cursor-pointer">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* 3D Model Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3D Model</h2>
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-box-3-line text-4xl text-blue-600"></i>
              </div>
              <p className="text-gray-600 font-medium">Interactive 3D Model Viewer</p>
              <p className="text-sm text-gray-500 mt-2">Rotate, zoom, and explore the model</p>
            </div>
          </div>
        </section>

        {/* Images Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reference Images</h2>
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(mockProject.images).map(([view, url]) => (
              <div key={view} className="group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-200">
                  <Image
                    src={url}
                    alt={view}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 capitalize text-center">
                  {view === 'threeQuarter' ? '¾ View' : view}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Creation Chat Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Creation Process</h2>
          <div className="space-y-4">
            {mockProject.chat.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <i className="ri-user-line text-lg"></i>
                  ) : (
                    <i className="ri-robot-line text-lg"></i>
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Composer */}
          <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                  <Paperclip className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Attach</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleAddAttachment}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </label>
                <span className="text-xs text-gray-500">
                  {commentText.length}/500
                </span>
              </div>
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() && attachments.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="relative group bg-white rounded-lg p-2 border border-gray-200"
                  >
                    {attachment.type === 'image' ? (
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                        <FileText className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={comment.avatar}
                  alt={comment.author}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    
                    {/* Comment Attachments */}
                    {comment.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {comment.attachments.map((attachment, index) => (
                          <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                            {attachment.type === 'image' ? (
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                width={200}
                                height={150}
                                className="w-48 h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              />
                            ) : (
                              <div className="w-48 h-32 bg-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                                <FileText className="w-8 h-8 text-gray-600" />
                                <span className="text-xs text-gray-600 px-2 text-center truncate w-full">
                                  {attachment.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}