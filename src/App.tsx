import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Editor, type EditorHandle } from './components/Editor';
import { Footer } from './components/Footer';
import { useSimulation } from './hooks/useSimulation';
import { ChatMessage } from './types';

function App() {
  const [docTitle, setDocTitle] = useState('New Project Untitled.md');
  const [mobileTab, setMobileTab] = useState<'editor' | 'users' | 'activity'>('editor');
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);

  const editorRef = useRef<EditorHandle>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleUndo = useCallback(() => { editorRef.current?.undo(); }, []);
  const handleRedo = useCallback(() => { editorRef.current?.redo(); }, []);

  const {
    users,
    logs,
    chatMessages,
    status,
    latency,
    docSize,
    setDocSize,
    setChatMessages,
    simulateNetwork,
    lostPackets
  } = useSimulation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleContentChange = useCallback((size: number) => {
    setDocSize(size);
  }, [setDocSize]);

  const handleUndoRedoStateChange = useCallback((v: { canUndo: boolean; canRedo: boolean }) => {
    setCanUndo(v.canUndo);
    setCanRedo(v.canRedo);
  }, []);

  const handleSendMessage = async (content: string) => {
    const operation = () => {
      const newMessage: ChatMessage = {
        id: `me-${Date.now()}`,
        userId: 'me',
        userName: 'Vous',
        userColor: '#3B82F6',
        content,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      setChatMessages(prev => [...prev, newMessage]);
    };

    await simulateNetwork(operation);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-400">
      <Header 
        title={docTitle} 
        setTitle={setDocTitle} 
        status={status}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onMenuClick={() => setLeftPanelOpen(v => !v)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left drawer on mobile/tablet */}
        <div className={`${leftPanelOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-y-0 left-0 z-40 md:z-auto w-64`}> 
          <SidebarLeft users={users} />
        </div>
        {leftPanelOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setLeftPanelOpen(false)} />
        )}

        {/* Main content: ONLY editor center and right sidebar on large screens */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor fills available space */}
          <div className="flex-1 min-w-0">
            <Editor 
              ref={editorRef}
              users={users}
              onContentChange={handleContentChange}
              currentLatency={latency}
              onUndoRedoStateChange={handleUndoRedoStateChange}
              lastChatMessage={chatMessages[chatMessages.length - 1]?.content}
            />
          </div>

          {/* Right panel (activity/chat) visible on lg */}
          <div className="hidden lg:flex lg:w-80">
            <SidebarRight logs={logs} chat={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        </div>

        {/* Mobile bottom tabs (optional UI control) */}
        <div className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800">
          {[
            { id: 'editor', label: '✏️ Éditeur' },
            { id: 'users', label: '👥 Utilisateurs' },
            { id: 'activity', label: '📋 Activité' },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => setMobileTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-colors ${mobileTab === tab.id ? 'text-blue-400 border-t-2 border-blue-400' : 'text-slate-400'}`}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <Footer 
        docSize={docSize} 
        status={status} 
        latency={latency} 
        lostPackets={lostPackets}
        lastLog={logs[0]}
      />

      {status === 'Disconnected' && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
           <div className="bg-rose-600 text-white px-5 py-2 rounded-full font-bold shadow-2xl shadow-rose-500/50 animate-bounce flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Reconnexion en cours...
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
