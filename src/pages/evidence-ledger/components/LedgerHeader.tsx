import { Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import type React from 'react';

interface LedgerHeaderProps {
  isLoading: boolean;
  isVerifying: boolean;
  onSync: () => void;
  onVerify: () => void;
}

export const LedgerHeader: React.FC<LedgerHeaderProps> = ({ isLoading, isVerifying, onSync, onVerify }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--zf-border-subtle)]">
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-[var(--zf-text-primary)] tracking-tight flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--zf-brand-accent)]" />
          <span>Cryptographic Evidence Ledger</span>
        </h1>
        <span className="text-[var(--zf-text-muted)]">·</span>
        <span className="text-xs font-mono text-[var(--zf-brand-accent)] font-medium">
          Tamper-Evident SHA-256 Merkle Chain
        </span>
      </div>
      <p className="text-xs text-[var(--zf-text-muted)] mt-0.5">
        Immutable block sequence proving chronological chain-of-custody for packet ring slices, quarantine rules, and
        operator permits.
      </p>
    </div>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSync}
        disabled={isLoading}
        className="px-2.5 py-1.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] hover:border-[var(--zf-border-medium)] text-xs font-mono text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer flex items-center gap-1.5"
        title="Reload ledger from authoritative backend"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        <span>Sync</span>
      </button>

      <button
        type="button"
        onClick={onVerify}
        disabled={isVerifying}
        className="px-3 py-1.5 rounded bg-[var(--zf-surface-tertiary)] border border-[var(--zf-border-medium)] hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-primary)] text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-xs"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{isVerifying ? 'Validating Merkle Tree...' : 'Verify Cryptographic Chain'}</span>
      </button>
    </div>
  </div>
);
