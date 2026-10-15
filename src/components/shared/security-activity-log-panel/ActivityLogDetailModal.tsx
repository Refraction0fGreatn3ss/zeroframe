import { ExternalLink, X } from 'lucide-react';
import type React from 'react';
import type { SecurityActivityItem } from '../../../types/activity-log';
import { ActivityLogDetailMetadata } from './ActivityLogDetailMetadata';
import { ActivityLogPayload } from './ActivityLogPayload';
import { CATEGORY_PIVOT_ACTIONS } from './activity-log.data';
import { CategoryIcon } from './CategoryIcon';
import { SeverityBadge } from './SeverityBadge';

const COPY_ID_IP = 'ip';
const COPY_ID_PAYLOAD = 'payload';

interface ActivityLogDetailModalProps {
  log: SecurityActivityItem;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onPivot: (path: string) => void;
  onClose: () => void;
}

export const ActivityLogDetailModal: React.FC<ActivityLogDetailModalProps> = ({
  log,
  copiedId,
  onCopy,
  onPivot,
  onClose,
}) => {
  const pivot = CATEGORY_PIVOT_ACTIONS[log.category];
  const formattedPayload = log.payload ? JSON.stringify(log.payload, null, 2) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[var(--zf-surface-card)] border border-[var(--zf-border-medium)] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-100 text-xs font-sans">
        <div className="p-3.5 border-b border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)]">
              <CategoryIcon category={log.category} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold text-[var(--zf-brand-accent)]">{log.id}</span>
                <span className="text-[var(--zf-text-muted)]">·</span>
                <SeverityBadge severity={log.severity} />
              </div>
              <h3 className="font-semibold text-xs text-[var(--zf-text-primary)] mt-0.5">{log.title}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--zf-surface-card-hover)] text-[var(--zf-text-muted)] hover:text-[var(--zf-text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 font-sans">
          <div className="p-3 rounded bg-[var(--zf-surface-subtle)] border border-[var(--zf-border-subtle)] space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--zf-text-muted)]">
              Executive Incident Summary
            </span>
            <p className="text-xs text-[var(--zf-text-primary)] leading-relaxed">{log.description}</p>
          </div>

          <ActivityLogDetailMetadata
            log={log}
            isIpCopied={copiedId === COPY_ID_IP}
            onCopyIp={() => onCopy(log.sourceIp, COPY_ID_IP)}
          />

          {formattedPayload && (
            <ActivityLogPayload
              formattedPayload={formattedPayload}
              isCopied={copiedId === COPY_ID_PAYLOAD}
              onCopy={() => onCopy(formattedPayload, COPY_ID_PAYLOAD)}
            />
          )}
        </div>

        <div className="p-3 border-t border-[var(--zf-border-subtle)] bg-[var(--zf-surface-subtle)] flex items-center justify-between">
          <span className="font-mono text-[10px] text-[var(--zf-text-muted)]">Logged: {log.timestamp}</span>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onPivot(pivot.path)} className={pivot.className}>
              <span>{pivot.label}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-[var(--zf-surface-card)] border border-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)] hover:text-[var(--zf-text-primary)] text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
