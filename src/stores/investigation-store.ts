/**
 * Investigation Store
 * Incidents, Alerts, Living Entities, and Entity Graph Provenance
 * Connected to Authoritative Backend and Tenant Isolation Lifecycle
 */

import { useState, useEffect } from 'react';
import { SecurityIncident, SecurityAlert, LivingEntity } from '../types';
import { investigationService } from '../services/investigation-service';
import { realtimeClient } from '../services/realtime-client';
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

let investigationState: InvestigationState = {
  incidents: [],
  alerts: [],
  entities: [],
  selectedIncidentId: null,
  selectedEntityId: null,
  isLoading: false,
  isStale: false,
  lastSyncTimestamp: null,
  loadError: null,
};

const listeners = new Set<(state: InvestigationState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...investigationState }));
}

async function loadData() {
  investigationState.isLoading = true;
  notify();
  try {
    const [incidents, alerts, entities] = await Promise.all([
      investigationService.getIncidents(),
      investigationService.getAlerts(),
      investigationService.getEntities(),
    ]);
    investigationState.incidents = incidents || [];
    investigationState.alerts = alerts || [];
    investigationState.entities = entities || [];
    investigationState.isStale = false;
    investigationState.loadError = null;
    investigationState.lastSyncTimestamp = new Date().toISOString();

    if (investigationState.incidents.length > 0) {
      if (!investigationState.selectedIncidentId || !investigationState.incidents.some(i => i.id === investigationState.selectedIncidentId)) {
        investigationState.selectedIncidentId = investigationState.incidents[0].id;
      }
    } else {
      investigationState.selectedIncidentId = null;
    }
  } catch (err: any) {
    investigationState.isStale = true;
    investigationState.loadError = err?.message || 'Failed to load investigation data from backend authority';
    console.warn('[Investigation Store] Error loading backend data', err);
  } finally {
    investigationState.isLoading = false;
    notify();
  }
}

// Initial load
loadData();

// Register with tenant isolation registry
tenantRegistry.register(
  () => {
    investigationState.incidents = [];
    investigationState.alerts = [];
    investigationState.entities = [];
    investigationState.selectedIncidentId = null;
    investigationState.selectedEntityId = null;
    notify();
  },
  async () => {
    await loadData();
  }
);

// Realtime subscriptions
realtimeClient.onMessage((msg) => {
  if (msg.type === 'INCIDENT_STATE_CHANGED') {
    const { incidentId, state } = msg.payload;
    investigationState.incidents = investigationState.incidents.map((i) =>
      i.id === incidentId ? { ...i, state } : i
    );
    notify();
  } else if (msg.type === 'ALERT_INGESTED' || msg.type === 'INCIDENT_CREATED') {
    loadData();
  }
});

export function useInvestigationStore() {
  const [state, setState] = useState(investigationState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const selectIncident = (id: string | null) => {
    investigationState.selectedIncidentId = id;
    notify();
  };

  const selectEntity = (id: string | null) => {
    investigationState.selectedEntityId = id;
    notify();
  };

  const updateIncidentState = async (id: string, newState: SecurityIncident['state']) => {
    // Optimistic update
    investigationState.incidents = investigationState.incidents.map((inc) =>
      inc.id === id ? { ...inc, state: newState } : inc
    );
    notify();
    try {
      await investigationService.updateIncidentState(id, newState);
    } catch {
      loadData();
    }
  };

  const selectedIncident = investigationState.incidents.find(
    (inc) => inc.id === investigationState.selectedIncidentId
  );

  return {
    ...state,
    selectedIncident,
    selectIncident,
    selectEntity,
    updateIncidentState,
    refreshData: loadData,
  };
}
