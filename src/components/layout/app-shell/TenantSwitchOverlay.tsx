import type React from 'react';
import { ZeroFlashLogoMark } from '../../shared/ZeroFrameLogo';

interface TenantSwitchOverlayProps {
  tenantName: string;
}

export const TenantSwitchOverlay: React.FC<TenantSwitchOverlayProps> = ({ tenantName }) => (
  <div className="absolute inset-0 bg-[var(--zf-bg-app)]/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-100">
    <div className="p-3 rounded-full bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] mb-4 animate-spin text-[var(--zf-brand-accent)]">
      <ZeroFlashLogoMark size={32} className="text-[var(--zf-brand-accent)]" />
    </div>
    <h3 className="text-sm font-semibold text-[var(--zf-text-primary)] tracking-tight">
      Executing Hard Tenant Isolation Handshake
    </h3>
    <p className="text-xs text-[var(--zf-text-muted)] mt-1 max-w-sm">
      Aborting in-flight requests, clearing memory stores, and establishing cryptographic boundaries for{' '}
      <span className="font-semibold text-[var(--zf-text-primary)]">{tenantName}</span>.
    </p>
    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>Zero Leakage Verification in progress...</span>
    </div>
  </div>
);
