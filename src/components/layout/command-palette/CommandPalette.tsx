import type React from 'react';
import { useState } from 'react';
import { useAppStore } from '../../../stores/app-store';
import { useInvestigationStore } from '../../../stores/investigation-store';
import { CommandPaletteDialog } from './CommandPaletteDialog';
import type { QuickAction } from './command-palette.data';
import { useCommandPaletteHotkeys } from './use-command-palette-hotkeys';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setCurrentPath, setViewMode } = useAppStore();
  const { incidents, entities } = useInvestigationStore();
  // Lives here (not in the dialog) so the last query survives closing and reopening.
  const [query, setQuery] = useState('');

  useCommandPaletteHotkeys(isCommandPaletteOpen, setCommandPaletteOpen);

  if (!isCommandPaletteOpen) return null;

  const navigateAndClose = (path: string) => {
    setCurrentPath(path);
    setCommandPaletteOpen(false);
  };

  const runQuickAction = (action: QuickAction) => {
    if (action.viewMode) {
      setViewMode(action.viewMode);
    }
    navigateAndClose(action.path);
  };

  return (
    <CommandPaletteDialog
      query={query}
      onQueryChange={setQuery}
      incidents={incidents}
      entities={entities}
      onNavigate={navigateAndClose}
      onRunQuickAction={runQuickAction}
      onClose={() => setCommandPaletteOpen(false)}
    />
  );
};
