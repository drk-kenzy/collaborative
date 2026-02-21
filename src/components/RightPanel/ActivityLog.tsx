import React from 'react';
import { ActivityLog as ActivityLogEntry } from '../../types';

interface ActivityLogProps {
  logs: ActivityLogEntry[];
}

const ActivityLogList = React.memo(({ logs }: ActivityLogProps) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
      {logs.length === 0 && (
        <div style={{ color: '#1e293b', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
          Aucune activité...
        </div>
      )}
      {logs.map(log => (
        <div key={log.id} style={{
          padding: '5px 8px', marginBottom: 3, borderRadius: 6,
          background: log.action === 'packet_lost' ? '#1a0a0a' : '#0a0f1a',
          border: `1px solid ${log.action === 'packet_lost' ? '#EF444422' : '#0f172a'}`,
          animation: 'logFadeIn 0.2s ease',
          fontSize: 10, lineHeight: 1.5,
        }}>
          <span className="text-gray-400 dark:text-gray-500 font-mono">
            [{log.timestamp}] 
          </span>

          {log.action === 'packet_lost' ? (
            <span style={{ color: '#EF4444' }}>
              ⚠️ <strong>Paquet perdu</strong> — opération de{' '}
              <span style={{ color: log.userColor, fontWeight: 700 }}>
                {log.userName.split(' ')[0]}
              </span>{' '}
              ignorée
            </span>
          ) : (
            <>
              <span style={{ color: log.userColor, fontWeight: 700 }}>
                {log.userName.split(' ')[0]}
              </span>
              <span className="text-gray-600 dark:text-gray-400"> {log.action}</span>
            </>
          )}
        </div>
      ))}

    </div>
  );
});

export default ActivityLogList;
