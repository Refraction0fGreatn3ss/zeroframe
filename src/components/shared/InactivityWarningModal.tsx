import { CheckCircle2, Clock, Lock, LogOut, ShieldAlert } from 'lucide-react';
import { type FC, useCallback, useEffect } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useAuthStore } from '../../stores/auth-store';
import { ZeroFlashLogoMark } from './ZeroFrameLogo';

const WARNING_WINDOW_SECONDS = 60;

const getPolicyComplianceLabel = (policy: string): string => {
  if (policy === '5m') return 'SCIF Maximum Defense (5m Strict)';
  if (policy === '10m') return 'PCI-DSS & HIPAA Compliance (10m Strict)';
  return 'NIST SP 800-53 AC-12 Compliance (15m Strict)';
};

const formatCountdown = (seconds: number): string => `00:${seconds < 10 ? `0${seconds}` : seconds}`;

const getRemainingPercent = (seconds: number): number =>
  Math.max(0, Math.min(100, (seconds / WARNING_WINDOW_SECONDS) * 100));

export const InactivityWarningModal: FC = () => {
  const { isWarningOpen, warningRemainingSeconds, acknowledgeActivity, logout, lock, inactivityPolicy } =
    useAuthStore();
  const { setOperatorLocked } = useAppStore();

  const lockConsole = useCallback(() => {
    setOperatorLocked(true);
    lock();
  }, [setOperatorLocked, lock]);

  useEffect(() => {
    if (!isWarningOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        acknowledgeActivity();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        lockConsole();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWarningOpen, acknowledgeActivity, lockConsole]);

  if (!isWarningOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans animate-in fade-in duration-200">
      <div className="bg-[var(--zf-surface-card)] border-2 border-amber-500/60 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.25)] max-w-md w-full p-6 text-[var(--zf-text-primary)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 animate-pulse" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-[var(--zf-text-primary)]">
                  Inactivity Timeout Warning
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                {getPolicyComplianceLabel(inactivityPolicy)}
              </span>
            </div>
          </div>
          <ZeroFlashLogoMark size={24} className="text-[var(--zf-brand-accent)] shrink-0 opacity-70" />
        </div>

        <div className="my-5 p-4 rounded-lg bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-xs text-[var(--zf-text-muted)] font-mono uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Session Revocation in</span>
          </div>

          <div className="text-4xl font-mono font-black tracking-widest text-amber-400 drop-shadow-sm my-1">
            {formatCountdown(warningRemainingSeconds)}
          </div>

          <p className="text-[11px] text-[var(--zf-text-muted)] mt-1">
            {inactivityPolicy} inactivity threshold reached. Cryptographic key purge imminent.
          </p>

          <div className="w-full bg-[var(--zf-surface-tertiary)] h-2 rounded-full mt-3 overflow-hidden border border-[var(--zf-border-subtle)]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${getRemainingPercent(warningRemainingSeconds)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-[var(--zf-text-secondary)] space-y-2 mb-6">
          <p className="leading-relaxed">
            To satisfy enterprise security controls and protect live telemetry, execution permits, and PCAP data from
            unauthorized access, this console will terminate and wipe memory unless activity is acknowledged.
          </p>
          <div className="text-[10px] font-mono text-[var(--zf-text-muted)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Cross-Tab Sync: Acknowledging here will extend all open consoles.</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={acknowledgeActivity}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            autoFocus
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Stay Logged In & Extend Session (Space/Enter)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={lockConsole}
              className="py-2 px-3 rounded-lg bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-medium)] text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="py-2 px-3 rounded-lg bg-[var(--zf-surface-tertiary)] hover:bg-rose-500/20 border border-[var(--zf-border-medium)] text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
