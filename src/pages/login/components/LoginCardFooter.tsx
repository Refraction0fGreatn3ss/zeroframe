import { Shield } from 'lucide-react';
import type { FC } from 'react';

export const LoginCardFooter: FC = () => (
  <div className="mt-6 pt-4 border-t border-[var(--zf-border-subtle)] flex items-center justify-between text-[10px] text-[var(--zf-text-muted)] font-mono">
    <span className="flex items-center gap-1">
      <Shield className="w-3 h-3 text-emerald-400" />
      <span>TLS 1.3 · JA4 Verified</span>
    </span>
    <span>ZeroFrame 1.0.0-PROD</span>
  </div>
);
