/**
 * Sensor Fleet Store
 * Strictly separates: LIFECYCLE, CONNECTIVITY, HEALTH, OBSERVATION, TRUST
 * Connected to Authoritative Backend & Tenant Isolation Lifecycle
 */

import { useState, useEffect } from 'react';
import { SensorNode } from '../types/fleet';
import { systemService } from '../services/system-service';
import { tenantRegistry } from './tenant-registry';

const DEFAULT_SENSORS: SensorNode[] = [
  {
    id: 'sensor-core-01',
    name: 'SENSOR-CORE-01',
    hostname: 'zeroframe-appliance-core-01.corp',
    site: 'Primary Data Center (Frankfurt)',
    managementIp: '10.140.0.11',
    architecture: 'x86_64',
    version: '3.2.0-core',
    kernelVersion: 'Linux 6.5.0-44-generic',
    captureDriver: 'AF_XDP',
    queueCount: 16,
    activeQueue: 0,
    lifecycle: 'ACTIVE',
    connectivity: 'CONNECTED',
    health: 'DEGRADED',
    observation: 'OBSERVING_FULL',
    trust: 'TRUSTED_MTLS',
    spiffeId: 'spiffe://zeroframe.internal/sensor/core-01',
    certFingerprintSha256: 'e8f01a39b22a44cc...9911',
    certExpiresAt: '2027-04-15T00:00:00Z',
    caIssuer: 'ZeroFrame Internal CA (Offline Root)',
    interfaceName: 'enp4s0f0',
    promiscuousEnabled: true,
    wireThroughputMbps: 2450.0,
    packetRatePps: 342000,
    kernelDropsPps: 18,
    outboxPendingEvents: 340,
    lastHeartbeat: new Date(Date.now() - 1000 * 2).toISOString(),
    lastConfigSync: '2026-10-12T08:00:00Z',
    configVersion: 'v3.2.1-prod',
    rollbackReady: true,
    tenantId: 'tenant-enterprise-hq',
  },
];

let fleetState = {
  sensors: DEFAULT_SENSORS,
  selectedSensorId: DEFAULT_SENSORS[0].id,
  isLoading: false,
};

const listeners = new Set<(state: typeof fleetState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...fleetState }));
}

async function loadSensors() {
  fleetState.isLoading = true;
  notify();
  try {
    const list = await systemService.getFleetSensors();
    fleetState.sensors = list || [];
    if (fleetState.sensors.length > 0) {
      if (!fleetState.selectedSensorId || !fleetState.sensors.some(s => s.id === fleetState.selectedSensorId)) {
        fleetState.selectedSensorId = fleetState.sensors[0].id;
      }
    } else {
      fleetState.selectedSensorId = null;
    }
  } catch (err) {
    console.warn('[Fleet Store] Error loading fleet', err);
  } finally {
    fleetState.isLoading = false;
    notify();
  }
}

// Initial load
loadSensors();

// Register with tenant isolation registry
tenantRegistry.register(
  () => {
    fleetState.sensors = [];
    notify();
  },
  async () => {
    await loadSensors();
  }
);

export function useFleetStore() {
  const [state, setState] = useState(fleetState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const selectSensor = (id: string) => {
    fleetState.selectedSensorId = id;
    notify();
  };

  const selectedSensor = fleetState.sensors.find((s) => s.id === fleetState.selectedSensorId) || fleetState.sensors[0];

  return {
    ...state,
    selectedSensor,
    selectSensor,
    refreshFleet: loadSensors,
  };
}
