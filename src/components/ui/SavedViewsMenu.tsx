import { Bookmark, Trash2 } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useSavedViews } from '../../hooks/use-saved-views';

interface SavedViewsMenuProps<TConfig> {
  viewKey: string;
  currentConfig: TConfig;
  onApply: (config: TConfig) => void;
}

export function SavedViewsMenu<TConfig>({ viewKey, currentConfig, onApply }: SavedViewsMenuProps<TConfig>) {
  const { views, saveView, deleteView } = useSavedViews<TConfig>(viewKey);
  const [isOpen, setIsOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSave = () => {
    const name = draftName.trim();
    if (!name) return;
    saveView(name, currentConfig);
    setDraftName('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[var(--zf-border-medium)] text-[11px] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--zf-border-focus)]"
      >
        <Bookmark className="w-3 h-3" aria-hidden="true" />
        Views ({views.length})
      </button>
      {isOpen && (
        <div
          id={menuId}
          className="absolute right-0 mt-1 w-64 z-30 p-2 rounded border border-[var(--zf-border-medium)] bg-[var(--zf-surface-card)] shadow-lg space-y-2"
        >
          <ul className="space-y-1 max-h-48 overflow-y-auto">
            {views.length === 0 && <li className="text-[11px] text-[var(--zf-text-muted)]">No saved views.</li>}
            {views.map((view) => (
              <li key={view.id} className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onApply(view.config);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left truncate text-[11px] text-[var(--zf-text-primary)] hover:underline"
                >
                  {view.name}
                </button>
                <button
                  type="button"
                  aria-label={`Delete view ${view.name}`}
                  onClick={() => deleteView(view.id)}
                  className="p-0.5 text-[var(--zf-text-muted)] hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-1">
            <input
              aria-label="New view name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSave()}
              placeholder="Save current view as…"
              className="flex-1 min-w-0 px-1.5 py-1 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] text-[11px] text-[var(--zf-text-primary)]"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!draftName.trim()}
              className="px-2 py-1 rounded border border-[var(--zf-border-medium)] text-[11px] text-[var(--zf-text-primary)] disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
