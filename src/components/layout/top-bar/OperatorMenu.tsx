import { ChevronDown } from 'lucide-react';
import type React from 'react';
import type { OperatorIdentity } from '../../../services/auth-service';
import type { ViewMode } from '../../../stores/app-store';
import { OperatorMenuPanel } from './OperatorMenuPanel';
import { useDismissablePopover } from './use-dismissable-popover';

interface OperatorMenuProps {
  operator: OperatorIdentity | null;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  onInspectCveDefenses: () => void;
  onOpenSessions: () => void;
  onLockConsole: () => void;
  onSignOut: () => void;
}

export const OperatorMenu: React.FC<OperatorMenuProps> = ({
  operator,
  viewMode,
  onSelectViewMode,
  onInspectCveDefenses,
  onOpenSessions,
  onLockConsole,
  onSignOut,
}) => {
  const { isOpen, toggle, close, containerRef } = useDismissablePopover();

  const closeThen = (action: () => void) => () => {
    close();
    action();
  };

  const runThenClose = (action: () => void) => () => {
    action();
    close();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer border border-transparent hover:border-[var(--zf-border-subtle)]"
      >
        <div className="w-5 h-5 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold">
          {operator?.displayName?.slice(0, 2).toUpperCase() || 'OP'}
        </div>
        <span className="hidden xl:inline text-xs font-medium">{operator?.username || 'sec-operator'}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <OperatorMenuPanel
          operator={operator}
          viewMode={viewMode}
          onSelectViewMode={(mode) => {
            onSelectViewMode(mode);
            close();
          }}
          onInspectCveDefenses={runThenClose(onInspectCveDefenses)}
          onOpenSessions={closeThen(onOpenSessions)}
          onLockConsole={runThenClose(onLockConsole)}
          onSignOut={closeThen(onSignOut)}
        />
      )}
    </div>
  );
};
