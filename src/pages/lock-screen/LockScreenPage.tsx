import type { FC } from 'react';
import { useAppStore } from '../../stores/app-store';
import { useAuthStore } from '../../stores/auth-store';
import { useDashboardStore } from '../../stores/dashboard-store';
import { useKillSwitch } from '../../stores/kill-switch-store';
import { LockScreenHeading } from './components/LockScreenHeading';
import { OperationalStateStrip } from './components/OperationalStateStrip';
import { UnlockForm } from './components/UnlockForm';
import { useInactivityCountdown } from './hooks/use-inactivity-countdown';
import { usePinUnlock } from './hooks/use-pin-unlock';
import { formatCountdown } from './lock-screen.utils';

const FALLBACK_SESSION_ID = 'ZF-SESSION-PROD-8841';

export const LockScreenPage: FC = () => {
  const { setOperatorLocked } = useAppStore();
  const { state: killSwitch } = useKillSwitch();
  const { unlock, logout, session, getRemainingInactivityMs, inactivityPolicy } = useAuthStore();
  // Subscribed for parity with the original page; metrics are not rendered here.
  useDashboardStore();

  const remainingMs = useInactivityCountdown(getRemainingInactivityMs);
  const { pin, setPin, showInput, revealInput, error, isVerifying, failedAttempts, cooldownSecs, handleUnlock } =
    usePinUnlock({ unlock, onUnlocked: () => setOperatorLocked(false) });

  const handleSignOut = () => {
    setOperatorLocked(false);
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[var(--zf-bg-app)]/95 backdrop-blur-md text-[var(--zf-text-primary)] select-none font-sans">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        <LockScreenHeading inactivityPolicy={inactivityPolicy} timeRemaining={formatCountdown(remainingMs)} />

        <OperationalStateStrip killSwitch={killSwitch} />

        <UnlockForm
          pin={pin}
          showInput={showInput}
          error={error}
          isVerifying={isVerifying}
          failedAttempts={failedAttempts}
          cooldownSecs={cooldownSecs}
          onPinChange={setPin}
          onRevealInput={revealInput}
          onSubmit={handleUnlock}
        />

        <div className="pt-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-[11px] text-[var(--zf-text-muted)] hover:text-rose-400 transition-colors cursor-pointer underline underline-offset-2"
          >
            Sign out & switch operator
          </button>
        </div>

        <div className="text-[11px] font-mono text-[var(--zf-text-muted)] uppercase tracking-wider pt-4">
          ZeroFrame Security Console · Session ID: {session?.sessionId || FALLBACK_SESSION_ID}
        </div>
      </div>
    </div>
  );
};
