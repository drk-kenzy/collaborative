import React, { useState, useCallback } from 'react';
import { ActivityLog, ChatMessage } from '../types';
import { History, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ActivityLogList from './RightPanel/ActivityLog';
import Chat from './RightPanel/Chat';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarRightProps {
  logs: ActivityLog[];
  chat: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export function SidebarRight({ logs, chat, onSendMessage }: SidebarRightProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'chat'>('history');

  const handleSend = useCallback((content: string) => {
    onSendMessage(content);
  }, [onSendMessage]);

  return (
    <aside className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col hidden lg:flex">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-b-2",
            activeTab === 'history' 
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10" 
              : "border-transparent opacity-50 hover:opacity-100"
          )}
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-b-2",
            activeTab === 'chat' 
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10" 
              : "border-transparent opacity-50 hover:opacity-100"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'history' ? (
          <ActivityLogList logs={logs} />
        ) : (
          <Chat messages={chat} onSend={handleSend} />
        )}
      </div>
    </aside>
  );
}
