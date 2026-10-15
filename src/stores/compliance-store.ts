import { FRAMEWORKS, SAMPLE_CONTROLS } from '../data/compliance.data';
import { createStore, useStore } from '../lib/create-store';
import { systemService } from '../services/system-service';
import type { ComplianceControl, ComplianceFrameworkSummary } from '../types/compliance';
import { type BackendComplianceFramework, normalizeFramework } from './compliance-store/framework-normalizer';
import { tenantRegistry } from './tenant-registry';

interface ComplianceState {
  frameworks: ComplianceFrameworkSummary[];
  controls: ComplianceControl[];
  selectedFrameworkId: string;
  isLoading: boolean;
}

const complianceStore = createStore<ComplianceState>({
  frameworks: FRAMEWORKS,
  controls: SAMPLE_CONTROLS,
  selectedFrameworkId: 'UAE_IAR',
  isLoading: false,
});

function resolveSelectedFrameworkId(frameworks: ComplianceFrameworkSummary[], currentId: string): string {
  return frameworks.some((framework) => framework.id === currentId) ? currentId : frameworks[0].id;
}

async function loadCompliance() {
  complianceStore.setState({ isLoading: true });
  try {
    const rawFrameworks: BackendComplianceFramework[] | undefined = await systemService.getCompliance();
    if (Array.isArray(rawFrameworks) && rawFrameworks.length > 0) {
      const frameworks = rawFrameworks.map(normalizeFramework);
      complianceStore.setState((state) => ({
        frameworks,
        selectedFrameworkId: resolveSelectedFrameworkId(frameworks, state.selectedFrameworkId),
      }));
    }
  } catch (err) {
    console.warn('[Compliance Store] Failed to load authoritative compliance frameworks', err);
  } finally {
    complianceStore.setState({ isLoading: false });
  }
}

tenantRegistry.register('compliance', {
  clear: () => complianceStore.setState({ frameworks: [] }),
  reload: async () => {
    await loadCompliance();
  },
});

export const complianceActions = {
  selectFramework: (id: string) => complianceStore.setState({ selectedFrameworkId: id }),
  reload: loadCompliance,
};

function findSelectedFramework({ frameworks, selectedFrameworkId }: ComplianceState): ComplianceFrameworkSummary {
  return frameworks.find((framework) => framework.id === selectedFrameworkId) || frameworks[0] || FRAMEWORKS[0];
}

function controlsForSelectedFramework({ controls, selectedFrameworkId }: ComplianceState): ComplianceControl[] {
  const filtered = controls.filter((control) => control.framework === selectedFrameworkId);
  return filtered.length > 0 ? filtered : controls;
}

export function useComplianceStore() {
  const state = useStore(complianceStore);
  return {
    ...state,
    controls: controlsForSelectedFramework(state),
    selectedFramework: findSelectedFramework(state),
    ...complianceActions,
  };
}
