/**
 * Operator Idle Lock Screen
 * Recreated with precision:
 * - Official ZeroFrame brand asset
 * - Outlined circular lock icon
 * - "Operator session locked"
 * - Inactivity timeout reason
 * - Honest operational state strip (Monitoring active, Detection active, Response standby)
 * - Restrained unlock button & session footer connected to backend session authority
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/app-store';
import { useAuthStore } from '../stores/auth-store';
import { useDashboardStore } from '../stores/dashboard-store';
import { ZeroFlashLogoMark } from '../components/shared/ZeroFrameLogo';
import { Lock } from 'lucide-react';

export const LockScreenPage: React.FC = () => {
  const { setOperatorLocked, killSwitchEngaged } = useAppStore();
  const { unlock, logout, session, getRemainingInactivityMs, inactivityPolicy } = useAuthStore();
  const { metrics } = useDashboardStore();

  const [pin, setPin] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(getRemainingInactivityMs());

  // Inactivity countdown on locked screen
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMs(getRemainingInactivityMs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-brute force cooldown timer
  useEffect(() => {
    if (cooldownSecs <= 0) return;
    const interval = setInterval(() => {
      setCooldownSecs((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSecs]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSecs > 0) return;

    if (!showInput) {
      setShowInput(true);
      return;
    }

    setIsVerifying(true);
    const success = await unlock(pin);
    setIsVerifying(false);

    if (success) {
      setOperatorLocked(false);
      setFailedAttempts(0);
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      setError(true);
      setTimeout(() => setError(false), 2500);

      // Enforce brute-force backoff penalties
      if (nextFailures >= 5) {
        setCooldownSecs(30); // 30s lockout
      } else if (nextFailures >= 3) {
        setCooldownSecs(10); // 10s lockout
      }
    }
  };

  const remainingSecsTotal = Math.floor(remainingMs / 1000);
  const remMinutes = Math.floor(remainingSecsTotal / 60);
  const remSeconds = remainingSecsTotal % 60;
  const timeFormatted = `${remMinutes}:${remSeconds < 10 ? '0' : ''}${remSeconds}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[var(--zf-bg-app)]/95 backdrop-blur-md text-[var(--zf-text-primary)] select-none font-sans">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* ZeroFrame Logo Mark */}
        <div className="text-[var(--zf-brand-accent)]">
          <ZeroFlashLogoMark size={52} className="text-[var(--zf-brand-accent)]" />
        </div>

        {/* Circular Outlined Lock Icon */}
        <div className="w-14 h-14 rounded-full border border-[var(--zf-border-medium)] flex items-center justify-center text-[var(--zf-text-muted)] bg-[var(--zf-surface-card)]">
          <Lock className="w-5 h-5 stroke-[1.5]" />
        </div>

        {/* Headline & Reason */}
        <div className="space-y-1.5">
          <h1 className="text-base font-semibold tracking-wider text-[var(--zf-text-primary)] uppercase">
            Operator Session Locked
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Zero Remanence Guard ({inactivityPolicy})</span>
            <span className="text-[var(--zf-text-muted)] font-mono text-[11px]">
              (Key Purge: <span className="text-amber-400 font-semibold">{timeFormatted}</span>)
            </span>
          </div>
        </div>

        {/* Explanatory text */}
        <p className="text-xs text-[var(--zf-text-muted)] max-w-sm leading-relaxed">
          Monitoring remains active. Detection remains active.
          Response engine state unchanged. Total inactivity terminates session.
        </p>

        {/* Authoritative Operational State Box */}
        <div className="w-full max-w-md p-3.5 bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] rounded flex items-center justify-around text-xs font-sans">
          {/* Monitoring Active */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[var(--zf-text-muted)]">Monitoring</span>
            <span className="font-medium text-emerald-400">Active</span>
          </div>

          <div className="h-4 w-px bg-[var(--zf-border-subtle)]" />

          {/* Detection Active */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[var(--zf-text-muted)]">Detection</span>
            <span className="font-medium text-emerald-400">Active</span>
          </div>

          <div className="h-4 w-px bg-[var(--zf-border-subtle)]" />

          {/* Response State */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                killSwitchEngaged ? 'bg-amber-400' : 'bg-zinc-400'
              }`}
            />
            <span className="text-[var(--zf-text-muted)]">Response</span>
            <span
              className={`font-medium ${
                killSwitchEngaged ? 'text-amber-400' : 'text-[var(--zf-text-secondary)]'
              }`}
            >
              {killSwitchEngaged ? 'Blocked' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Unlock Action Form */}
        <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-2">
          {cooldownSecs > 0 && (
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center space-y-1">
              <div className="font-semibold text-rose-300">Rate Limit Backoff Enforced</div>
              <div className="text-[11px] text-[var(--zf-text-muted)]">
                Too many invalid PIN attempts. Retry in <span className="font-mono font-bold text-rose-400">{cooldownSecs}s</span>
              </div>
            </div>
          )}

          {showInput ? (
            <div className="space-y-2 animate-in fade-in duration-150">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter operator PIN or passphrase"
                className="w-full px-3 py-2 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] rounded text-center text-xs font-mono text-[var(--zf-text-primary)] placeholder:text-[var(--zf-text-muted)] focus:outline-hidden focus:border-[var(--zf-brand-accent)] tracking-widest disabled:opacity-50"
                autoFocus
                disabled={isVerifying || cooldownSecs > 0}
              />
              {error && (
                <div className="text-[11px] text-rose-400 font-sans">
                  Invalid authentication credentials ({failedAttempts} failed {failedAttempts === 1 ? 'attempt' : 'attempts'}).
                </div>
              )}
              <button
                type="submit"
                disabled={isVerifying || cooldownSecs > 0}
                className="w-full py-2 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {isVerifying ? 'Verifying with Authority...' : cooldownSecs > 0 ? `Locked (${cooldownSecs}s)` : 'Confirm Unlock'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="w-full py-2.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-[var(--zf-text-muted)]" />
              <span>Unlock Session</span>
            </button>
          )}
        </form>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setOperatorLocked(false);
              logout();
            }}
            className="text-[11px] text-[var(--zf-text-muted)] hover:text-rose-400 transition-colors cursor-pointer underline underline-offset-2"
          >
            Sign out & switch operator
          </button>
        </div>

        {/* Session Footer */}
        <div className="text-[11px] font-mono text-[var(--zf-text-muted)] uppercase tracking-wider pt-4">
          ZeroFrame Security Console · Session ID: {session?.sessionId || 'ZF-SESSION-PROD-8841'}
        </div>
      </div>
    </div>
  );
};
