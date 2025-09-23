
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isConnected,
    lastNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkMarkAsRead,
    bulkDelete,
    simulateNotification
  } = useNotifications('user-123'); // Replace with actual user ID

  const [filter, setFilter] = useState<'all' | 'unread' | 'milestone' | 'comment' | 'update'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);

  // Generate stars only on client side to avoid hydration mismatch
  useEffect(() => {
    const generatedStars = Array.from({ length: 12 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 2}s`
    }));
    setStars(generatedStars);
  }, []);

  // Show toast for new notifications
  useEffect(() => {
    if (lastNotification) {
      // You can implement a toast notification system here
      console.log('New notification:', lastNotification);
    }
  }, [lastNotification]);

  const notificationConfig = {
    milestone: {
      icon: 'ri-flag-line',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Milestone'
    },
    comment: {
      icon: 'ri-chat-3-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Comment'
    },
    update: {
      icon: 'ri-information-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      label: 'Update'
    },
    system: {
      icon: 'ri-settings-line',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: 'System'
    },
    reminder: {
      icon: 'ri-alarm-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      label: 'Reminder'
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return time.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const toggleSelectNotification = (notificationId: string) => {
    if (selectedNotifications.includes(notificationId)) {
      setSelectedNotifications(selectedNotifications.filter(id => id !== notificationId));
    } else {
      setSelectedNotifications([...selectedNotifications, notificationId]);
    }
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkMarkAsRead = () => {
    bulkMarkAsRead(selectedNotifications);
    setSelectedNotifications([]);
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedNotifications);
    setSelectedNotifications([]);
    setShowBulkActions(false);
  };

  useEffect(() => {
    setShowBulkActions(selectedNotifications.length > 0);
  }, [selectedNotifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning={true}>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          >
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Notifications</h1>
                {unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </div>
                )}
                {/* Connection Status */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  isConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span>{isConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <p className="text-gray-600">Stay updated with your Dreamli creations</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-dashboard-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Dashboard</span>
              </Link>
              
              {/* Demo button for testing */}
              <button
                onClick={simulateNotification}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Test Notification
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50 overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {[
                  { id: 'all', label: 'All', count: notifications.length },
                  { id: 'unread', label: 'Unread', count: unreadCount },
                  { id: 'milestone', label: 'Milestones', count: notifications.filter(n => n.type === 'milestone').length },
                  { id: 'comment', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
                  { id: 'update', label: 'Updates', count: notifications.filter(n => n.type === 'update').length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      filter === tab.id
                        ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <div className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {tab.count}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={selectAll}
                    className="w-5 h-5 border-2 border-blue-500 rounded flex items-center justify-center cursor-pointer"
                  >
                    {selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0 && (
                      <i className="ri-check-line text-blue-500 text-sm"></i>
                    )}
                  </button>
                  <span className="text-blue-800 font-medium">
                    {selectedNotifications.length} selected
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkMarkAsRead}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-double-line"></i>
                      <span>Mark Read</span>
                    </div>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="ri-delete-bin-line"></i>
                      <span>Delete</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const config = notificationConfig[notification.type];
              const isSelected = selectedNotifications.includes(notification.id);
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 ${
                    !notification.isRead ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleSelectNotification(notification.id)}
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer mt-1 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isSelected && (
                          <i className="ri-check-line text-white text-sm"></i>
                        )}
                      </button>

                      {/* Notification Icon */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <i className={`${config.icon} ${config.color} text-lg sm:text-xl`}></i>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base">{notification.title}</h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="whitespace-nowrap">{formatTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Memory Info */}
                        {notification.memoryName && (
                          <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <i className="ri-heart-line text-pink-500"></i>
                              <span className="text-sm font-medium text-gray-700">{notification.memoryName}</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              onClick={() => markAsRead(notification.id)}
                              className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap text-center text-sm"
                            >
                              View Details
                            </Link>
                          )}
                          
                          <div className="flex space-x-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                              >
                                Mark Read
                              </button>
                            )}
                            
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="bg-red-100 text-red-700 px-3 py-2 rounded-2xl font-medium hover:bg-red-200 transition-colors cursor-pointer"
                              title="Delete notification"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-notification-off-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {filter === 'unread' ? 'All caught up!' : 'No notifications'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filter === 'unread' 
                  ? "You've read all your notifications. New updates will appear here."
                  : `No ${filter === 'all' ? '' : filter} notifications found.`
                }
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <i className="ri-dashboard-line"></i>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
