import { AlertTriangle } from 'lucide-react';
import type { FC } from 'react';

interface AuthNoticeProps {
  isAutoLoggedOut: boolean;
  inactivityPolicy: string;
  authError: string | null;
}

export const AuthNotice: FC<AuthNoticeProps> = ({ isAutoLoggedOut, inactivityPolicy, authError }) => {
  if (isAutoLoggedOut) {
    return (
      <div className="mb-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5 animate-in fade-in duration-200">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Zero Remanence Inactivity Enforcement ({inactivityPolicy})</span>
        </div>
        <p className="text-[11px] text-[var(--zf-text-secondary)] leading-relaxed">
          Pursuant to the active {inactivityPolicy} enterprise security compliance policy, your session was terminated
          due to operator inactivity. All in-memory bearer tokens, cryptographic keys, and cached state were destroyed
          with zero data remanence.
        </p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="mb-4 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{authError}</span>
      </div>
    );
  }

  return null;
};
