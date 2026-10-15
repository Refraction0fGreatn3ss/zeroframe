import type { FC } from 'react';
import { ThemeSwitcher } from '../../../components/shared/ThemeSwitcher';
import { ZeroFlashLogoMark } from '../../../components/shared/ZeroFrameLogo';

export const LoginTopBar: FC = () => (
  <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
    <div className="flex items-center gap-2.5">
      <ZeroFlashLogoMark size={24} className="text-[var(--zf-brand-accent)] shrink-0" />
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-xs tracking-wider text-[var(--zf-text-primary)] uppercase">ZeroFrame</span>
        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[var(--zf-surface-tertiary)] text-[var(--zf-text-muted)] font-medium">
          Enterprise 1.0
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--zf-text-muted)] font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Cluster: DEF-EU-PROD-01</span>
      </div>
      <ThemeSwitcher variant="compact" />
    </div>
  </header>
);
