import { EyeOff, Lock, RefreshCw, Shield, ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { InactivityPolicyKey } from '../../../stores/auth-store';
import { INACTIVITY_POLICY_OPTIONS } from './top-bar.data';

interface SecurityHudPanelProps {
  inactivityPolicy: InactivityPolicyKey;
  onChangePolicy: (policy: InactivityPolicyKey) => void;
  onExtendSession: () => void;
  onInspectCveDefenses: () => void;
  onEngagePrivacyShield: () => void;
  onLockConsole: () => void;
}

export const SecurityHudPanel: React.FC<SecurityHudPanelProps> = ({
  inactivityPolicy,
  onChangePolicy,
  onExtendSession,
  onInspectCveDefenses,
  onEngagePrivacyShield,
  onLockConsole,
}) => (
  <div className="absolute right-0 mt-1.5 w-80 p-3.5 rounded-lg shadow-2xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
    <div className="flex items-center justify-between pb-2 border-b border-[var(--zf-border-subtle)] mb-2.5">
      <div className="flex items-center gap-1.5 font-bold text-[var(--zf-text-primary)]">
        <Shield className="w-3.5 h-3.5 text-cyan-400" />
        <span>Session Security Controls</span>
      </div>
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
        NIST AC-12
      </span>
    </div>

    <div className="mb-3 space-y-1.5">
      <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-[var(--zf-text-muted)] tracking-wider">
        <span>Compliance Policy</span>
        <span className="font-mono text-cyan-400">{inactivityPolicy.toUpperCase()} Strict</span>
      </div>
      <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] rounded">
        {INACTIVITY_POLICY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChangePolicy(option.value)}
            className={`py-1 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
              inactivityPolicy === option.value
                ? 'bg-[var(--zf-brand-accent)] text-white shadow-xs font-bold'
                : 'text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-1.5 pt-1 border-t border-[var(--zf-border-subtle)]">
      <button
        type="button"
        onClick={onExtendSession}
        className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-opacity"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Extend Session (+{inactivityPolicy.toUpperCase()})</span>
      </button>

      <button
        type="button"
        onClick={onInspectCveDefenses}
        className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-emerald-500/30 text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <ShieldCheck className="w-3 h-3" />
        <span>Inspect 100 Major Web CVE Shields</span>
      </button>

      <button
        type="button"
        onClick={onEngagePrivacyShield}
        className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-cyan-500/30 text-cyan-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <EyeOff className="w-3 h-3" />
        <span>Engage DOM Privacy Shield</span>
      </button>

      <button
        type="button"
        onClick={onLockConsole}
        className="w-full py-1.5 px-2.5 rounded bg-[var(--zf-surface-subtle)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-amber-400 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Lock className="w-3 h-3" />
        <span>Lock Console Now</span>
      </button>
    </div>
  </div>
);
