
// Pusher configuration file
// Replace these values with your actual Pusher app credentials

export const PUSHER_CONFIG = {
  // Get these from your Pusher dashboard at https://dashboard.pusher.com/
  appKey: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'your-pusher-app-key',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu', // e.g., 'us2', 'eu', 'ap1'
  encrypted: true,
  
  // For server-side operations (if needed later)
  appId: process.env.PUSHER_APP_ID || 'your-pusher-app-id',
  secret: process.env.PUSHER_SECRET || 'your-pusher-secret',
};

// Channel names
export const CHANNELS = {
  notifications: (userId: string) => `user-${userId}`,
  globalNotifications: 'global-notifications',
  memoryUpdates: (memoryId: string) => `memory-${memoryId}`,
} as const;

// Event types
export const EVENTS = {
  NEW_NOTIFICATION: 'new-notification',
  NOTIFICATION_READ: 'notification-read',
  MILESTONE_REACHED: 'milestone-reached',
  NEW_COMMENT: 'new-comment',
  PROGRESS_UPDATE: 'progress-update',
  MEMORY_CREATED: 'memory-created',
  MEMORY_UPDATED: 'memory-updated',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
} as const;

// Instructions for setup:
/*
1. Sign up at https://pusher.com/
2. Create a new app in your Pusher dashboard
3. Copy your app credentials:
   - App ID
   - Key
   - Secret
   - Cluster

4. Create a .env.local file in your project root:
   NEXT_PUBLIC_PUSHER_APP_KEY=your-key-here
   NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster-here
   PUSHER_APP_ID=your-app-id-here
   PUSHER_SECRET=your-secret-here

5. Replace the placeholder values in this file with your actual credentials

6. For testing, you can use Pusher's debug console to send test events
*/
