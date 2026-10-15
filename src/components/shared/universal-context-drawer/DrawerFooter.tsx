import type React from 'react';

interface DrawerFooterProps {
  onClose: () => void;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ onClose }) => (
  <div className="p-4 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] flex items-center justify-between text-xs">
    <span className="text-[11px] text-[var(--zf-text-muted)] font-mono">ZeroFrame Universal Context</span>
    <button
      type="button"
      onClick={onClose}
      className="px-3 py-1.5 rounded bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer"
    >
      Close Drawer
    </button>
  </div>
);
