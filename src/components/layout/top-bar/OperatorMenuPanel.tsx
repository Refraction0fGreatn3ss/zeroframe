import { Laptop, Lock, LogOut, ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { OperatorIdentity } from '../../../services/auth-service';
import type { ViewMode } from '../../../stores/app-store';
import { ThemeSwitcher } from '../../shared/ThemeSwitcher';
import { VIEW_MODE_OPTIONS } from './top-bar.data';

interface OperatorMenuPanelProps {
  operator: OperatorIdentity | null;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  onInspectCveDefenses: () => void;
  onOpenSessions: () => void;
  onLockConsole: () => void;
  onSignOut: () => void;
}

export const OperatorMenuPanel: React.FC<OperatorMenuPanelProps> = ({
  operator,
  viewMode,
  onSelectViewMode,
  onInspectCveDefenses,
  onOpenSessions,
  onLockConsole,
  onSignOut,
}) => (
  <div className="absolute right-0 mt-1.5 w-64 p-2 rounded-md shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
    <div className="px-2.5 py-2 border-b border-[var(--zf-border-subtle)] mb-1.5">
      <div className="font-semibold text-[var(--zf-text-primary)]">{operator?.displayName || 'Sarah Chen, CISSP'}</div>
      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{operator?.role || 'Lead Incident Commander'}</div>
      <div className="text-[10px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>Clearance: {operator?.clearanceLevel || 'TOP_SECRET'}</span>
      </div>
    </div>

    <div className="px-2 py-1 space-y-1 border-b border-[var(--zf-border-subtle)] pb-2 mb-1.5">
      <span className="text-[10px] uppercase font-semibold text-slate-400">SOC Console Mode</span>
      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#060911] border border-slate-800 rounded">
        {VIEW_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelectViewMode(option.value)}
            className={`py-1 text-[11px] rounded transition-colors cursor-pointer ${
              viewMode === option.value
                ? 'bg-slate-800 text-cyan-300 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>

    <div className="px-2 py-1 space-y-1 border-b border-[var(--zf-border-subtle)] pb-2 mb-1.5">
      <span className="text-[10px] uppercase font-semibold text-slate-400">Console Appearance</span>
      <ThemeSwitcher variant="full" className="w-full" />
    </div>

    <button
      type="button"
      onClick={onInspectCveDefenses}
      className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:text-cyan-300 hover:bg-[var(--zf-surface-card-hover)] flex items-center justify-between cursor-pointer"
    >
      <span>100 Web CVE Shield</span>
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
    </button>

    <button
      type="button"
      onClick={onOpenSessions}
      className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:text-slate-100 hover:bg-[var(--zf-surface-card-hover)] flex items-center justify-between cursor-pointer"
    >
      <span>Active Operator Sessions</span>
      <Laptop className="w-3.5 h-3.5 text-slate-400" />
    </button>

    <div className="my-1 border-t border-[var(--zf-border-subtle)]" />

    <button
      type="button"
      onClick={onLockConsole}
      className="w-full text-left px-2.5 py-1.5 rounded text-amber-400 hover:bg-[var(--zf-surface-card-hover)] flex items-center gap-2 cursor-pointer"
    >
      <Lock className="w-3.5 h-3.5" />
      <span>Lock Console</span>
    </button>

    <button
      type="button"
      onClick={onSignOut}
      className="w-full text-left px-2.5 py-1.5 rounded text-rose-400 hover:bg-[var(--zf-surface-card-hover)] flex items-center gap-2 cursor-pointer mt-0.5"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  </div>
);
