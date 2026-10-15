import { RUNTIME_CONFIG } from '../config/runtime';
import { getErrorMessage } from '../lib/error-message';
import {
  ABORTED_REQUEST_STATUS,
  ApiError,
  createHttpError,
  isAbortError,
  NETWORK_FAILURE_STATUS,
  toErrorResponseBody,
} from './api-error';
import { persistSessionToken, restoreSessionToken } from './session-token-storage';

export type { ApiErrorPayload } from './api-error';
export { ApiError } from './api-error';

export interface ApiClientConfig {
  baseUrl: string;
  defaultTimeoutMs: number;
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
  tenantId?: string;
  isIdempotent?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  correlationId: string;
}

interface TrackedRequest {
  controller: AbortController;
  tenantId: string;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_GET_RETRIES = 2;
const RETRY_BACKOFF_STEP_MS = 300;

function createCorrelationId(): string {
  return `zf-req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function buildUrl(baseUrl: string, endpoint: string): string {
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

function toHeaderRecord(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers || Array.isArray(headers)) {
    return Object.fromEntries(headers instanceof Headers ? headers.entries() : headers);
  }
  return headers;
}

function serializeBody(body: unknown): string | undefined {
  return body ? JSON.stringify(body) : undefined;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function abortQuietly(controller: AbortController): void {
  try {
    controller.abort();
  } catch {
    // Already aborted.
  }
}

class CentralizedApiClient {
  private readonly baseUrl = RUNTIME_CONFIG.apiBaseUrl;
  private readonly defaultTimeoutMs = DEFAULT_TIMEOUT_MS;
  private token: string | null = restoreSessionToken();
  private currentTenantId: string = RUNTIME_CONFIG.defaultTenantId;
  private readonly activeRequests = new Set<TrackedRequest>();
  private readonly sessionExpiredHandlers = new Set<() => void>();

  public setToken(token: string | null) {
    this.token = token;
    persistSessionToken(token);
  }

  public getToken(): string | null {
    return this.token;
  }

  public setTenantId(tenantId: string) {
    this.currentTenantId = tenantId;
  }

  public getTenantId(): string {
    return this.currentTenantId;
  }

  public onSessionExpired(handler: () => void) {
    this.sessionExpiredHandlers.add(handler);
    return () => {
      this.sessionExpiredHandlers.delete(handler);
    };
  }

  public abortTenantRequests(tenantId?: string) {
    const target = tenantId || this.currentTenantId;
    for (const request of this.activeRequests) {
      if (request.tenantId === target || !tenantId) {
        abortQuietly(request.controller);
        this.activeRequests.delete(request);
      }
    }
  }

  public abortAll() {
    for (const request of this.activeRequests) {
      abortQuietly(request.controller);
    }
    this.activeRequests.clear();
  }

  public async request<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { timeoutMs, skipAuth, tenantId, isIdempotent: _isIdempotent, ...fetchInit } = options;
    const tenantScope = tenantId || this.currentTenantId;
    const url = buildUrl(this.baseUrl, endpoint);
    const correlationId = createCorrelationId();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs || this.defaultTimeoutMs);
    const trackedRequest: TrackedRequest = { controller, tenantId: tenantScope };
    this.activeRequests.add(trackedRequest);

    const releaseRequest = () => {
      clearTimeout(timeoutId);
      this.activeRequests.delete(trackedRequest);
    };

    if (fetchInit.signal) {
      fetchInit.signal.addEventListener('abort', () => controller.abort());
    }

    const headers = this.buildHeaders(correlationId, tenantScope, fetchInit.headers, skipAuth);
    const method = (fetchInit.method || 'GET').toUpperCase();
    const maxRetries = method === 'GET' ? MAX_GET_RETRIES : 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, { ...fetchInit, method, headers, signal: controller.signal });
        // The timeout and abort tracking end with the first response; later retries run untracked.
        releaseRequest();

        if (!response.ok) {
          throw await this.toHttpError(response, correlationId);
        }

        const data: T = await response.json();
        return { data, status: response.status, correlationId };
      } catch (error) {
        if (isAbortError(error)) {
          releaseRequest();
          throw new ApiError(ABORTED_REQUEST_STATUS, 'Request aborted or timed out.', 'REQUEST_ABORTED', correlationId);
        }

        if (attempt < maxRetries) {
          await wait(RETRY_BACKOFF_STEP_MS * (attempt + 1));
          continue;
        }

        releaseRequest();
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(
          NETWORK_FAILURE_STATUS,
          getErrorMessage(error, 'Network unreachable'),
          'NETWORK_ERROR',
          correlationId,
        );
      }
    }

    throw new ApiError(NETWORK_FAILURE_STATUS, 'Maximum retry limit reached', 'RETRY_EXHAUSTED', correlationId);
  }

  public get<T = unknown>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = unknown>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: serializeBody(body) });
  }

  public put<T = unknown>(endpoint: string, body?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: serializeBody(body) });
  }

  public delete<T = unknown>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private buildHeaders(
    correlationId: string,
    tenantScope: string,
    customHeaders: HeadersInit | undefined,
    skipAuth: boolean | undefined,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      'X-Tenant-ID': tenantScope,
      'X-Requested-With': 'XMLHttpRequest',
      ...toHeaderRecord(customHeaders),
    };
    if (!skipAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async toHttpError(response: Response, correlationId: string): Promise<ApiError> {
    const body = toErrorResponseBody(await response.json().catch(() => ({})));
    if (response.status === 401) {
      for (const handler of this.sessionExpiredHandlers) handler();
    }
    return createHttpError(response.status, body, correlationId);
  }
}

export const apiClient = new CentralizedApiClient();
