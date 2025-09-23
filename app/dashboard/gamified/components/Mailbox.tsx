'use client';

import { useState } from 'react';

interface MailboxProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'update' | 'milestone' | 'system' | 'celebration' | 'tip';
  title: string;
  content: string;
  sender: string;
  date: string;
  isRead: boolean;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'video' | 'badge';
  priority: 'low' | 'medium' | 'high';
  animation?: string;
}

export default function Mailbox({ onBack }: MailboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'updates' | 'milestones'>('all');
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-001',
      type: 'milestone',
      title: '🎉 Congratulations! You\'ve reached Level 12!',
      content: 'Amazing work, Dream Creator! You\'ve just leveled up to Level 12 and unlocked new magical abilities. Your dedication to creating wonderful Dreamlis has paid off!\n\nNew rewards unlocked:\n• 500 bonus Dream Points\n• Exclusive "Master Builder" badge\n• Access to premium creation tools\n• Special rainbow effects for your creations\n\nKeep up the fantastic work and continue building your dream world!',
      sender: 'Dreamli Level System',
      date: '2024-01-25T10:30:00Z',
      isRead: false,
      hasAttachment: true,
      attachmentType: 'badge',
      priority: 'high',
      animation: 'celebration'
    },
    {
      id: 'msg-002',
      type: 'update',
      title: '🐉 Your Rainbow Dragon is being painted!',
      content: 'Great news! Your amazing Rainbow Dragon creation has moved to the painting stage. Our talented artists are carefully hand-painting every detail to bring your imagination to life.\n\nCurrent status: Painting Phase (Step 3 of 4)\nEstimated completion: 2 days\nNext update: When quality check begins\n\nYour dragon is looking absolutely magical! The rainbow wings are particularly stunning with their gradient colors.',
      sender: 'Dreamli Workshop',
      date: '2024-01-24T14:15:00Z',
      isRead: false,
      hasAttachment: true,
      attachmentType: 'image',
      priority: 'medium',
      animation: 'sparkle'
    },
    {
      id: 'msg-003',
      type: 'celebration',
      title: '🔥 7-Day Streak Achievement!',
      content: 'Wow! You\'ve maintained a 7-day creation streak! Your consistency in creating and exploring Dreamli is absolutely fantastic.\n\nStreak Rewards:\n• 300 Dream Points bonus\n• "Weekly Warrior" badge\n• Streak multiplier activated (x1.5 points for next 3 days)\n• Exclusive flame effect unlocked\n\nCan you make it to 14 days? We believe in you!',
      sender: 'Achievement System',
      date: '2024-01-23T09:00:00Z',
      isRead: true,
      hasAttachment: true,
      attachmentType: 'badge',
      priority: 'medium',
      animation: 'fire'
    },
    {
      id: 'msg-004',
      type: 'tip',
      title: '💡 Creator Tip: Magical Color Combinations',
      content: 'Did you know you can create magical color effects by combining certain colors in your drawings?\n\nTry these magical combinations:\n• Purple + Gold = Royal Magic Effect\n• Blue + Silver = Frost Magic\n• Red + Orange = Fire Magic\n• Green + Yellow = Nature Magic\n\nExperiment with these combinations in your next creation and watch the magic happen!',
      sender: 'Dreamli Tips',
      date: '2024-01-22T16:45:00Z',
      isRead: true,
      priority: 'low',
      animation: 'rainbow'
    },
    {
      id: 'msg-005',
      type: 'system',
      title: '🆕 New Features Available!',
      content: 'We\'ve added some exciting new features to make your Dreamli experience even more magical:\n\n✨ New Creation Tools:\n• Magic Wand tool for instant effects\n• Color mixer with 1000+ new colors\n• 3D preview with 360° rotation\n• Voice commands for hands-free creating\n\n🎮 Gamification Updates:\n• New achievement categories\n• Weekly challenges with mega rewards\n• Friend system and collaboration tools\n\nUpdate your app to access these magical new features!',
      sender: 'Dreamli Development Team',
      date: '2024-01-21T12:00:00Z',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 'msg-006',
      type: 'update',
      title: '📦 Your Unicorn Castle is ready for shipping!',
      content: 'Fantastic news! Your beautiful Unicorn Castle has completed all production stages and is now ready for its magical journey to your home.\n\nShipping Details:\n• Tracking Number: UC-2024-MAG-001\n• Estimated Delivery: January 28, 2024\n• Shipping Method: Express Magic Delivery\n\nYour package includes:\n• Your custom Unicorn Castle\n• Assembly guide with fun illustrations\n• Bonus unicorn figure\n• Magic sparkle dust (safe, washable glitter)\n\nGet ready for an amazing unboxing experience!',
      sender: 'Dreamli Shipping',
      date: '2024-01-20T11:30:00Z',
      isRead: true,
      hasAttachment: true,
      attachmentType: 'image',
      priority: 'high'
    }
  ]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'milestone': return 'ri-trophy-line';
      case 'update': return 'ri-refresh-line';
      case 'system': return 'ri-settings-line';
      case 'celebration': return 'ri-cake-line';
      case 'tip': return 'ri-lightbulb-line';
      default: return 'ri-mail-line';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'from-yellow-400 to-orange-400';
      case 'update': return 'from-blue-400 to-indigo-400';
      case 'system': return 'from-gray-400 to-gray-500';
      case 'celebration': return 'from-pink-400 to-purple-400';
      case 'tip': return 'from-green-400 to-teal-400';
      default: return 'from-blue-400 to-indigo-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !message.isRead;
    if (filter === 'updates') return message.type === 'update';
    if (filter === 'milestones') return message.type === 'milestone';
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
      </button>

      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="relative w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
          <i className="ri-mail-line text-white text-3xl"></i>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-sm font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Magic Mailbox</h1>
        <p className="text-gray-600">Check your updates, achievements, and magical messages</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {[
            { id: 'all', label: 'All Messages', count: messages.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'updates', label: 'Updates', count: messages.filter(m => m.type === 'update').length },
            { id: 'milestones', label: 'Milestones', count: messages.filter(m => m.type === 'milestone').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            onClick={() => {
              setSelectedMessage(message);
              if (!message.isRead) {
                markAsRead(message.id);
              }
            }}
            className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-2xl ${
              !message.isRead ? 'ring-2 ring-pink-300 shadow-pink-100' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Message Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${getMessageColor(message.type)} rounded-2xl flex items-center justify-center flex-shrink-0 ${
                message.animation === 'celebration' ? 'animate-bounce' :
                message.animation === 'sparkle' ? 'animate-pulse' :
                message.animation === 'fire' ? 'animate-ping' :
                ''
              }`}>
                <i className={`${getMessageIcon(message.type)} text-white text-xl`}></i>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-bold text-lg ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {message.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {message.hasAttachment && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="ri-attachment-line text-white text-xs"></i>
                      </div>
                    )}
                    {!message.isRead && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {message.content.split('\n')[0]}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{message.sender}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                    {message.priority} priority
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-mail-line text-gray-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No messages found</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? 'All caught up! No unread messages.' : 'No messages in this category.'}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getMessageColor(selectedMessage.type)} rounded-2xl flex items-center justify-center`}>
                    <i className={`${getMessageIcon(selectedMessage.type)} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedMessage.title}</h2>
                    <p className="text-sm text-gray-600">{selectedMessage.sender}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {selectedMessage.content}
                  </div>
                </div>

                {/* Attachment */}
                {selectedMessage.hasAttachment && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <i className="ri-attachment-line text-blue-600 text-xl"></i>
                      <h4 className="font-semibold text-blue-800">Attachment</h4>
                    </div>
                    {selectedMessage.attachmentType === 'badge' && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-center text-white">
                        <i className="ri-medal-line text-3xl mb-2"></i>
                        <div className="font-bold">New Badge Earned!</div>
                        <div className="text-sm opacity-90">Check your Achievements Tower</div>
                      </div>
                    )}
                    {selectedMessage.attachmentType === 'image' && (
                      <div className="bg-purple-100 rounded-2xl p-4 text-center">
                        <i className="ri-image-line text-purple-600 text-3xl mb-2"></i>
                        <div className="font-semibold text-purple-800">Progress Photo</div>
                        <div className="text-sm text-purple-600">View in Gallery</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Received: {new Date(selectedMessage.date).toLocaleString()}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority} priority
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-20 right-12 w-8 h-8 bg-pink-300 rounded-full opacity-20 animate-float" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
      <div className="absolute bottom-20 left-12 w-12 h-12 bg-purple-300 rounded-full opacity-20 animate-float" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
      <div className="absolute top-1/2 right-8 w-6 h-6 bg-yellow-300 rounded-full opacity-20 animate-float" style={{animationDelay: '4s', animationDuration: '7s'}}></div>
      
      {/* Custom Float Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float var(--duration, 6s) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}