import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../../types';

interface ChatProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
}

const Chat = React.memo(({ messages, onSend }: ChatProps) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  }, [input, onSend]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 8px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.isCurrentUser ? 'flex-end' : 'flex-start',
          }}>
            {!msg.isCurrentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: msg.userColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 7, fontWeight: 900, color: 'white',
                }}>
                  {msg.userName[0]}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: msg.userColor }}>
                  {msg.userName.split(' ')[0]}
                </span>
                <span style={{ fontSize: 9, color: '#1e293b' }}>{msg.timestamp}</span>
              </div>
            )}

            <div style={{
              maxWidth: '82%', padding: '7px 11px', lineHeight: 1.5,
              borderRadius: msg.isCurrentUser
                ? '12px 12px 2px 12px'
                : '2px 12px 12px 12px',
              background: msg.isCurrentUser
                ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
                : '#0f172a',
              color: msg.isCurrentUser ? 'white' : '#d1d5db',
              fontSize: 12,
            }}>
              {msg.content}
            </div>

            {msg.isCurrentUser && (
              <span style={{ fontSize: 9, color: '#1e293b', marginTop: 2 }}>
                {msg.timestamp}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '8px', borderTop: '1px solid #0f172a', display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Envoyer un message..."
          style={{
            flex: 1, background: '#0a0f1a', border: '1px solid #0f172a',
            borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#d1d5db',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button onClick={handleSend} style={{
          background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
          border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>↑</button>
      </div>
    </div>
  );
});

export default Chat;
