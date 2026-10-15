import { Check, Copy } from 'lucide-react';
import type { FC } from 'react';
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';

interface CopyableValueProps {
  value: string;
  label?: string;
  className?: string;
}

export const CopyableValue: FC<CopyableValueProps> = ({ value, label, className = '' }) => {
  const { copiedKey, copy } = useCopyToClipboard();
  const copied = copiedKey === value;

  return (
    <span className={`inline-flex items-center gap-1 font-mono select-text ${className}`}>
      <span className="truncate">{value}</span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          copy(value);
        }}
        aria-label={`Copy ${label ?? value}`}
        className="shrink-0 p-0.5 rounded text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--zf-border-focus)]"
      >
        {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
      </button>
    </span>
  );
};
