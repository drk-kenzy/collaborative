import React, { useRef, useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { User } from '../types';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { VirtualCursor } from './VirtualCursor';

// lightweight debounce
function debounceFn<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delay);
  };
}

export type EditorHandle = {
  undo: () => void;
  redo: () => void;
};

interface EditorProps {
  users: User[];
  onContentChange: (size: number) => void;
  currentLatency?: number;
  onUndoRedoStateChange?: (v: { canUndo: boolean; canRedo: boolean }) => void;
  lastChatMessage?: string;
}

export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  { users, onContentChange, currentLatency = 0, onUndoRedoStateChange, lastChatMessage },
  ref
) {
  // Local content management: ref + local state for display
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<string>('');
  const { canUndo, canRedo, pushState, undo, redo, INITIAL_CONTENT } = useUndoRedo();
  const [displayContent, setDisplayContent] = useState<string>('');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  // Detect conflict mentions in last message
  useEffect(() => {
    if (!lastChatMessage) return;
    const match = lastChatMessage.match(/ligne (\d+)/i);
    if (match) {
      const lineNum = parseInt(match[1], 10);
      setHighlightedLine(lineNum);
      const t = setTimeout(() => setHighlightedLine(null), 4000);
      return () => clearTimeout(t);
    }
  }, [lastChatMessage]);

  // expose undo/redo to parent
  useImperativeHandle(ref, () => ({ undo: handleUndo, redo: handleRedo }));

  // propagate canUndo/canRedo to parent for header buttons
  useEffect(() => {
    onUndoRedoStateChange?.({ canUndo, canRedo });
  }, [canUndo, canRedo, onUndoRedoStateChange]);

  // Initialize with default content once on mount
  useEffect(() => {
    contentRef.current = INITIAL_CONTENT;
    setDisplayContent(INITIAL_CONTENT);
    onContentChange(INITIAL_CONTENT.length);
  }, [INITIAL_CONTENT, onContentChange]);

  // Line numbers recalculation using memo
  const lineCount = useMemo(() => displayContent.split('\n').length, [displayContent]);
  const lineNumbers = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

  // Debounced size update to parent/context
  const debouncedSizeUpdate = useMemo(
    () => debounceFn((content: string) => {
      onContentChange(content.length);
    }, 200),
    [onContentChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    contentRef.current = val;
    setDisplayContent(val);
    pushState(val);
    debouncedSizeUpdate(val);
  };

  const handleUndo = () => {
    const prev = undo();
    if (prev !== null) { 
      contentRef.current = prev; 
      setDisplayContent(prev); 
      onContentChange(prev.length);
    }
  };

  const handleRedo = () => {
    const next = redo();
    if (next !== null) { 
      contentRef.current = next; 
      setDisplayContent(next); 
      onContentChange(next.length);
    }
  };

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (numbersRef.current) numbersRef.current.scrollTop = e.currentTarget.scrollTop;
  };

  // Styling constants to match line number heights
  const fontSize = 13;
  const lineHeight = 1.6;

  const latencyColor = currentLatency < 300 ? '#10B981' : currentLatency < 800 ? '#F59E0B' : '#EF4444';

  return (
    <main className="flex-1 flex overflow-hidden bg-white dark:bg-gray-900 relative">
      {/* Line Numbers */}
      <div
        ref={numbersRef}
        id="line-numbers"
        className="w-12 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 select-none overflow-hidden text-gray-400 dark:text-gray-600 font-mono"
        style={{ fontSize, lineHeight, paddingTop: 16, paddingRight: 8, textAlign: 'right' as const }}
      >
        {lineNumbers.map(n => (
          <div 
            key={n} 
            style={{ 
              height: fontSize * lineHeight,
              color: n === highlightedLine ? '#EF4444' : undefined,
              fontWeight: n === highlightedLine ? 900 : undefined,
              background: n === highlightedLine ? '#EF444411' : undefined,
              transition: 'all 0.3s'
            }}
          >
            {n}
          </div>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div style={{ position: 'relative', flex: 1 }}>
          <textarea
            ref={textareaRef}
            value={displayContent}
            onChange={handleChange}
            onScroll={syncScroll}
            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none p-4 font-mono text-sm text-gray-800 dark:text-gray-200 z-10"
            placeholder="Commence à taper ton chef-d'œuvre collaboratif..."
            spellCheck={false}
            style={{ fontSize, lineHeight }}
          />
          {users.map(u => (
            <VirtualCursor key={u.id} user={u} textareaRef={textareaRef} content={displayContent} />
          ))}

          {/* Latency indicator */}
          <div style={{
            position: 'absolute', bottom: 12, right: 16, zIndex: 10,
            background: 'rgba(8, 13, 24, 0.9)',
            border: `1px solid ${latencyColor}55`,
            borderRadius: 6, padding: '3px 10px',
            fontSize: 11, fontWeight: 700,
            color: latencyColor, fontFamily: 'monospace',
            backdropFilter: 'blur(4px)',
            transition: 'color 0.3s, border-color 0.3s'
          }}>
            ⚡ {currentLatency}ms
          </div>
        </div>
      </div>
    </main>
  );
});
