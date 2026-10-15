import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type React from 'react';
import type { ContextType } from '../../../stores/context-drawer-store';

interface DrawerHeaderProps {
  type: ContextType;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onClose: () => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  type,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onClose,
}) => (
  <div className="p-4 border-b border-[var(--zf-border-subtle)] flex items-center justify-between bg-[var(--zf-surface-topbar)]">
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 border border-[var(--zf-border-subtle)] rounded bg-[var(--zf-surface-tertiary)] p-0.5">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] disabled:opacity-30 disabled:pointer-events-none text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] cursor-pointer"
          title="Back in investigation trail"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] disabled:opacity-30 disabled:pointer-events-none text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] cursor-pointer"
          title="Forward in investigation trail"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] font-semibold uppercase tracking-wider">
        {type}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] border border-[var(--zf-border-subtle)]">
        ESC
      </kbd>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded hover:bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] cursor-pointer transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
