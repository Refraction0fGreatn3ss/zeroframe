import { ShieldAlert } from 'lucide-react';
import { type FC, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { useEscape } from '../../hooks/use-escape';
import { type KeyValueEntry, KeyValueList } from './KeyValueList';

interface ConfirmActionDialogProps {
  title: string;
  description: ReactNode;
  details: KeyValueEntry[];
  confirmLabel: string;
  confirmationPhrase?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmActionDialog: FC<ConfirmActionDialogProps> = ({
  title,
  description,
  details,
  confirmLabel,
  confirmationPhrase,
  isSubmitting = false,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const phraseId = useId();
  const [typedPhrase, setTypedPhrase] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEscape(onCancel, !isSubmitting);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  const confirmBlocked = isSubmitting || (confirmationPhrase !== undefined && typedPhrase !== confirmationPhrase);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg bg-[var(--zf-surface-card)] border border-amber-500/40 rounded p-4 space-y-3"
      >
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
          <div>
            <h2 id={titleId} className="text-sm font-semibold text-[var(--zf-text-primary)]">
              {title}
            </h2>
            <div className="mt-1 text-[11px] text-[var(--zf-text-secondary)]">{description}</div>
          </div>
        </div>

        <KeyValueList entries={details} />

        {confirmationPhrase !== undefined && (
          <div className="space-y-1">
            <label htmlFor={phraseId} className="block text-[11px] text-[var(--zf-text-secondary)]">
              Type <span className="font-mono text-[var(--zf-text-primary)]">{confirmationPhrase}</span> to confirm
            </label>
            <input
              id={phraseId}
              value={typedPhrase}
              onChange={(event) => setTypedPhrase(event.target.value)}
              className="w-full px-2 py-1 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-medium)] text-xs font-mono text-[var(--zf-text-primary)] focus:outline focus:outline-2 focus:outline-[var(--zf-border-focus)]"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 rounded border border-[var(--zf-border-medium)] text-xs text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmBlocked}
            className="px-3 py-1.5 rounded border border-amber-500/50 bg-amber-500/15 text-xs font-semibold text-amber-200 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
