import { useState, useEffect, useCallback, useRef } from 'react';
import { User, ActivityLog, ChatMessage, ConnectionStatus } from '../types';

const USERS: User[] = [
  { id: '1', name: 'HOUNTON Fred', color: '#F43F5E', status: 'idle', cursorPosition: 0, ops: 42 },
  { id: '2', name: 'ADJO Félicité', color: '#0EA5E9', status: 'idle', cursorPosition: 0, ops: 128 },
  { id: '3', name: 'Destiny GNIMADI', color: '#10B981', status: 'idle', cursorPosition: 0, ops: 12 },
];

const AUTO_MESSAGES = [
  "Je travaille sur l'introduction, ne touchez pas svp 🙏",
  "J'ai restructuré le paragraphe 3, vérifiez si c'est OK",
  "Quelqu'un peut relire la section architecture ?",
  "Je vais corriger les fautes dans la conclusion",
  "Attention je supprime le bloc redondant en bas",
  "Ma connexion est instable là, ne faites pas attention aux doublons",
  "Latence élevée de mon côté, mes modifs arrivent dans 2 sec",
  "Je suis en synchronisation, attendez avant d'éditer cette section",
  "J'ai fait un undo, on repart de la version précédente",
  "OK de mon côté, vous pouvez continuer",
  "Je sauvegarde la version actuelle",
  "Mes modifications sont envoyées ✓",
  "Super boulot sur la mise en forme 👌",
  "On est bientôt à 500 caractères, il faut étoffer",
];

export function useSimulation() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('Connected');
  const [latency, setLatency] = useState<number>(142);
  const [docSize, setDocSize] = useState(0);
  const docSizeRef = useRef(0);
  const [lostPackets, setLostPackets] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    docSizeRef.current = docSize;
  }, [docSize]);

  // Track mount state to avoid setting state on unmounted component
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const timersRef = useRef<number[]>([]);

  const safeSetState = useCallback(<T,>(setter: (v: T) => void, value: T) => {
    if (mountedRef.current) setter(value);
  }, []);

  const addLog = useCallback((entry: ActivityLog) => {
    if (!mountedRef.current) return;
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  // Simulate network operation for current user actions
  const simulateNetwork = useCallback(async <T,>(operation: () => T): Promise<T | null> => {
    if (!mountedRef.current) return null;
    const currentLatency = Math.floor(Math.random() * (800 - 100 + 1)) + 100;
    setLatency(currentLatency);
    setStatus('Syncing');

    return new Promise((resolve) => {
      const t = window.setTimeout(() => {
        if (!mountedRef.current) { resolve(null); return; }
        setStatus('Connected');
        resolve(operation());
      }, currentLatency);
      timersRef.current.push(t);
    });
  }, []);

  // Simulate other users activity
  useEffect(() => {
    const intervals: number[] = [];

    // User activity intervals — staggered start
    USERS.forEach((user, index) => {
      const startDelay = window.setTimeout(() => {
        if (!mountedRef.current) return;
        const int = window.setInterval(() => {
          if (!mountedRef.current) return;
          try {
            if (Math.random() < 0.5) { // Increased from 0.35
              const doInsert = Math.random() < 0.6;
              const action: ActivityLog['action'] = doInsert ? 'insert' : 'delete';

              setUsers(prev => prev.map(u =>
                u.id === user.id
                  ? {
                      ...u,
                      ops: u.ops + 1,
                      status: 'writing' as const,
                      cursorPosition: Math.max(0, Math.min(
                        (u.cursorPosition ?? 0) + (doInsert ? 5 : -3),
                        Math.max(0, docSizeRef.current - 1)
                      ))
                    }
                  : u
              ));

              const endWrite = window.setTimeout(() => {
                if (!mountedRef.current) return;
                setUsers(prev => prev.map(u =>
                  u.id === user.id ? { ...u, status: 'idle' as const } : u
                ));
                addLog({
                  id: `${user.id}-${Date.now()}`,
                  userId: user.id,
                  userName: user.name,
                  userColor: user.color,
                  action,
                  timestamp: new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })
                });
              }, 1000 + Math.random() * 1000); // Reduced from 2000+
              timersRef.current.push(endWrite);
            }
          } catch (e) {
            console.error('Simulation interval error:', e);
          }
        }, 1200 + index * 400 + Math.random() * 2000); // Reduced from 3000+

        intervals.push(int);
        timersRef.current.push(int);
      }, index * 800);
      timersRef.current.push(startDelay);
    });

    // Latency fluctuation — smooth and realistic
    const latencyInterval = window.setInterval(() => {
      if (!mountedRef.current) return;
      setLatency(prev => {
        const delta = (Math.random() - 0.5) * 120;
        const spike = Math.random() < 0.04 ? 600 + Math.random() * 800 : 0;
        return Math.max(100, Math.min(1500, Math.round(prev + delta + spike)));
      });
    }, 800);
    timersRef.current.push(latencyInterval);

    // Auto-chat scheduling
    const scheduleChat = (user: User, minDelay: number) => {
      const delay = minDelay + Math.floor(Math.random() * 15000);
      const t = window.setTimeout(() => {
        if (!mountedRef.current) return;
        try {
          let content = AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)];
          if (Math.random() < 0.12) {
            const line = Math.floor(Math.random() * 15) + 1;
            content = `Conflit détecté sur la ligne ${line}, je gère.`;
          }
          setChatMessages(prev => [
            ...prev,
            {
              id: `chat-${Date.now()}-${user.id}`,
              userId: user.id,
              userName: user.name,
              userColor: user.color,
              content,
              timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              isCurrentUser: false,
            }
          ].slice(-50));
          // Schedule next message
          scheduleChat(user, 10000 + Math.floor(Math.random() * 20000));
        } catch (e) {
          console.error('Auto-chat error:', e);
        }
      }, delay);
      timersRef.current.push(t);
    };

    // Start auto-chat with staggered delays
    USERS.forEach((u, i) => {
      scheduleChat(u, 5000 + i * 4000);
    });

    return () => {
      intervals.forEach(id => window.clearInterval(id));
      window.clearInterval(latencyInterval);
      const allTimers = [...timersRef.current];
      timersRef.current = [];
      allTimers.forEach(id => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    };
  }, [addLog]);

  return {
    users,
    logs,
    chatMessages,
    status,
    latency,
    docSize,
    setDocSize,
    setChatMessages,
    simulateNetwork,
    lostPackets,
  };
}
