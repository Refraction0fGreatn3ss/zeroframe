import type React from 'react';
import { ZeroFlashLogoMark } from '../../shared/ZeroFrameLogo';

interface BrandHomeLinkProps {
  onNavigateHome: () => void;
}

export const BrandHomeLink: React.FC<BrandHomeLinkProps> = ({ onNavigateHome }) => (
  <div
    onClick={onNavigateHome}
    className="flex items-center gap-2 cursor-pointer group pr-2.5 sm:pr-3 border-r border-[var(--zf-border-subtle)]"
    title="ZeroFlash Enterprise 1.0 · Engine: ZeroFrame 3.2 — Return to Command Center"
  >
    <ZeroFlashLogoMark
      size={20}
      className="text-[var(--zf-brand-accent)] shrink-0 transition-transform group-hover:scale-105"
    />
    <span className="font-bold text-xs tracking-wider text-[var(--zf-text-primary)] uppercase">ZeroFlash 1.0</span>
  </div>
);
