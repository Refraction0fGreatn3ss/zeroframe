import { AlertTriangle, ArrowRight, KeyRound } from 'lucide-react';
import type { FC, FormEvent } from 'react';
import { TOTP_CODE_LENGTH } from '../login.data';

interface StepUpMfaFormProps {
  totpCode: string;
  stepUpError: string | null;
  isLoading: boolean;
  onTotpCodeChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export const StepUpMfaForm: FC<StepUpMfaFormProps> = ({
  totpCode,
  stepUpError,
  isLoading,
  onTotpCodeChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="p-3 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-xs text-[var(--zf-text-secondary)] space-y-1">
      <div className="flex items-center gap-1.5 font-semibold text-[var(--zf-text-primary)]">
        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
        <span>Dual-Control Step-Up Required</span>
      </div>
      <p className="text-[11px] text-[var(--zf-text-muted)]">
        Enter the 6-digit TOTP verification code from your hardware token or mobile authenticator app.
      </p>
    </div>

    {stepUpError && (
      <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>{stepUpError}</span>
      </div>
    )}

    <div>
      <label className="block text-[11px] font-semibold text-[var(--zf-text-secondary)] uppercase tracking-wider mb-1.5">
        6-Digit Authenticator Token
      </label>
      <input
        type="text"
        maxLength={TOTP_CODE_LENGTH}
        value={totpCode}
        onChange={(e) => onTotpCodeChange(e.target.value)}
        placeholder="884100"
        className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] focus:border-[var(--zf-brand-accent)] text-[var(--zf-text-primary)] focus:outline-hidden"
        autoFocus
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-2.5 px-4 rounded bg-[var(--zf-brand-accent)] hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
    >
      <span>Verify & Elevate Session</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </form>
);
