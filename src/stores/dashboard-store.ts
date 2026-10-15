import { DEFAULT_METRICS } from '../data/dashboard.data';
import { createStore, useStore } from '../lib/create-store';
import { getErrorMessage } from '../lib/error-message';
import { dashboardService, type SecurityChartsData } from '../services/dashboard-service';
import { realtimeClient } from '../services/realtime-client';
import {
  applyTelemetryPulse,
  applyThroughputSample,
  type CommandCenterMetrics,
  type TelemetryPulsePayload,
} from './dashboard-store/command-center-metrics';
import { killSwitchActions } from './kill-switch-store';
import { tenantRegistry } from './tenant-registry';

export type { CommandCenterMetrics };

type FreshnessState = 'FRESH' | 'STALE' | 'ERROR';

interface DashboardState {
  metrics: CommandCenterMetrics;
  charts: SecurityChartsData | null;
  isLoading: boolean;
  loadError: string | null;
  freshnessState: FreshnessState;
  lastSyncTimestamp: string | null;
}

const LOAD_ERROR_FALLBACK = 'Failed to fetch dashboard metrics from backend authority';

const dashboardStore = createStore<DashboardState>({
  metrics: DEFAULT_METRICS,
  charts: null,
  isLoading: false,
  loadError: null,
  freshnessState: 'FRESH',
  lastSyncTimestamp: null,
});

function updateMetrics(update: (metrics: CommandCenterMetrics) => CommandCenterMetrics) {
  dashboardStore.setState((state) => ({ metrics: update(state.metrics) }));
}

async function loadData() {
  dashboardStore.setState({ isLoading: true });
  try {
    const [metrics, charts] = await Promise.all([dashboardService.getMetrics(), dashboardService.getCharts()]);
    dashboardStore.setState({
      metrics,
      charts,
      loadError: null,
      freshnessState: 'FRESH',
      lastSyncTimestamp: new Date().toISOString(),
    });
    killSwitchActions.applyAuthoritative(metrics.governedResponseKillSwitch);
  } catch (err) {
    dashboardStore.setState({
      loadError: getErrorMessage(err, LOAD_ERROR_FALLBACK),
      freshnessState: 'ERROR',
    });
    console.warn('[Dashboard Store] Backend fetch error', err);
  } finally {
    dashboardStore.setState({ isLoading: false });
  }
}

tenantRegistry.register('dashboard', {
  clear: () => dashboardStore.setState({ metrics: DEFAULT_METRICS, charts: null }),
  reload: async () => {
    await loadData();
  },
});

realtimeClient.onMessage((msg) => {
  if (msg.type === 'TELEMETRY_PULSE') {
    const pulse: TelemetryPulsePayload = msg.payload;
    updateMetrics((metrics) => applyTelemetryPulse(metrics, pulse));
  } else if (msg.type === 'INCIDENT_STATE_CHANGED' || msg.type === 'CANARY_VALIDATION_COMPLETED') {
    loadData();
  }
});

export const dashboardActions = {
  updateThroughput: (bps: number, pps: number, drops: number) =>
    updateMetrics((metrics) => applyThroughputSample(metrics, bps, pps, drops)),
  refreshDashboard: () => loadData(),
};

export function useDashboardStore() {
  return { ...useStore(dashboardStore), ...dashboardActions };
}
