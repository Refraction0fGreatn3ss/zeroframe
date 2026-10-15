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

function setKillSwitch(engaged: boolean) {
  updateMetrics((metrics) => ({ ...metrics, governedResponseKillSwitch: engaged }));
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

loadData();

tenantRegistry.register(
  () => dashboardStore.setState({ metrics: DEFAULT_METRICS, charts: null }),
  async () => {
    await loadData();
  },
);

realtimeClient.onMessage((msg) => {
  if (msg.type === 'TELEMETRY_PULSE') {
    const pulse: TelemetryPulsePayload = msg.payload;
    updateMetrics((metrics) => applyTelemetryPulse(metrics, pulse));
  } else if (msg.type === 'KILL_SWITCH_CHANGED') {
    const { governedResponseKillSwitch }: { governedResponseKillSwitch: boolean } = msg.payload;
    setKillSwitch(governedResponseKillSwitch);
  } else if (msg.type === 'INCIDENT_STATE_CHANGED' || msg.type === 'CANARY_VALIDATION_COMPLETED') {
    loadData();
  }
});

async function toggleKillSwitch(reason?: string) {
  const next = !dashboardStore.getState().metrics.governedResponseKillSwitch;
  setKillSwitch(next);
  try {
    await dashboardService.setKillSwitch(next, reason);
  } catch {
    setKillSwitch(!next);
  }
}

export const dashboardActions = {
  updateThroughput: (bps: number, pps: number, drops: number) =>
    updateMetrics((metrics) => applyThroughputSample(metrics, bps, pps, drops)),
  toggleKillSwitch,
  refreshDashboard: () => loadData(),
};

export function useDashboardStore() {
  return { ...useStore(dashboardStore), ...dashboardActions };
}
