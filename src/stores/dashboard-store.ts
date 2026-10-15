/**
 * Dashboard & Command Center Store
 * Powers both Simple SOC and Analyst SOC modes with identical backend truth.
 * Connected to Authoritative Backend & Realtime Engine.
 */

import { useState, useEffect } from 'react';
import { SecurityState } from '../types';
import { dashboardService, SecurityChartsData } from '../services/dashboard-service';
import { realtimeClient } from '../services/realtime-client';
import { tenantRegistry } from './tenant-registry';

export interface CommandCenterMetrics {
  totalKnownEntities: number;
  knownSubnets: number;
  criticalProtectedAssets: number;
  otDevicesCount: number;

  observationCoveragePct: number;
  activeObservationPoints: number;
  captureState: SecurityState;
  sourceFidelityLevel: 'DEEP_PACKET' | 'WIRE_METADATA' | 'FLOW' | 'PARTIAL';
  asymmetricTrafficRatio: number;
  currentIngressThroughputBps: number;
  currentPacketRatePps: number;
  kernelDropPps: number;
  uninspectedBytesRatio: number;

  activeDetectorsTotal: number;
  detectorsHealthy: number;
  detectorsDegraded: number;
  detectorsUnavailable: number;
  liveAssuranceState: SecurityState;
  lastCanaryAuditTime: string;

  openIncidentsCount: number;
  criticalIncidentsCount: number;
  highIncidentsCount: number;
  containedTodayCount: number;

  sensorsOnline: number;
  sensorsTotal: number;
  witnessNodesHealthy: number;
  witnessNodesTotal: number;
  governedResponseKillSwitch: boolean;
}

const DEFAULT_METRICS: CommandCenterMetrics = {
  totalKnownEntities: 0,
  knownSubnets: 0,
  criticalProtectedAssets: 0,
  otDevicesCount: 0,
  observationCoveragePct: 0,
  activeObservationPoints: 0,
  captureState: 'UNKNOWN',
  sourceFidelityLevel: 'DEEP_PACKET',
  asymmetricTrafficRatio: 0,
  currentIngressThroughputBps: 0,
  currentPacketRatePps: 0,
  kernelDropPps: 0,
  uninspectedBytesRatio: 0,
  activeDetectorsTotal: 0,
  detectorsHealthy: 0,
  detectorsDegraded: 0,
  detectorsUnavailable: 0,
  liveAssuranceState: 'UNKNOWN',
  lastCanaryAuditTime: new Date().toISOString(),
  openIncidentsCount: 0,
  criticalIncidentsCount: 0,
  highIncidentsCount: 0,
  containedTodayCount: 0,
  sensorsOnline: 0,
  sensorsTotal: 0,
  witnessNodesHealthy: 0,
  witnessNodesTotal: 0,
  governedResponseKillSwitch: false,
};

let metricsState: CommandCenterMetrics = DEFAULT_METRICS;
let chartsState: SecurityChartsData | null = null;
let isLoadingMetrics = false;
let loadError: string | null = null;
let freshnessState: 'FRESH' | 'STALE' | 'ERROR' = 'FRESH';
let lastSyncTimestamp: string | null = null;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function loadData() {
  isLoadingMetrics = true;
  notify();
  try {
    const [metrics, charts] = await Promise.all([
      dashboardService.getMetrics(),
      dashboardService.getCharts(),
    ]);
    metricsState = metrics;
    chartsState = charts;
    loadError = null;
    freshnessState = 'FRESH';
    lastSyncTimestamp = new Date().toISOString();
  } catch (err: any) {
    loadError = err?.message || 'Failed to fetch dashboard metrics from backend authority';
    freshnessState = 'ERROR';
    console.warn('[Dashboard Store] Backend fetch error', err);
  } finally {
    isLoadingMetrics = false;
    notify();
  }
}

// Initial load
loadData();

// Register with tenant isolation registry
tenantRegistry.register(
  () => {
    metricsState = DEFAULT_METRICS;
    chartsState = null;
    notify();
  },
  async () => {
    await loadData();
  }
);

// Subscribe to authoritative realtime telemetry events
realtimeClient.onMessage((msg) => {
  if (msg.type === 'TELEMETRY_PULSE') {
    metricsState = {
      ...metricsState,
      currentIngressThroughputBps: msg.payload.currentIngressThroughputBps,
      currentPacketRatePps: msg.payload.currentPacketRatePps,
      kernelDropPps: msg.payload.kernelDropPps,
      lastCanaryAuditTime: msg.payload.lastCanaryAuditTime || metricsState.lastCanaryAuditTime,
    };
    notify();
  } else if (msg.type === 'KILL_SWITCH_CHANGED') {
    metricsState = {
      ...metricsState,
      governedResponseKillSwitch: msg.payload.governedResponseKillSwitch,
    };
    notify();
  } else if (msg.type === 'INCIDENT_STATE_CHANGED' || msg.type === 'CANARY_VALIDATION_COMPLETED') {
    loadData();
  }
});

export function useDashboardStore() {
  const [, setTrigger] = useState(0);

  useEffect(() => {
    const handler = () => setTrigger((t) => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const updateThroughput = (bps: number, pps: number, drops: number) => {
    metricsState.currentIngressThroughputBps = bps;
    metricsState.currentPacketRatePps = pps;
    metricsState.kernelDropPps = drops;
    if (drops > 50) {
      metricsState.captureState = 'DEGRADED';
    }
    notify();
  };

  const toggleKillSwitch = async (reason?: string) => {
    const next = !metricsState.governedResponseKillSwitch;
    metricsState.governedResponseKillSwitch = next;
    notify();
    try {
      await dashboardService.setKillSwitch(next, reason);
    } catch {
      metricsState.governedResponseKillSwitch = !next;
      notify();
    }
  };

  const refreshDashboard = () => loadData();

  return {
    metrics: metricsState,
    charts: chartsState,
    isLoading: isLoadingMetrics,
    loadError,
    freshnessState,
    lastSyncTimestamp,
    updateThroughput,
    toggleKillSwitch,
    refreshDashboard,
  };
}
