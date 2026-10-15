import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';

const GO_TO_CHORD_TIMEOUT_MS = 1200;

const GO_TO_CHORD_ROUTES: Record<string, string> = {
  i: '/investigate/incidents',
  a: '/investigate/alerts',
  s: '/system/fleet',
  c: '/overview',
};

const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

interface GlobalShortcutHandlers {
  setCurrentPath: (path: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setIsShortcutsHelpOpen: Dispatch<SetStateAction<boolean>>;
}

export function useGlobalShortcuts({
  setCurrentPath,
  setCommandPaletteOpen,
  setIsShortcutsHelpOpen,
}: GlobalShortcutHandlers) {
  useEffect(() => {
    let pendingGKey = false;
    let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (TEXT_ENTRY_TAGS.has(target.tagName)) {
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsHelpOpen((prev) => !prev);
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        pendingGKey = true;
        if (pendingTimeout) clearTimeout(pendingTimeout);
        pendingTimeout = setTimeout(() => {
          pendingGKey = false;
        }, GO_TO_CHORD_TIMEOUT_MS);
        return;
      }

      if (pendingGKey) {
        const route = GO_TO_CHORD_ROUTES[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          setCurrentPath(route);
        }
        pendingGKey = false;
        if (pendingTimeout) clearTimeout(pendingTimeout);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentPath, setCommandPaletteOpen, setIsShortcutsHelpOpen]);
}
