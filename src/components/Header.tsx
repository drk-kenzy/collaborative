import { Undo2, Redo2, Circle, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  title: string;
  setTitle: (title: string) => void;
  status: 'Connected' | 'Syncing' | 'Disconnected';
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onMenuClick?: () => void;
}

export function Header({ 
  title, 
  setTitle, 
  status, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  onMenuClick 
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          {/* Burger for tablet/mobile */}
          <span className="text-lg font-bold">☰</span>
        </button>
        <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400 hidden md:block" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 font-semibold text-lg outline-none transition-all w-full max-w-md"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500",
          status === 'Connected' ? "bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] animate-[pulse_2s_infinite]" :
          status === 'Syncing' ? "bg-amber-500/10 border border-amber-500/20" :
          "bg-rose-500/10 border border-rose-500/20"
        )}>
          <Circle
            className={cn(
              "w-2.5 h-2.5 fill-current transition-colors duration-500",
              status === 'Connected' ? "text-emerald-500" :
              status === 'Syncing' ? "text-amber-500 animate-pulse" :
              "text-rose-500"
            )}
          />
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider hidden sm:inline transition-colors duration-500",
            status === 'Connected' ? "text-emerald-600 dark:text-emerald-400" :
            status === 'Syncing' ? "text-amber-600 dark:text-amber-400" :
            "text-rose-600 dark:text-rose-400"
          )}>
            {status}
          </span>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-800 pl-6">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "p-2 rounded transition-colors text-gray-500 dark:text-gray-400",
              !canUndo ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              "p-2 rounded transition-colors text-gray-500 dark:text-gray-400",
              !canRedo ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
