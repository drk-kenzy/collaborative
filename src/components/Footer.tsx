import React from 'react';
import { Terminal, Database, Cpu, Activity } from 'lucide-react';
import { ActivityLog } from '../types';

interface FooterProps {
  docSize: number;
  status: string;
  latency: number;
  lastLog?: ActivityLog;
  lostPackets?: number;
}

const FooterComponent = ({ docSize, status, latency, lostPackets = 0, lastLog }: FooterProps) => {
  const [fps, setFps] = React.useState(60);

  React.useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let rafId: number;

    const update = () => {
      const now = performance.now();
      frames++;
      if (now > lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        lastTime = now;
        frames = 0;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <footer className="h-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center justify-between z-10 select-none">
      {/* Left: Console + stats */}
      <div className="flex items-center gap-4 overflow-hidden">
        {/* Console label */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <Terminal className="w-3.5 h-3.5" />
          {lastLog ? (
            <span className="text-gray-500 dark:text-gray-300 normal-case font-mono truncate max-w-[200px]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <span style={{ color: lastLog.userColor }}>{lastLog.userName.split(' ')[0]}</span>
              {': '}
              {lastLog.action === 'packet_lost' ? '⚠️ perdu' : lastLog.action}
            </span>
          ) : (
            <span>System Console</span>
          )}
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Stats */}
        <div className="flex items-center gap-4 text-[10px] opacity-60 font-mono">
          <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity transition-all duration-300">
            <Database className="w-3 h-3" />
            SIZE: <span key={docSize} className="inline-block" style={{ animation: 'countPulse 0.4s ease-out' }}>
              {(docSize / 1024).toFixed(2)} KB
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 hover:opacity-100 transition-opacity">
            <Activity className="w-3 h-3" />
            NET: {status === 'Connected' ? 'TEMPS RÉEL-WS' : 'P2P-FALLBACK'}
          </div>
          <div className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
            <Cpu className="w-3 h-3" />
            LAT:{' '}
            <span className={latency > 1000 ? 'text-rose-500' : latency > 500 ? 'text-amber-500' : 'text-emerald-500'}>
              {latency}ms
            </span>
          </div>
          {lostPackets > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-rose-500 font-bold animate-pulse">
              ⚠️ {lostPackets} perdus
            </div>
          )}
        </div>
      </div>

      {/* Right: FPS */}
      <div className="hidden sm:flex text-[10px] font-bold opacity-30 hover:opacity-100 transition-opacity items-center gap-3">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${fps > 55 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          FPS: {fps}
        </span>
        <span className="opacity-50">|</span>
        <span>STABLE v1.2.1</span>
      </div>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
