import { Lock } from 'lucide-react';
import type { FC, FormEvent } from 'react';

interface UnlockFormProps {
  pin: string;
  showInput: boolean;
  error: boolean;
  isVerifying: boolean;
  failedAttempts: number;
  cooldownSecs: number;
  onPinChange: (value: string) => void;
  onRevealInput: () => void;
  onSubmit: (e: FormEvent) => void;
}

export const UnlockForm: FC<UnlockFormProps> = ({
  pin,
  showInput,
  error,
  isVerifying,
  failedAttempts,
  cooldownSecs,
  onPinChange,
  onRevealInput,
  onSubmit,
}) => {
  const isCoolingDown = cooldownSecs > 0;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xs space-y-2">
      {isCoolingDown && (
        <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center space-y-1">
          <div className="font-semibold text-rose-300">Rate Limit Backoff Enforced</div>
          <div className="text-[11px] text-[var(--zf-text-muted)]">
            Too many invalid PIN attempts. Retry in{' '}
            <span className="font-mono font-bold text-rose-400">{cooldownSecs}s</span>
          </div>
        </div>
      )}

      {showInput ? (
        <div className="space-y-2 animate-in fade-in duration-150">
          <input
            type="password"
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Enter operator PIN or passphrase"
            className="w-full px-3 py-2 bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] rounded text-center text-xs font-mono text-[var(--zf-text-primary)] placeholder:text-[var(--zf-text-muted)] focus:outline-hidden focus:border-[var(--zf-brand-accent)] tracking-widest disabled:opacity-50"
            autoFocus
            disabled={isVerifying || isCoolingDown}
          />
          {error && (
            <div className="text-[11px] text-rose-400 font-sans">
              Invalid authentication credentials ({failedAttempts} failed{' '}
              {failedAttempts === 1 ? 'attempt' : 'attempts'}).
            </div>
          )}
          <button
            type="submit"
            disabled={isVerifying || isCoolingDown}
            className="w-full py-2 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
          >
            {isVerifying
              ? 'Verifying with Authority...'
              : isCoolingDown
                ? `Locked (${cooldownSecs}s)`
                : 'Confirm Unlock'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onRevealInput}
          className="w-full py-2.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
        >
          <Lock className="w-3.5 h-3.5 text-[var(--zf-text-muted)]" />
          <span>Unlock Session</span>
        </button>
      )}
    </form>
  );
};
