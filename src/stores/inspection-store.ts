import { INITIAL_CRYPTO, INITIAL_ENCAPSULATION, INITIAL_QUEUE, INITIAL_STAGES } from '../data/inspection.data';
import { createStore, useStore } from '../lib/create-store';
import { systemService } from '../services/system-service';
import type {
  CryptoInspectionMetrics,
  EncapsulationIntegrity,
  InspectionStageDetail,
  QueueBackpressureMetrics,
} from '../types/inspection';
import {
  applyAsymmetryWarning,
  type BackendInspectionPipeline,
  hasStages,
  normalizeStage,
} from './inspection-store/pipeline-normalizer';
import { tenantRegistry } from './tenant-registry';

interface InspectionState {
  stages: InspectionStageDetail[];
  encapsulation: EncapsulationIntegrity;
  crypto: CryptoInspectionMetrics;
  queue: QueueBackpressureMetrics;
  isLoading: boolean;
}

const inspectionStore = createStore<InspectionState>({
  stages: INITIAL_STAGES,
  encapsulation: INITIAL_ENCAPSULATION,
  crypto: INITIAL_CRYPTO,
  queue: INITIAL_QUEUE,
  isLoading: false,
});

function applyPipeline(pipeline: BackendInspectionPipeline) {
  if (hasStages(pipeline)) {
    inspectionStore.setState({ stages: pipeline.stages.map(normalizeStage) });
  }
  if (pipeline.asymmetryWarning) {
    inspectionStore.setState((state) => ({ encapsulation: applyAsymmetryWarning(state.encapsulation) }));
  }
}

async function loadInspection() {
  inspectionStore.setState({ isLoading: true });
  try {
    const pipeline: BackendInspectionPipeline | null | undefined = await systemService.getInspectionPipeline();
    if (pipeline) {
      applyPipeline(pipeline);
    }
  } catch (err) {
    console.warn('[Inspection Store] Failed to load authoritative inspection pipeline', err);
  } finally {
    inspectionStore.setState({ isLoading: false });
  }
}

loadInspection();

tenantRegistry.register(
  () => inspectionStore.setState({ stages: [] }),
  async () => {
    await loadInspection();
  },
);

export const inspectionActions = {
  reload: loadInspection,
};

export function useInspectionStore() {
  return { ...useStore(inspectionStore), ...inspectionActions };
}
