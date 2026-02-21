import { useRef, useState, useCallback } from 'react';

export const INITIAL_CONTENT = `# Document collaboratif — NiyiExpertise

Bienvenue dans cet éditeur collaboratif temps réel.
Plusieurs utilisateurs peuvent éditer ce document simultanément.

Les modifications sont synchronisées avec une latence simulée.
La gestion des conflits est assurée par un algorithme CRDT simplifié.

Architecture choisie :
- Context API + useReducer pour l'état global
- État local isolé dans l'éditeur (zéro re-render global)
- Curseurs virtuels via manipulation directe du DOM
- Simulation réseau avec latence aléatoire (100ms à 1500ms)

Commencez à taper pour contribuer au document...`;

export function useUndoRedo() {
  const history = useRef<string[]>([INITIAL_CONTENT]);
  const currentIndex = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushState = useCallback((newContent: string) => {
    history.current = history.current.slice(0, currentIndex.current + 1);
    history.current.push(newContent);
    if (history.current.length > 50) history.current.shift();
    currentIndex.current = history.current.length - 1;
    setCanUndo(currentIndex.current > 0);
    setCanRedo(false);
  }, []);

  const undo = useCallback((): string | null => {
    if (currentIndex.current <= 0) return null;
    currentIndex.current--;
    setCanUndo(currentIndex.current > 0);
    setCanRedo(true);
    return history.current[currentIndex.current];
  }, []);

  const redo = useCallback((): string | null => {
    if (currentIndex.current >= history.current.length - 1) return null;
    currentIndex.current++;
    setCanUndo(true);
    setCanRedo(currentIndex.current < history.current.length - 1);
    return history.current[currentIndex.current];
  }, []);

  return { canUndo, canRedo, pushState, undo, redo, INITIAL_CONTENT };
}
