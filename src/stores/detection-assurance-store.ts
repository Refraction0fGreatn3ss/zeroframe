import { DEFAULT_CANARY_AUDIT } from '../data/detection-assurance.data';
import { createStore, useStore } from '../lib/create-store';
import { realtimeClient } from '../services/realtime-client';
import { systemService } from '../services/system-service';
import type { DetectionCapability } from '../types';
import {
  backfillLastCanary,
  buildBackgroundCanaryRecord,
  buildManualCanaryRecord,
  type CanaryAuditRecord,
  randomCapabilityHash,
} from './detection-assurance-store/canary-audit';
import { tenantRegistry } from './tenant-registry';

export type { CanaryAuditRecord };

interface AssuranceState {
  capabilities: DetectionCapability[];
  auditLog: CanaryAuditRecord[];
  isCanaryRunning: boolean;
  isLoading: boolean;
}

interface CanaryCompletedPayload {
  timestamp: string;
  signedHash: string;
}

const assuranceStore = createStore<AssuranceState>({
  capabilities: [],
  auditLog: DEFAULT_CANARY_AUDIT,
  isCanaryRunning: false,
  isLoading: false,
});

function prependAuditRecord(record: CanaryAuditRecord) {
  assuranceStore.setState((state) => ({ auditLog: [record, ...state.auditLog] }));
}

async function loadData() {
  assuranceStore.setState({ isLoading: true });
  try {
    const capabilities = await systemService.getAssuranceCapabilities();
    assuranceStore.setState((state) => ({
      capabilities: (capabilities || []).map((capability) => backfillLastCanary(capability, state.auditLog)),
    }));
  } catch (err) {
    console.warn('[Assurance Store] Error loading capabilities', err);
  } finally {
    assuranceStore.setState({ isLoading: false });
  }
}

tenantRegistry.register('detection-assurance', {
  clear: () => assuranceStore.setState({ capabilities: [] }),
  reload: async () => {
    await loadData();
  },
});

realtimeClient.onMessage((msg) => {
  if (msg.type === 'CANARY_VALIDATION_COMPLETED') {
    const payload: CanaryCompletedPayload = msg.payload;
    prependAuditRecord(buildBackgroundCanaryRecord(payload.timestamp, payload.signedHash));
  }
});

function markCapabilityCanaried(target: DetectionCapability, auditedAt: string) {
  assuranceStore.setState((state) => ({
    capabilities: state.capabilities.map((capability) =>
      capability === target
        ? { ...capability, lastCanaryTimestamp: auditedAt, lastCanarySignedHash: randomCapabilityHash() }
        : capability,
    ),
  }));
}

async function triggerManualCanary(detectorKey: string) {
  assuranceStore.setState({ isCanaryRunning: true });
  try {
    const { auditedAt } = await systemService.triggerCanary();
    const capability = assuranceStore.getState().capabilities.find((c) => c.detectorKey === detectorKey);
    if (capability) {
      markCapabilityCanaried(capability, auditedAt);
    }
    prependAuditRecord(buildManualCanaryRecord(detectorKey, capability?.name || detectorKey, auditedAt));
  } catch {
    // A failed manual canary leaves the existing assurance state untouched.
  } finally {
    assuranceStore.setState({ isCanaryRunning: false });
  }
}

export const detectionAssuranceActions = {
  triggerManualCanary,
  refreshCapabilities: loadData,
};

export function useDetectionAssuranceStore() {
  return { ...useStore(assuranceStore), ...detectionAssuranceActions };
}
