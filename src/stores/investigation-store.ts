import { createStore, useStore } from '../lib/create-store';
import { getErrorMessage } from '../lib/error-message';
import { investigationService } from '../services/investigation-service';
import { realtimeClient } from '../services/realtime-client';
import type { LivingEntity, SecurityAlert, SecurityIncident } from '../types';
import { tenantRegistry } from './tenant-registry';

interface InvestigationState {
  incidents: SecurityIncident[];
  alerts: SecurityAlert[];
  entities: LivingEntity[];
  selectedIncidentId: string | null;
  selectedEntityId: string | null;
  isLoading: boolean;
  isStale: boolean;
  lastSyncTimestamp: string | null;
  loadError: string | null;
}

type IncidentState = SecurityIncident['state'];

const LOAD_ERROR_FALLBACK = 'Failed to load investigation data from backend authority';

const investigationStore = createStore<InvestigationState>({
  incidents: [],
  alerts: [],
  entities: [],
  selectedIncidentId: null,
  selectedEntityId: null,
  isLoading: false,
  isStale: false,
  lastSyncTimestamp: null,
  loadError: null,
});

function resolveSelectedIncidentId(incidents: SecurityIncident[], currentId: string | null): string | null {
  if (incidents.length === 0) {
    return null;
  }
  const stillPresent = currentId !== null && incidents.some((incident) => incident.id === currentId);
  return stillPresent ? currentId : incidents[0].id;
}

function setIncidentState(id: string, newState: IncidentState) {
  investigationStore.setState((state) => ({
    incidents: state.incidents.map((incident) => (incident.id === id ? { ...incident, state: newState } : incident)),
  }));
}

async function loadData() {
  investigationStore.setState({ isLoading: true });
  try {
    const [incidents, alerts, entities] = await Promise.all([
      investigationService.getIncidents(),
      investigationService.getAlerts(),
      investigationService.getEntities(),
    ]);
    const loadedIncidents = incidents || [];
    investigationStore.setState((state) => ({
      incidents: loadedIncidents,
      alerts: alerts || [],
      entities: entities || [],
      isStale: false,
      loadError: null,
      lastSyncTimestamp: new Date().toISOString(),
      selectedIncidentId: resolveSelectedIncidentId(loadedIncidents, state.selectedIncidentId),
    }));
  } catch (err) {
    investigationStore.setState({
      isStale: true,
      loadError: getErrorMessage(err, LOAD_ERROR_FALLBACK),
    });
    console.warn('[Investigation Store] Error loading backend data', err);
  } finally {
    investigationStore.setState({ isLoading: false });
  }
}

tenantRegistry.register('investigation', {
  clear: () =>
    investigationStore.setState({
      incidents: [],
      alerts: [],
      entities: [],
      selectedIncidentId: null,
      selectedEntityId: null,
    }),
  reload: async () => {
    await loadData();
  },
});

realtimeClient.onMessage((msg) => {
  if (msg.type === 'INCIDENT_STATE_CHANGED') {
    const { incidentId, state }: { incidentId: string; state: IncidentState } = msg.payload;
    setIncidentState(incidentId, state);
  } else if (msg.type === 'ALERT_INGESTED' || msg.type === 'INCIDENT_CREATED') {
    loadData();
  }
});

async function updateIncidentState(id: string, newState: IncidentState) {
  setIncidentState(id, newState);
  try {
    await investigationService.updateIncidentState(id, newState);
  } catch {
    loadData();
  }
}

export const investigationActions = {
  selectIncident: (id: string | null) => investigationStore.setState({ selectedIncidentId: id }),
  selectEntity: (id: string | null) => investigationStore.setState({ selectedEntityId: id }),
  updateIncidentState,
  refreshData: loadData,
};

export function useInvestigationStore() {
  const state = useStore(investigationStore);
  return {
    ...state,
    selectedIncident: state.incidents.find((incident) => incident.id === state.selectedIncidentId),
    ...investigationActions,
  };
}
