import React from 'react';
import { User } from '../types';
import { Users } from 'lucide-react';
import UserCard from './LeftPanel/UserCard';

interface SidebarLeftProps {
  users: User[];
}

export function SidebarLeft({ users }: SidebarLeftProps) {
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex-col hidden md:flex">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Active Users</h2>
        </div>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
          {users.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
}
