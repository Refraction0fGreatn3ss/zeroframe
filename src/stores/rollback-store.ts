import { INITIAL_CHECKPOINTS, INITIAL_QUARANTINE } from '../data/rollback.data';
import { createStore, useStore } from '../lib/create-store';
import { responseService } from '../services/response-service';
import {
  type BackendQuarantine,
  type BackendRollback,
  normalizeQuarantine,
  normalizeRollback,
  type QuarantineRecord,
  type RollbackCheckpoint,
} from './rollback-store/rollback-normalizers';
import { tenantRegistry } from './tenant-registry';

export type { QuarantineRecord, RollbackCheckpoint };

interface RollbackState {
  checkpoints: RollbackCheckpoint[];
  quarantineHosts: QuarantineRecord[];
  isRollingBack: boolean;
  isLoading: boolean;
}

const rollbackStore = createStore<RollbackState>({
  checkpoints: INITIAL_CHECKPOINTS,
  quarantineHosts: INITIAL_QUARANTINE,
  isRollingBack: false,
  isLoading: false,
});

async function loadRollbackData() {
  rollbackStore.setState({ isLoading: true });
  try {
    const [rawRollbacks, rawQuarantine]: [BackendRollback[] | undefined, BackendQuarantine[] | undefined] =
      await Promise.all([responseService.getRollbacks(), responseService.getQuarantineHosts()]);

    if (Array.isArray(rawRollbacks)) {
      rollbackStore.setState({ checkpoints: rawRollbacks.map(normalizeRollback) });
    }
    if (Array.isArray(rawQuarantine)) {
      rollbackStore.setState({ quarantineHosts: rawQuarantine.map(normalizeQuarantine) });
    }
  } catch (err) {
    console.warn('[Rollback Store] Error loading rollback and quarantine data', err);
  } finally {
    rollbackStore.setState({ isLoading: false });
  }
}

loadRollbackData();

tenantRegistry.register(
  () => rollbackStore.setState({ checkpoints: [], quarantineHosts: [] }),
  async () => {
    await loadRollbackData();
  },
);

async function runResponseOperation(operation: () => Promise<void>, onFailure: (err: unknown) => void) {
  rollbackStore.setState({ isRollingBack: true });
  try {
    await operation();
    await loadRollbackData();
  } catch (err) {
    onFailure(err);
  } finally {
    rollbackStore.setState({ isRollingBack: false });
  }
}

function executeRollback(id: string) {
  return runResponseOperation(
    async () => {
      await responseService.executeRollback(id);
    },
    (err) => {
      console.error('Failed to execute rollback on backend', err);
      rollbackStore.setState((state) => ({
        checkpoints: state.checkpoints.map((checkpoint) =>
          checkpoint.id === id ? { ...checkpoint, status: 'ROLLED_BACK' } : checkpoint,
        ),
      }));
    },
  );
}

function liftQuarantine(id: string) {
  return runResponseOperation(
    async () => {
      await responseService.liftQuarantine(id);
    },
    (err) => {
      console.error('Failed to lift quarantine on backend', err);
      rollbackStore.setState((state) => ({
        quarantineHosts: state.quarantineHosts.filter((host) => host.id !== id),
      }));
    },
  );
}

export const rollbackActions = {
  executeRollback,
  liftQuarantine,
  reload: loadRollbackData,
};

export function useRollbackStore() {
  return { ...useStore(rollbackStore), ...rollbackActions };
}
