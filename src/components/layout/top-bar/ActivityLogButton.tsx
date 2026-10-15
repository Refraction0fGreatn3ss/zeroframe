import { Activity } from 'lucide-react';
import type React from 'react';

interface ActivityLogButtonProps {
  onOpen: () => void;
}

export const ActivityLogButton: React.FC<ActivityLogButtonProps> = ({ onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="relative flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-[var(--zf-text-primary)] transition-colors cursor-pointer text-xs font-mono shadow-xs"
    title="Open Real-Time Security Activity Log (Tracks system events, user logins, and threat alerts)"
    aria-label="Security Activity Log"
  >
    <Activity className="w-3.5 h-3.5 text-[var(--zf-brand-accent)] shrink-0" />
    <span className="hidden xl:inline text-[11px] font-medium">Activity Log</span>
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  </button>
);
