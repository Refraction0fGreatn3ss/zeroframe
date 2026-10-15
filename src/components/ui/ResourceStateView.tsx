import { AlertTriangle, Ban, CloudOff, FileQuestion, Loader2, Lock } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import type { LoadIssue, LoadState } from '../../lib/load-state';

interface ResourceStateViewProps {
  loadState: LoadState;
  issue: LoadIssue | null;
  onRetry?: () => void;
  emptyMessage?: string;
  children: ReactNode;
}

interface StateMessage {
  icon: ReactNode;
  title: string;
  detail: string;
}

function unavailableMessage(issue: LoadIssue | null): StateMessage {
  if (issue?.kind === 'CONTRACT_REQUIRED') {
    return {
      icon: <FileQuestion className="w-5 h-5" />,
      title: 'Backend contract required',
      detail: `No ZeroFrame backend endpoint is defined for this capability yet${issue.contract ? ` (${issue.contract})` : ''}. Nothing is shown rather than unverified data.`,
    };
  }
  return {
    icon: <CloudOff className="w-5 h-5" />,
    title: 'Backend unavailable',
    detail: issue?.message ?? 'The ZeroFrame backend did not respond. State is UNKNOWN until it does.',
  };
}

function messageFor(loadState: LoadState, issue: LoadIssue | null, emptyMessage: string): StateMessage | null {
  switch (loadState) {
    case 'IDLE':
    case 'LOADING':
      return {
        icon: <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" />,
        title: 'Loading',
        detail: 'Requesting authoritative state from the backend.',
      };
    case 'EMPTY':
      return { icon: <FileQuestion className="w-5 h-5" />, title: 'No records', detail: emptyMessage };
    case 'UNAVAILABLE':
      return unavailableMessage(issue);
    case 'PERMISSION_DENIED':
      return {
        icon: <Lock className="w-5 h-5" />,
        title: 'Permission denied',
        detail: issue?.message ?? 'Your role is not authorized for this data.',
      };
    case 'NOT_SUPPORTED':
      return {
        icon: <Ban className="w-5 h-5" />,
        title: 'Not supported',
        detail: issue?.message ?? 'The connected backend does not support this capability.',
      };
    case 'ERROR':
      return {
        icon: <AlertTriangle className="w-5 h-5" />,
        title: 'Request failed',
        detail: issue?.message ?? 'The backend returned an error.',
      };
    default:
      return null;
  }
}

export const ResourceStateView: FC<ResourceStateViewProps> = ({
  loadState,
  issue,
  onRetry,
  emptyMessage = 'The backend returned no records for this scope.',
  children,
}) => {
  const message = messageFor(loadState, issue, emptyMessage);
  if (!message) {
    return (
      <>
        {loadState === 'STALE' && (
          <div
            role="status"
            className="mb-2 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-300"
          >
            Showing last known data. It is stale and may no longer reflect backend state.
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center border border-dashed border-[var(--zf-border-subtle)] rounded bg-[var(--zf-surface-card)]"
    >
      <div className="text-[var(--zf-text-muted)]">{message.icon}</div>
      <div className="text-xs font-semibold text-[var(--zf-text-primary)]">{message.title}</div>
      <p className="text-[11px] text-[var(--zf-text-secondary)] max-w-md">{message.detail}</p>
      {issue?.correlationId && (
        <p className="text-[10px] font-mono text-[var(--zf-text-muted)] select-all">
          Correlation ID: {issue.correlationId}
        </p>
      )}
      {onRetry && loadState !== 'IDLE' && loadState !== 'LOADING' && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 px-2.5 py-1 rounded border border-[var(--zf-border-medium)] text-[11px] text-[var(--zf-text-primary)] hover:bg-[var(--zf-surface-card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--zf-border-focus)]"
        >
          Retry
        </button>
      )}
    </div>
  );
};
