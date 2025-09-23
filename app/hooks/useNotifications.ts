
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPusher, NotificationEvent, PUSHER_EVENTS, disconnectPusher } from '../lib/pusher';

interface Notification {
  id: string;
  type: 'update' | 'milestone' | 'comment' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  memoryId?: string;
  memoryName?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'milestone',
      title: 'Creation Milestone Reached',
      message: 'Your Magical Unicorn for Adam has reached the 3D Design phase! Our team has completed the detailed modeling.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      memoryId: 'mem-001',
      memoryName: 'Magical Unicorn - Adam',
      actionUrl: '/memory?id=mem-001',
      priority: 'high'
    },
    {
      id: 'notif-2',
      type: 'comment',
      title: 'New Comment Added',
      message: 'Someone left a beautiful comment on your Brave Dragon memory: "This is absolutely magical! What a wonderful keepsake."',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: false,
      memoryId: 'mem-002',
      memoryName: 'Brave Dragon - Emma',
      actionUrl: '/memory?id=mem-002#comments',
      priority: 'medium'
    },
    {
      id: 'notif-3',
      type: 'update',
      title: 'Production Update',
      message: 'Great news! Your Wise Owl is now in the painting phase. Our artists are carefully hand-painting every detail.',
      timestamp: '2024-01-13T14:20:00Z',
      isRead: true,
      memoryId: 'mem-003',
      memoryName: 'Wise Owl - Lucas',
      actionUrl: '/memory?id=mem-003',
      priority: 'medium'
    },
    {
      id: 'notif-4',
      type: 'system',
      title: 'Weekly Memory Digest',
      message: 'Your weekly summary is ready! You have 3 active memories with 12 total updates this week.',
      timestamp: '2024-01-12T09:00:00Z',
      isRead: true,
      actionUrl: '/dashboard',
      priority: 'low'
    },
    {
      id: 'notif-5',
      type: 'reminder',
      title: 'Share Your Memory',
      message: 'Don\'t forget to share your beautiful Magical Unicorn memory with family and friends!',
      timestamp: '2024-01-11T12:00:00Z',
      isRead: true,
      memoryId: 'mem-001',
      memoryName: 'Magical Unicorn - Adam',
      actionUrl: '/memory?id=mem-001#share',
      priority: 'low'
    },
    {
      id: 'notif-6',
      type: 'milestone',
      title: 'Quality Check Complete',
      message: 'Your Brave Dragon has passed our quality inspection with flying colors! Ready for the final packaging.',
      timestamp: '2024-01-10T11:15:00Z',
      isRead: true,
      memoryId: 'mem-002',
      memoryName: 'Brave Dragon - Emma',
      actionUrl: '/memory?id=mem-002',
      priority: 'high'
    }
  ]);

  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize Pusher connection
  useEffect(() => {
    let pusher: any = null;
    let channel: any = null;

    try {
      pusher = getPusher();
      
      // Subscribe to user-specific channel
      const channelName = userId ? `user-${userId}` : 'notifications';
      channel = pusher.subscribe(channelName);

      // Connection state events with better error handling
      pusher.connection.bind('connected', () => {
        console.log('Pusher connected successfully');
        setIsConnected(true);
        setConnectionError(null);
      });

      pusher.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
        setIsConnected(false);
      });

      pusher.connection.bind('error', (error: any) => {
        console.warn('Pusher connection error (expected without valid credentials):', error);
        setIsConnected(false);
        setConnectionError('Connection failed - using demo mode');
      });

      pusher.connection.bind('unavailable', () => {
        console.warn('Pusher connection unavailable');
        setIsConnected(false);
        setConnectionError('Service unavailable - using demo mode');
      });

      // Listen for new notifications
      channel.bind(PUSHER_EVENTS.NEW_NOTIFICATION, (data: NotificationEvent) => {
        console.log('New notification received:', data);
        
        const newNotification: Notification = {
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.message,
          timestamp: data.timestamp,
          isRead: false,
          memoryId: data.memoryId,
          memoryName: data.memoryName,
          actionUrl: data.actionUrl,
          priority: data.priority
        };

        setNotifications(prev => [newNotification, ...prev]);
        setLastNotification(newNotification);
        
        // Show browser notification if permission granted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/favicon.ico',
            tag: data.id
          });
        }
      });

      // Listen for milestone events
      channel.bind(PUSHER_EVENTS.MILESTONE_REACHED, (data: NotificationEvent) => {
        console.log('Milestone reached:', data);
        
        const milestoneNotification: Notification = {
          id: data.id,
          type: 'milestone',
          title: data.title,
          message: data.message,
          timestamp: data.timestamp,
          isRead: false,
          memoryId: data.memoryId,
          memoryName: data.memoryName,
          actionUrl: data.actionUrl,
          priority: 'high'
        };

        setNotifications(prev => [milestoneNotification, ...prev]);
        setLastNotification(milestoneNotification);
      });

      // Listen for new comments
      channel.bind(PUSHER_EVENTS.NEW_COMMENT, (data: NotificationEvent) => {
        console.log('New comment received:', data);
        
        const commentNotification: Notification = {
          id: data.id,
          type: 'comment',
          title: data.title,
          message: data.message,
          timestamp: data.timestamp,
          isRead: false,
          memoryId: data.memoryId,
          memoryName: data.memoryName,
          actionUrl: data.actionUrl,
          priority: 'medium'
        };

        setNotifications(prev => [commentNotification, ...prev]);
        setLastNotification(commentNotification);
      });

      // Listen for progress updates
      channel.bind(PUSHER_EVENTS.PROGRESS_UPDATE, (data: NotificationEvent) => {
        console.log('Progress update received:', data);
        
        const updateNotification: Notification = {
          id: data.id,
          type: 'update',
          title: data.title,
          message: data.message,
          timestamp: data.timestamp,
          isRead: false,
          memoryId: data.memoryId,
          memoryName: data.memoryName,
          actionUrl: data.actionUrl,
          priority: 'medium'
        };

        setNotifications(prev => [updateNotification, ...prev]);
        setLastNotification(updateNotification);
      });

    } catch (error) {
      console.warn('Failed to initialize Pusher notifications:', error);
      setConnectionError('Failed to initialize real-time notifications');
    }

    // Cleanup on unmount
    return () => {
      try {
        if (channel) {
          channel.unbind_all();
        }
        if (pusher && channel) {
          pusher.unsubscribe(userId ? `user-${userId}` : 'notifications');
        }
      } catch (error) {
        console.warn('Error during Pusher cleanup:', error);
      }
    };
  }, [userId]);

  // Request notification permission safely
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => {
        console.warn('Notification permission request failed:', err);
      });
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const bulkMarkAsRead = useCallback((notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notification =>
        notificationIds.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const bulkDelete = useCallback((notificationIds: string[]) => {
    setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
  }, []);

  // Test function to simulate receiving notifications
  const simulateNotification = useCallback(() => {
    const testNotification: Notification = {
      id: `test-${Date.now()}`,
      type: 'update',
      title: 'Test Notification',
      message: 'This is a test real-time notification! The system is working properly.',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'medium'
    };

    setNotifications(prev => [testNotification, ...prev]);
    setLastNotification(testNotification);

    // Show browser notification if available
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(testNotification.title, {
        body: testNotification.message,
        icon: '/favicon.ico'
      });
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    lastNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkMarkAsRead,
    bulkDelete,
    simulateNotification
  };
}
