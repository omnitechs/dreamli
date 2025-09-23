
import Pusher from 'pusher-js';

// Pusher configuration using environment variables
const pusherConfig = {
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
  encrypted: true,
  authEndpoint: '/api/pusher/auth'
};

let pusherInstance: Pusher | null = null;

export const getPusher = () => {
  // Check if we have valid credentials
  if (!pusherConfig.key || pusherConfig.key === '') {
    console.warn('Pusher credentials not configured. Please add NEXT_PUBLIC_PUSHER_APP_KEY to your environment variables.');
    // Return a mock pusher instance for development
    return createMockPusher();
  }

  if (!pusherInstance) {
    try {
      pusherInstance = new Pusher(pusherConfig.key, {
        cluster: pusherConfig.cluster,
        encrypted: pusherConfig.encrypted,
        authEndpoint: pusherConfig.authEndpoint,
        // Add connection timeout and retry settings
        activityTimeout: 30000,
        pongTimeout: 6000,
        unavailableTimeout: 10000
      });

      // Handle connection errors gracefully
      pusherInstance.connection.bind('error', (error: any) => {
        console.warn('Pusher connection error (this is expected without valid credentials):', error);
      });

      pusherInstance.connection.bind('unavailable', () => {
        console.warn('Pusher connection unavailable');
      });

    } catch (error) {
      console.warn('Failed to initialize Pusher:', error);
      return createMockPusher();
    }
  }
  return pusherInstance;
};

// Create a mock pusher instance for development when credentials are not available
const createMockPusher = () => {
  const mockChannel = {
    bind: (event: string, callback: Function) => {
      console.log(`Mock: Binding to event ${event}`);
    },
    unbind_all: () => {
      console.log('Mock: Unbinding all events');
    }
  };

  const mockConnection = {
    bind: (event: string, callback: Function) => {
      console.log(`Mock: Binding connection event ${event}`);
      // Simulate connected state for development
      if (event === 'connected') {
        setTimeout(() => callback(), 1000);
      }
    },
    state: 'connected'
  };

  return {
    subscribe: (channelName: string) => {
      console.log(`Mock: Subscribing to channel ${channelName}`);
      return mockChannel;
    },
    unsubscribe: (channelName: string) => {
      console.log(`Mock: Unsubscribing from channel ${channelName}`);
    },
    connection: mockConnection,
    disconnect: () => {
      console.log('Mock: Disconnecting');
    }
  };
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};

// Event types for notifications
export interface NotificationEvent {
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
  userId?: string;
}

export const PUSHER_EVENTS = {
  NEW_NOTIFICATION: 'new-notification',
  NOTIFICATION_READ: 'notification-read',
  MILESTONE_REACHED: 'milestone-reached',
  NEW_COMMENT: 'new-comment',
  PROGRESS_UPDATE: 'progress-update'
} as const;
