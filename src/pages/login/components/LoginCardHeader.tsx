import type { FC } from 'react';
import { ZeroFlashLogoMark } from '../../../components/shared/ZeroFrameLogo';

export const LoginCardHeader: FC = () => (
  <div className="flex flex-col items-center text-center space-y-3 mb-6">
    <div className="p-3 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-subtle)] text-[var(--zf-brand-accent)] shadow-inner">
      <ZeroFlashLogoMark size={36} className="text-[var(--zf-brand-accent)]" />
    </div>
    <div>
      <h1 className="text-lg font-bold text-[var(--zf-text-primary)] tracking-tight">Operator Security Gateway</h1>
      <p className="text-xs text-[var(--zf-text-muted)] mt-1">Zero-Trust Access Control & Live Detection Assurance</p>
    </div>
  </div>
);
