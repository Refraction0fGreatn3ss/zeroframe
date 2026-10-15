import { type ApiErrorKind, isApiError } from '../services/api-error';

export type LoadState =
  | 'IDLE'
  | 'LOADING'
  | 'READY'
  | 'EMPTY'
  | 'STALE'
  | 'ERROR'
  | 'UNAVAILABLE'
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED';

export interface LoadIssue {
  kind: ApiErrorKind | 'UNKNOWN';
  message: string;
  correlationId?: string;
  contract?: string;
}

const LOAD_STATE_BY_KIND: Partial<Record<ApiErrorKind, LoadState>> = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  CONTRACT_REQUIRED: 'UNAVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  TIMEOUT: 'UNAVAILABLE',
  UNAUTHENTICATED: 'PERMISSION_DENIED',
};

export function toLoadIssue(error: unknown): LoadIssue {
  if (isApiError(error)) {
    return { kind: error.kind, message: error.message, correlationId: error.correlationId, contract: error.contract };
  }
  return { kind: 'UNKNOWN', message: error instanceof Error ? error.message : 'Unexpected failure.' };
}

export function loadStateForIssue(issue: LoadIssue): LoadState {
  return issue.kind === 'UNKNOWN' ? 'ERROR' : (LOAD_STATE_BY_KIND[issue.kind] ?? 'ERROR');
}

export function isAbortIssue(error: unknown): boolean {
  return isApiError(error) && error.kind === 'ABORTED';
}

export function hasUsableData(loadState: LoadState): boolean {
  return loadState === 'READY' || loadState === 'STALE';
}
