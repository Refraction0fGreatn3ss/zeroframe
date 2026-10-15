import { X } from 'lucide-react';
import { type FC, type ReactNode, useEffect, useId, useRef } from 'react';
import { useEscape } from '../../hooks/use-escape';

interface SideDrawerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  children: ReactNode;
  widthClassName?: string;
}

export const SideDrawer: FC<SideDrawerProps> = ({
  title,
  subtitle,
  onClose,
  actions,
  children,
  widthClassName = 'w-full max-w-xl',
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useEscape(onClose);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 bg-black/60 cursor-default"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative h-full ${widthClassName} bg-[var(--zf-surface-card)] border-l border-[var(--zf-border-subtle)] flex flex-col outline-none`}
      >
        <header className="flex items-start justify-between gap-3 p-4 border-b border-[var(--zf-border-subtle)]">
          <div className="min-w-0">
            <h2 id={titleId} className="text-sm font-semibold text-[var(--zf-text-primary)] truncate">
              {title}
            </h2>
            {subtitle && <div className="mt-0.5 text-[11px] text-[var(--zf-text-secondary)]">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--zf-border-focus)]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
        {actions && (
          <footer className="p-3 border-t border-[var(--zf-border-subtle)] flex flex-wrap gap-2">{actions}</footer>
        )}
      </div>
    </div>
  );
};

interface DrawerSectionProps {
  title: string;
  children: ReactNode;
}

export const DrawerSection: FC<DrawerSectionProps> = ({ title, children }) => (
  <section aria-label={title} className="space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)]">{title}</h3>
    {children}
  </section>
);
