import { ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { InactivityPolicyKey } from '../../../stores/auth-store';
import { SecurityHudPanel } from './SecurityHudPanel';
import type { CountdownUrgency } from './top-bar.utils';
import { formatCountdown, getCountdownUrgency, toWholeSeconds } from './top-bar.utils';
import { useDismissablePopover } from './use-dismissable-popover';

const TRIGGER_URGENCY_CLASS: Record<CountdownUrgency, string> = {
  critical: 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  normal: 'bg-[var(--zf-surface-tertiary)] border-[var(--zf-border-subtle)] hover:border-slate-700 text-slate-300',
};

const ICON_URGENCY_CLASS: Record<CountdownUrgency, string> = {
  critical: 'text-rose-400',
  warning: 'text-amber-400',
  normal: 'text-emerald-400',
};

interface SecurityHudProps {
  remainingMs: number;
  inactivityPolicy: InactivityPolicyKey;
  onChangePolicy: (policy: InactivityPolicyKey) => void;
  onExtendSession: () => void;
  onInspectCveDefenses: () => void;
  onEngagePrivacyShield: () => void;
  onLockConsole: () => void;
}

export const SecurityHud: React.FC<SecurityHudProps> = ({
  remainingMs,
  inactivityPolicy,
  onChangePolicy,
  onExtendSession,
  onInspectCveDefenses,
  onEngagePrivacyShield,
  onLockConsole,
}) => {
  const { isOpen, toggle, close, containerRef } = useDismissablePopover();
  const remainingSeconds = toWholeSeconds(remainingMs);
  const urgency = getCountdownUrgency(remainingSeconds);

  const runAndClose = (action: () => void) => () => {
    action();
    close();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${TRIGGER_URGENCY_CLASS[urgency]}`}
        title="Session Inactivity HUD & Defense Controls"
      >
        <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${ICON_URGENCY_CLASS[urgency]}`} />
        <span className="text-slate-400 hidden lg:inline">{inactivityPolicy}:</span>
        <span className="font-semibold tabular-nums text-[11px]">{formatCountdown(remainingSeconds)}</span>
      </button>

      {isOpen && (
        <SecurityHudPanel
          inactivityPolicy={inactivityPolicy}
          onChangePolicy={onChangePolicy}
          onExtendSession={runAndClose(onExtendSession)}
          onInspectCveDefenses={runAndClose(onInspectCveDefenses)}
          onEngagePrivacyShield={runAndClose(onEngagePrivacyShield)}
          onLockConsole={runAndClose(onLockConsole)}
        />
      )}
    </div>
  );
};
