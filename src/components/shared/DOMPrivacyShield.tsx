import { Eye, EyeOff, Lock, LogOut, ShieldCheck } from 'lucide-react';
import type { FC } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useAuthStore } from '../../stores/auth-store';
import { ZeroFlashLogoMark } from './ZeroFrameLogo';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

const formatMinutesSeconds = (ms: number): string => {
  const totalSeconds = Math.floor(ms / MS_PER_SECOND);
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const DOMPrivacyShield: FC = () => {
  const {
    isPrivacyShieldActive,
    togglePrivacyShield,
    acknowledgeActivity,
    getRemainingInactivityMs,
    inactivityPolicy,
    lock,
    logout,
    isAuthenticated,
  } = useAuthStore();
  const { setOperatorLocked } = useAppStore();

  if (!isPrivacyShieldActive || !isAuthenticated) return null;

  const timeFormatted = formatMinutesSeconds(getRemainingInactivityMs());

  const lockConsole = () => {
    setOperatorLocked(true);
    lock();
  };

  return (
    <div
      className="fixed inset-0 z-45 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-2xl text-[var(--zf-text-primary)] select-none font-sans animate-in fade-in duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <div className="max-w-md w-full bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 flex flex-col items-center text-center relative z-10 space-y-5">
        <div className="flex items-center gap-2">
          <ZeroFlashLogoMark size={28} className="text-[var(--zf-brand-accent)]" />
          <span className="font-semibold text-xs tracking-wider text-[var(--zf-text-primary)] uppercase">
            ZeroFrame Enterprise 1.0
          </span>
        </div>

        <div className="w-16 h-16 rounded-full bg-[var(--zf-surface-tertiary)] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <EyeOff className="w-7 h-7 stroke-[1.75]" />
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            Restricted Operational Boundary · DOM Obfuscated
          </div>
          <h2 className="text-base font-bold text-[var(--zf-text-primary)] tracking-tight">
            Privacy Screen Shield Engaged
          </h2>
          <p className="text-xs text-[var(--zf-text-muted)] leading-relaxed max-w-sm">
            Active telemetry, incident dossiers, and cryptographic permits are shielded against unauthorized observation
            pursuant to the{' '}
            <span className="font-semibold text-[var(--zf-text-primary)]">{inactivityPolicy} policy profile</span>.
          </p>
        </div>

        <div className="w-full p-3 rounded-lg bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[var(--zf-text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Key Purge Countdown:</span>
          </div>
          <span className="text-cyan-400 font-bold text-sm tracking-wider">{timeFormatted}</span>
        </div>

        <div className="text-[9px] font-mono text-[var(--zf-text-muted)]/70 uppercase tracking-widest">
          SEAL-HASH: 8f4b·219c·77e1·ac04 · ZERO REMANENCE ACTIVE
        </div>

        <div className="w-full space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              togglePrivacyShield(false);
              acknowledgeActivity();
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            autoFocus
          >
            <Eye className="w-4 h-4" />
            <span>Verify & De-obfuscate Display</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={lockConsole}
              className="py-2 px-3 rounded-lg bg-[var(--zf-surface-tertiary)] hover:bg-[var(--zf-surface-card-hover)] border border-[var(--zf-border-subtle)] text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="py-2 px-3 rounded-lg bg-[var(--zf-surface-tertiary)] hover:bg-rose-500/20 border border-[var(--zf-border-subtle)] text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out & Purge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
