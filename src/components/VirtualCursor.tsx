import React, { useEffect, useRef } from 'react';
import { User } from '../types';

interface VirtualCursorProps {
  user: User;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
}

export const VirtualCursor = React.memo(function VirtualCursor({ user, textareaRef, content }: VirtualCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    const ta = textareaRef.current;
    if (!el || !ta) return;

    const pos = Math.min(Math.max(0, user.cursorPosition ?? 0), content.length);
    const beforeCursor = content.slice(0, pos);
    const lines = beforeCursor.split('\n');
    const lineIndex = lines.length - 1;
    const charInLine = lines[lineIndex]?.length ?? 0;

    const fontSize = 13;
    const lineHeight = fontSize * 1.6;
    const charWidth = 7.82;
    const paddingTop = 32;
    const paddingLeft = 20;

    let top = paddingTop + lineIndex * lineHeight;
    let left = paddingLeft + charInLine * charWidth;

    const wrapper = ta.parentElement;
    if (wrapper) {
      top = Math.max(0, Math.min(top, wrapper.clientHeight - 24));
      left = Math.max(0, Math.min(left, wrapper.clientWidth - 8));
    }

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  }, [user.cursorPosition, content, textareaRef]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 10,
        // Start hidden — the effect will show it
        opacity: 0,
        transform: 'scale(0.8)',
        transition: 'top 0.35s cubic-bezier(.4,0,.2,1), left 0.35s cubic-bezier(.4,0,.2,1), opacity 0.3s, transform 0.3s',
      }}
    >
      {/* Name tag */}
      <div style={{
        position: 'absolute', bottom: '100%', left: 0,
        background: user.color, color: 'white',
        fontSize: 9, fontWeight: 800, padding: '1px 6px 2px',
        borderRadius: '4px 4px 4px 0', marginBottom: 2,
        whiteSpace: 'nowrap', boxShadow: `0 2px 8px ${user.color}66`,
        animation: 'cursorNameIn 0.3s ease-out',
        display: 'flex', alignItems: 'center', gap: 4
      }}>
        {user.name.split(' ')[0]}
        {user.status === 'writing' && (
          <div style={{ display: 'flex', gap: 1, marginLeft: 1 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 2, height: 2, borderRadius: '50%', background: 'white',
                animation: `writingBounce 1s ${i * 0.15}s ease-in-out infinite`
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Cursor line */}
      <div style={{
        width: 2, height: 20, background: user.color,
        borderRadius: 1, boxShadow: `0 0 6px ${user.color}88`,
      }} />
    </div>
  );
});
