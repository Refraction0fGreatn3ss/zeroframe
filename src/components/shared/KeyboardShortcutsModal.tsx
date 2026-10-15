import { Keyboard, X } from 'lucide-react';
import type { FC } from 'react';

const KEYBOARD_SHORTCUTS = [
  { key: '/', description: 'Open Global Search & Command Palette' },
  { key: '⌘ + K', description: 'Quick Command Palette toggle' },
  { key: 'G then I', description: 'Navigate directly to Incidents Workspace' },
  { key: 'G then A', description: 'Navigate directly to Alerts Console' },
  { key: 'G then S', description: 'Navigate directly to Sensors & Fleet' },
  { key: 'G then C', description: 'Navigate directly to Command Center' },
  { key: 'J / K', description: 'Navigate down / up through table rows' },
  { key: 'Enter', description: 'Open selected incident or entity' },
  { key: 'Esc', description: 'Close active drawer, modal, or command palette' },
  { key: '?', description: 'Show this keyboard shortcuts guide' },
];

export const KeyboardShortcutsModal: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans select-none animate-in fade-in duration-150">
    <div className="bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl max-w-md w-full p-5 space-y-4 text-[var(--zf-text-primary)]">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--zf-border-subtle)]">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-[var(--zf-brand-accent)]" />
          <h2 className="text-sm font-semibold tracking-tight">SOC Keyboard Shortcuts</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {KEYBOARD_SHORTCUTS.map((shortcut) => (
          <div
            key={shortcut.key}
            className="p-2.5 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs"
          >
            <span className="text-[var(--zf-text-secondary)]">{shortcut.description}</span>
            <kbd className="px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] font-mono text-[11px] text-[var(--zf-text-primary)] font-semibold">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-end border-t border-[var(--zf-border-subtle)]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-xs font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
