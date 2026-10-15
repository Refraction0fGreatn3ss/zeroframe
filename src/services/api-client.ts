import { RUNTIME_CONFIG } from '../config/runtime';
import { ApiError, createHttpError, createTransportError, isAbortError, toErrorResponseBody } from './api-error';
import { persistSessionToken, restoreSessionToken } from './session-token-storage';

export { ApiError } from './api-error';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  tenantId?: string;
  skipAuth?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  correlationId: string;
}

interface TrackedRequest {
  controller: AbortController;
  tenantId: string | null;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_GET_RETRIES = 2;
const RETRY_BACKOFF_STEP_MS = 300;
const RETRYABLE_KINDS = new Set(['UNAVAILABLE', 'TIMEOUT', 'SERVER_ERROR']);

function createCorrelationId(): string {
  return `zf-req-${crypto.randomUUID()}`;
}

function buildUrl(endpoint: string): string {
  return `${RUNTIME_CONFIG.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

class ApiClient {
  private token: string | null = restoreSessionToken();
  private tenantId: string | null = null;
  private readonly activeRequests = new Set<TrackedRequest>();
  private readonly unauthenticatedHandlers = new Set<() => void>();

  setToken(token: string | null) {
    this.token = token;
    persistSessionToken(token);
  }

  getToken(): string | null {
    return this.token;
  }

  setTenantId(tenantId: string | null) {
    this.tenantId = tenantId;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  onUnauthenticated(handler: () => void) {
    this.unauthenticatedHandlers.add(handler);
    return () => {
      this.unauthenticatedHandlers.delete(handler);
    };
  }

  abortTenantRequests(tenantId: string) {
    for (const request of this.activeRequests) {
      if (request.tenantId === tenantId) request.controller.abort();
    }
  }

  abortAll() {
    for (const request of this.activeRequests) request.controller.abort();
    this.activeRequests.clear();
  }

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const method = options.method ?? 'GET';
    const maxRetries = method === 'GET' ? MAX_GET_RETRIES : 0;
    const correlationId = createCorrelationId();

    for (let attempt = 0; ; attempt++) {
      try {
        return await this.attempt<T>(endpoint, method, options, correlationId);
      } catch (error) {
        const retryable = error instanceof ApiError && RETRYABLE_KINDS.has(error.kind);
        if (!retryable || attempt >= maxRetries || options.signal?.aborted) throw error;
        await wait(RETRY_BACKOFF_STEP_MS * (attempt + 1), options.signal);
      }
    }
  }

  get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private async attempt<T>(
    endpoint: string,
    method: string,
    options: ApiRequestOptions,
    correlationId: string,
  ): Promise<ApiResponse<T>> {
    const tenantId = options.tenantId ?? this.tenantId;
    const controller = new AbortController();
    const tracked: TrackedRequest = { controller, tenantId };
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const forwardAbort = () => controller.abort();
    options.signal?.addEventListener('abort', forwardAbort);
    if (options.signal?.aborted) controller.abort();
    this.activeRequests.add(tracked);

    try {
      const response = await fetch(buildUrl(endpoint), {
        method,
        headers: this.buildHeaders(correlationId, tenantId, options),
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      if (!response.ok) throw await this.toHttpError(response, correlationId);
      return { data: (await readJson(response)) as T, status: response.status, correlationId };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (isAbortError(error) || controller.signal.aborted) {
        throw createTransportError(timedOut ? 'TIMEOUT' : 'ABORTED', correlationId);
      }
      throw createTransportError('UNAVAILABLE', correlationId);
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', forwardAbort);
      this.activeRequests.delete(tracked);
    }
  }

  private buildHeaders(correlationId: string, tenantId: string | null, options: ApiRequestOptions) {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-Correlation-ID': correlationId,
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (tenantId) headers['X-Tenant-ID'] = tenantId;
    if (!options.skipAuth && this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  private async toHttpError(response: Response, correlationId: string): Promise<ApiError> {
    const body = toErrorResponseBody(await readJson(response).catch(() => null));
    if (response.status === 401) {
      for (const handler of this.unauthenticatedHandlers) handler();
    }
    return createHttpError(response.status, body, correlationId);
  }
}

export const apiClient = new ApiClient();
