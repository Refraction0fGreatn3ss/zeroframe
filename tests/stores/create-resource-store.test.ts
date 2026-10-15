import { describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../src/services/api-client';
import { ApiError, backendContractRequired } from '../../src/services/api-error';
import { createResourceStore } from '../../src/stores/core/create-resource-store';
import { tenantRegistry } from '../../src/stores/tenant-registry';

let storeCounter = 0;
const uniqueName = () => `test-resource-${++storeCounter}`;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe('createResourceStore', () => {
  it('moves IDLE → LOADING → READY and records lastUpdated', async () => {
    const resource = createResourceStore<string[]>({
      name: uniqueName(),
      initialFilters: {},
      fetch: async () => ['a'],
    });
    expect(resource.store.getState().loadState).toBe('IDLE');
    const pending = resource.actions.load();
    expect(resource.store.getState().loadState).toBe('LOADING');
    await pending;
    expect(resource.store.getState()).toMatchObject({ loadState: 'READY', data: ['a'] });
    expect(resource.store.getState().lastUpdated).not.toBeNull();
  });

  it('reports EMPTY for empty backend results', async () => {
    const resource = createResourceStore<string[]>({ name: uniqueName(), initialFilters: {}, fetch: async () => [] });
    await resource.actions.load();
    expect(resource.store.getState().loadState).toBe('EMPTY');
  });

  it.each([
    [new ApiError({ kind: 'UNAVAILABLE', status: 0, message: 'down' }), 'UNAVAILABLE'],
    [new ApiError({ kind: 'PERMISSION_DENIED', status: 403, message: 'no' }), 'PERMISSION_DENIED'],
    [new ApiError({ kind: 'NOT_SUPPORTED', status: 501, message: 'no' }), 'NOT_SUPPORTED'],
    [new ApiError({ kind: 'SERVER_ERROR', status: 500, message: 'boom' }), 'ERROR'],
  ])('maps %s to %s without fabricating data', async (error, expected) => {
    const resource = createResourceStore<string[]>({
      name: uniqueName(),
      initialFilters: {},
      fetch: () => Promise.reject(error),
    });
    await resource.actions.load();
    expect(resource.store.getState().loadState).toBe(expected);
    expect(resource.store.getState().data).toBeNull();
  });

  it('surfaces a missing backend contract as UNAVAILABLE with the contract name', async () => {
    const resource = createResourceStore<string[]>({
      name: uniqueName(),
      initialFilters: {},
      fetch: () => backendContractRequired('GET /example'),
    });
    await resource.actions.load();
    expect(resource.store.getState().loadState).toBe('UNAVAILABLE');
    expect(resource.store.getState().issue).toMatchObject({ kind: 'CONTRACT_REQUIRED', contract: 'GET /example' });
  });

  it('ignores a response that arrives after the tenant changed', async () => {
    const gate = deferred<string[]>();
    apiClient.setTenantId('tenant-a');
    const resource = createResourceStore<string[]>({
      name: uniqueName(),
      initialFilters: {},
      fetch: () => gate.promise,
    });
    const pending = resource.actions.load();
    apiClient.setTenantId('tenant-b');
    gate.resolve(['from-tenant-a']);
    await pending;
    expect(resource.store.getState().data).toBeNull();
    apiClient.setTenantId(null);
  });

  it('cancels the previous request when a newer one starts', async () => {
    const signals: AbortSignal[] = [];
    const resource = createResourceStore<string[], { q: string }>({
      name: uniqueName(),
      initialFilters: { q: '' },
      fetch: async ({ signal }) => {
        signals.push(signal);
        return [];
      },
    });
    void resource.actions.load();
    resource.actions.setFilters({ q: 'next' });
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it('registers for tenant reset and clears its data', async () => {
    const name = uniqueName();
    const resource = createResourceStore<string[]>({ name, initialFilters: {}, fetch: async () => ['x'] });
    await resource.actions.load();
    expect(tenantRegistry.registeredNames()).toContain(name);
    tenantRegistry.clearAll();
    expect(resource.store.getState()).toMatchObject({ data: null, loadState: 'IDLE', lastUpdated: null });
  });

  it('reloads after tenant switch only if it was previously requested', async () => {
    const used = vi.fn(async () => ['x']);
    const unused = vi.fn(async () => ['y']);
    const usedResource = createResourceStore<string[]>({ name: uniqueName(), initialFilters: {}, fetch: used });
    createResourceStore<string[]>({ name: uniqueName(), initialFilters: {}, fetch: unused });
    await usedResource.actions.load();
    tenantRegistry.clearAll();
    await tenantRegistry.reloadAll('tenant-b');
    expect(used).toHaveBeenCalledTimes(2);
    expect(unused).not.toHaveBeenCalled();
  });
});
