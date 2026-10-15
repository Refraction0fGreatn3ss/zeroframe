import { type CapabilityState, resolveCapabilityState } from '../lib/capability-state';
import { capabilityService } from '../services/capability-service';
import { createResourceStore, useResource } from './core/create-resource-store';

export type { CapabilityState } from '../lib/capability-state';

export const capabilityResource = createResourceStore({
  name: 'capabilities',
  initialFilters: {},
  fetch: ({ signal }) => capabilityService.getManifest({ signal }),
  isEmpty: () => false,
});

export const capabilityActions = {
  refreshCapabilities: () => capabilityResource.actions.load(),
};

export function capabilityStateOf(capabilityId: string): CapabilityState {
  const { data, loadState } = capabilityResource.store.getState();
  return resolveCapabilityState(capabilityId, data, loadState);
}

export function useCapabilityStore() {
  const resource = useResource(capabilityResource);
  return {
    ...resource,
    stateOf: (capabilityId: string) => resolveCapabilityState(capabilityId, resource.data, resource.loadState),
    ...capabilityActions,
  };
}

export function useCapability(capabilityId: string | undefined): CapabilityState {
  const { stateOf } = useCapabilityStore();
  return capabilityId ? stateOf(capabilityId) : 'SUPPORTED';
}
