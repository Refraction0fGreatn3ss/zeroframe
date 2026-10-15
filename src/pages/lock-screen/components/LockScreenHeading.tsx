import { Lock } from 'lucide-react';
import type { FC } from 'react';
import { ZeroFlashLogoMark } from '../../../components/shared/ZeroFrameLogo';

interface LockScreenHeadingProps {
  inactivityPolicy: string;
  timeRemaining: string;
}

export const LockScreenHeading: FC<LockScreenHeadingProps> = ({ inactivityPolicy, timeRemaining }) => (
  <>
    <div className="text-[var(--zf-brand-accent)]">
      <ZeroFlashLogoMark size={52} className="text-[var(--zf-brand-accent)]" />
    </div>

    <div className="w-14 h-14 rounded-full border border-[var(--zf-border-medium)] flex items-center justify-center text-[var(--zf-text-muted)] bg-[var(--zf-surface-card)]">
      <Lock className="w-5 h-5 stroke-[1.5]" />
    </div>

    <div className="space-y-1.5">
      <h1 className="text-base font-semibold tracking-wider text-[var(--zf-text-primary)] uppercase">
        Operator Session Locked
      </h1>
      <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>Zero Remanence Guard ({inactivityPolicy})</span>
        <span className="text-[var(--zf-text-muted)] font-mono text-[11px]">
          (Key Purge: <span className="text-amber-400 font-semibold">{timeRemaining}</span>)
        </span>
      </div>
    </div>

    <p className="text-xs text-[var(--zf-text-muted)] max-w-sm leading-relaxed">
      Monitoring remains active. Detection remains active. Response engine state unchanged. Total inactivity terminates
      session.
    </p>
  </>
);
