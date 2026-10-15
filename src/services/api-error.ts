export interface ApiErrorPayload {
  error: string;
  message: string;
  correlationId?: string;
  status: number;
}

export class ApiError extends Error {
  status: number;
  correlationId?: string;
  code: string;

  constructor(status: number, message: string, code: string = 'API_ERROR', correlationId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.correlationId = correlationId;
  }
}

export interface ErrorResponseBody {
  error?: string;
  message?: string;
}

export const ABORTED_REQUEST_STATUS = 499;
export const NETWORK_FAILURE_STATUS = 0;

function readStringField(source: unknown, field: string): string | undefined {
  if (typeof source !== 'object' || source === null || !(field in source)) {
    return undefined;
  }
  const value: unknown = (source as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : undefined;
}

export function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined;
  }
  return typeof error.status === 'number' ? error.status : undefined;
}

export function isAbortError(error: unknown): boolean {
  return readStringField(error, 'name') === 'AbortError';
}

export function toErrorResponseBody(raw: unknown): ErrorResponseBody {
  return {
    error: readStringField(raw, 'error'),
    message: readStringField(raw, 'message'),
  };
}

export function createHttpError(status: number, body: ErrorResponseBody, correlationId: string): ApiError {
  if (status === 401) {
    return new ApiError(
      status,
      body.message || 'Session expired or revoked by authority.',
      body.error || 'UNAUTHORIZED',
      correlationId,
    );
  }

  if (status === 403) {
    return new ApiError(
      status,
      body.message || 'Insufficient permissions for this operation.',
      body.error || 'FORBIDDEN',
      correlationId,
    );
  }

  if (status === 429) {
    return new ApiError(
      status,
      body.message || 'Rate limit threshold exceeded. Anti-automation protection active.',
      'RATE_LIMIT_EXCEEDED',
      correlationId,
    );
  }

  if (status === 400 || status === 409) {
    return new ApiError(
      status,
      body.message || 'Tenant scope error or data conflict.',
      body.error || 'TENANT_ERROR',
      correlationId,
    );
  }

  if (status >= 500) {
    return new ApiError(status, body.message || 'Internal cluster authority error.', 'SERVER_ERROR', correlationId);
  }

  return new ApiError(status, body.message || `Request failed with HTTP ${status}`, 'HTTP_ERROR', correlationId);
}
