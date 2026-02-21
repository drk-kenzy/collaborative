export interface User {
  id: string;
  name: string;
  color: string;
  status: 'writing' | 'idle';
  cursorPosition: number;
  ops: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  action: 'insert' | 'delete' | 'packet_lost' | string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export type ConnectionStatus = 'Connected' | 'Syncing' | 'Disconnected';
