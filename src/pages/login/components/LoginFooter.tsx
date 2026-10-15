import type { FC } from 'react';

export const LoginFooter: FC = () => (
  <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--zf-text-muted)] gap-2 z-10">
    <div>
      <span>ZeroFrame Enterprise NDR & Response Platform</span>
    </div>
    <div className="flex items-center gap-3">
      <span>Tenant Isolation: Enforced</span>
      <span>·</span>
      <span>Tamper Seal: Verified</span>
    </div>
  </footer>
);
