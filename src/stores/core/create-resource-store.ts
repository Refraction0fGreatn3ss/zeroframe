import { useEffect } from 'react';
import { createStore, type Store, useStore } from '../../lib/create-store';
import { computeFreshness, DEFAULT_FRESHNESS_POLICY, type Freshness, type FreshnessPolicy } from '../../lib/freshness';
import { isAbortIssue, type LoadIssue, type LoadState, loadStateForIssue, toLoadIssue } from '../../lib/load-state';
import { apiClient } from '../../services/api-client';
import type { PageRequest } from '../../services/http-types';
import { tenantRegistry } from '../tenant-registry';

export interface Pagination {
  cursor: string | null;
  nextCursor: string | null;
  limit: number;
  total: number | null;
}

export interface ResourceState<TData, TFilters> {
  data: TData | null;
  loadState: LoadState;
  issue: LoadIssue | null;
  lastUpdated: string | null;
  selectedId: string | null;
  filters: TFilters;
  pagination: Pagination;
}

export interface FetchContext<TFilters> {
  signal: AbortSignal;
  tenantId: string | null;
  filters: TFilters;
  page: PageRequest;
}

export interface ResourceStoreOptions<TData, TFilters> {
  name: string;
  initialFilters: TFilters;
  fetch: (context: FetchContext<TFilters>) => Promise<TData>;
  isEmpty?: (data: TData) => boolean;
  pageInfo?: (data: TData) => { nextCursor: string | null; total: number | null };
  freshnessPolicy?: FreshnessPolicy;
  pageSize?: number;
  tenantScoped?: boolean;
}

export interface ResourceActions<TData, TFilters> {
  load: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  setFilters: (patch: Partial<TFilters>) => void;
  select: (id: string | null) => void;
  replaceData: (update: (data: TData) => TData) => void;
  markStale: () => void;
  reset: () => void;
  resetForTenant: () => void;
}

export interface ResourceStore<TData, TFilters> {
  store: Store<ResourceState<TData, TFilters>>;
  actions: ResourceActions<TData, TFilters>;
  freshnessPolicy: FreshnessPolicy;
  name: string;
}

const DEFAULT_PAGE_SIZE = 100;

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    promise.then(resolve, reject);
  });
}

function defaultIsEmpty(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) return data.items.length === 0;
  return data === null || data === undefined;
}

export function createResourceStore<TData, TFilters extends object = Record<string, never>>(
  options: ResourceStoreOptions<TData, TFilters>,
): ResourceStore<TData, TFilters> {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const isEmpty = options.isEmpty ?? defaultIsEmpty;

  const initialState = (): ResourceState<TData, TFilters> => ({
    data: null,
    loadState: 'IDLE',
    issue: null,
    lastUpdated: null,
    selectedId: null,
    filters: options.initialFilters,
    pagination: { cursor: null, nextCursor: null, limit: pageSize, total: null },
  });

  const store = createStore<ResourceState<TData, TFilters>>(initialState());
  let inFlight: AbortController | null = null;
  let requested = false;

  const cancelInFlight = () => {
    inFlight?.abort();
    inFlight = null;
  };

  const run = async (cursor: string | null) => {
    requested = true;
    cancelInFlight();
    const controller = new AbortController();
    inFlight = controller;
    const tenantId = apiClient.getTenantId();
    const { filters } = store.getState();
    store.setState({ loadState: 'LOADING', issue: null });

    try {
      const data = await abortable(
        options.fetch({ signal: controller.signal, tenantId, filters, page: { cursor, limit: pageSize } }),
        controller.signal,
      );
      if (controller.signal.aborted || apiClient.getTenantId() !== tenantId) return;
      const info = options.pageInfo?.(data) ?? { nextCursor: null, total: null };
      store.setState({
        data,
        loadState: isEmpty(data) ? 'EMPTY' : 'READY',
        lastUpdated: new Date().toISOString(),
        pagination: { cursor, nextCursor: info.nextCursor, limit: pageSize, total: info.total },
      });
    } catch (error) {
      if (controller.signal.aborted || isAbortIssue(error)) return;
      const issue = toLoadIssue(error);
      store.setState({ loadState: loadStateForIssue(issue), issue });
    } finally {
      if (inFlight === controller) inFlight = null;
    }
  };

  const actions: ResourceActions<TData, TFilters> = {
    load: () => run(null),
    loadNextPage: async () => {
      const { nextCursor } = store.getState().pagination;
      if (nextCursor) await run(nextCursor);
    },
    setFilters: (patch) => {
      store.setState((state) => ({ filters: { ...state.filters, ...patch } }));
      void run(null);
    },
    select: (selectedId) => store.setState({ selectedId }),
    replaceData: (update) => {
      const { data } = store.getState();
      if (data !== null) store.setState({ data: update(data) });
    },
    markStale: () => {
      if (store.getState().loadState === 'READY') store.setState({ loadState: 'STALE' });
    },
    reset: () => {
      cancelInFlight();
      store.setState(initialState());
    },
    resetForTenant: () => {
      cancelInFlight();
      store.setState(initialState());
    },
  };

  if (options.tenantScoped !== false) {
    tenantRegistry.register(options.name, {
      clear: actions.resetForTenant,
      reload: async () => {
        if (requested) await actions.load();
      },
    });
  }

  return {
    store,
    actions,
    freshnessPolicy: options.freshnessPolicy ?? DEFAULT_FRESHNESS_POLICY,
    name: options.name,
  };
}

export interface ResourceView<TData, TFilters>
  extends ResourceState<TData, TFilters>,
    ResourceActions<TData, TFilters> {
  freshness: Freshness;
}

export function useResource<TData, TFilters>(resource: ResourceStore<TData, TFilters>): ResourceView<TData, TFilters> {
  const state = useStore(resource.store);
  return {
    ...state,
    ...resource.actions,
    freshness: computeFreshness(state.lastUpdated, resource.freshnessPolicy, state.loadState),
  };
}

export function useLoadOnMount<TData, TFilters>(resource: ResourceStore<TData, TFilters>): void {
  useEffect(() => {
    if (resource.store.getState().loadState === 'IDLE') void resource.actions.load();
  }, [resource]);
}
