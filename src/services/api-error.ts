export type ApiErrorKind =
  | 'UNAUTHENTICATED'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'NOT_SUPPORTED'
  | 'CONTRACT_REQUIRED'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'UNAVAILABLE'
  | 'SERVER_ERROR';

export interface ApiErrorInit {
  kind: ApiErrorKind;
  status: number;
  message: string;
  code?: string;
  correlationId?: string;
  contract?: string;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly code: string;
  readonly correlationId?: string;
  readonly contract?: string;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = 'ApiError';
    this.kind = init.kind;
    this.status = init.status;
    this.code = init.code ?? init.kind;
    this.correlationId = init.correlationId;
    this.contract = init.contract;
  }
}

export interface ErrorResponseBody {
  error?: string;
  message?: string;
}

const NOT_SUPPORTED_CODES = new Set(['NOT_SUPPORTED', 'CAPABILITY_UNAVAILABLE', 'CAPABILITY_NOT_SUPPORTED']);

const KIND_BY_STATUS: Record<number, ApiErrorKind> = {
  400: 'VALIDATION',
  401: 'UNAUTHENTICATED',
  403: 'PERMISSION_DENIED',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION',
  429: 'RATE_LIMITED',
  501: 'NOT_SUPPORTED',
  502: 'UNAVAILABLE',
  503: 'UNAVAILABLE',
  504: 'TIMEOUT',
};

const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
  UNAUTHENTICATED: 'Session expired or revoked.',
  PERMISSION_DENIED: 'Insufficient permissions for this operation.',
  NOT_FOUND: 'The requested resource does not exist.',
  NOT_SUPPORTED: 'This capability is not supported by the backend.',
  CONTRACT_REQUIRED: 'No backend contract is defined for this capability.',
  VALIDATION: 'The request was rejected as invalid.',
  CONFLICT: 'The request conflicts with the current state.',
  RATE_LIMITED: 'Rate limit exceeded.',
  TIMEOUT: 'The backend did not respond in time.',
  ABORTED: 'Request cancelled.',
  UNAVAILABLE: 'The ZeroFrame backend is unavailable.',
  SERVER_ERROR: 'The backend reported an internal error.',
};

function readStringField(source: unknown, field: string): string | undefined {
  if (typeof source !== 'object' || source === null || !(field in source)) return undefined;
  const value: unknown = (source as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : undefined;
}

export function toErrorResponseBody(raw: unknown): ErrorResponseBody {
  return { error: readStringField(raw, 'error'), message: readStringField(raw, 'message') };
}

export function kindForStatus(status: number, code?: string): ApiErrorKind {
  if (code && NOT_SUPPORTED_CODES.has(code)) return 'NOT_SUPPORTED';
  return KIND_BY_STATUS[status] ?? (status >= 500 ? 'SERVER_ERROR' : 'VALIDATION');
}

export function createHttpError(status: number, body: ErrorResponseBody, correlationId: string): ApiError {
  const kind = kindForStatus(status, body.error);
  return new ApiError({
    kind,
    status,
    message: body.message || DEFAULT_MESSAGES[kind],
    code: body.error,
    correlationId,
  });
}

export function createTransportError(kind: 'TIMEOUT' | 'ABORTED' | 'UNAVAILABLE', correlationId?: string): ApiError {
  return new ApiError({ kind, status: 0, message: DEFAULT_MESSAGES[kind], correlationId });
}

/**
 * Typed placeholder for a backend operation whose endpoint contract is not yet known.
 * It never issues a request and never fabricates data; callers surface UNAVAILABLE with the contract name.
 */
export function backendContractRequired(contract: string): Promise<never> {
  return Promise.reject(
    new ApiError({
      kind: 'CONTRACT_REQUIRED',
      status: 0,
      code: 'BACKEND_CONTRACT_REQUIRED',
      message: `${DEFAULT_MESSAGES.CONTRACT_REQUIRED} (${contract})`,
      contract,
    }),
  );
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function errorKindOf(error: unknown): ApiErrorKind | 'UNKNOWN' {
  return isApiError(error) ? error.kind : 'UNKNOWN';
}

export function getErrorStatus(error: unknown): number | undefined {
  return isApiError(error) ? error.status : undefined;
}

export function isAbortError(error: unknown): boolean {
  return readStringField(error, 'name') === 'AbortError';
}
