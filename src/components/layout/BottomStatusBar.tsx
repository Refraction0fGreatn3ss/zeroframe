import { ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useAuthStore } from '../../stores/auth-store';

const SHORTCUT_KEY_CLASS =
  'px-1 py-0.2 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[10px] text-[var(--zf-text-primary)]';

export const BottomStatusBar: React.FC = () => {
  const { inactivityPolicy } = useAuthStore();

  return (
    <footer className="h-6 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-topbar)] px-3.5 flex items-center justify-between text-[11px] font-mono text-[var(--zf-text-muted)] select-none shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[var(--zf-text-secondary)]">
          <kbd className={SHORTCUT_KEY_CLASS}>/</kbd>
          <span>Command Palette</span>
        </div>
        <span className="text-[var(--zf-border-medium)]">·</span>
        <div className="hidden sm:flex items-center gap-1.5 text-[var(--zf-text-secondary)]">
          <kbd className={SHORTCUT_KEY_CLASS}>?</kbd>
          <span>Shortcuts</span>
        </div>
        <span className="text-[var(--zf-border-medium)] hidden sm:inline">·</span>
        <div className="hidden md:flex items-center gap-1.5 text-[var(--zf-text-secondary)]">
          <kbd className={SHORTCUT_KEY_CLASS}>g</kbd>
          <span>+</span>
          <kbd className={SHORTCUT_KEY_CLASS}>i</kbd>
          <span>Jump to Incidents</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--zf-text-muted)]">Capture Tap:</span>
          <span className="text-[var(--zf-text-primary)] font-semibold">10G SFP28 Optical Diode</span>
        </div>
        <span className="text-[var(--zf-border-medium)]">·</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[var(--zf-text-secondary)]">Policy: {inactivityPolicy}</span>
        </div>
      </div>
    </footer>
  );
};
