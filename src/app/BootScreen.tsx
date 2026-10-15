import { Loader2 } from 'lucide-react';
import type { FC } from 'react';

export const BootScreen: FC = () => (
  <div
    role="status"
    className="h-screen w-screen flex items-center justify-center bg-[var(--zf-bg-app)] text-[var(--zf-text-muted)]"
  >
    <span className="inline-flex items-center gap-2 text-xs">
      <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      Validating operator session with the ZeroFrame backend…
    </span>
  </div>
);
