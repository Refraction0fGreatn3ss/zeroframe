/**
 * Core Application Store
 * Controls:
 * 1. Simple SOC vs Analyst SOC Presentation Mode
 * 2. Operating Mode: ACTIVE_PROTECTION vs MONITOR_ONLY vs MAINTENANCE
 * 3. Autonomous Response Kill-Switch: ENABLED vs DISABLED
 * 4. Active Route / Navigation
 * 5. Global Command Palette & Operator Idle Lock
 * 6. Realtime WebSocket Live Link
 */

import { useState, useEffect } from 'react';
import { OperatingMode } from '../types';
import { realtimeClient, RealtimeConnectionState } from '../services/realtime-client';

export interface AppState {
  viewMode: 'SIMPLE_SOC' | 'ANALYST_SOC';
  operatingMode: OperatingMode;
  killSwitchEngaged: boolean;
  currentPath: string;
  isCommandPaletteOpen: boolean;
  isNotificationPanelOpen: boolean;
  isOperatorLocked: boolean;
  realtimeConnected: boolean;
  realtimeState: RealtimeConnectionState;
  lastHeartbeatTimestamp: string;
}

let globalState: AppState = {
  viewMode: 'ANALYST_SOC',
  operatingMode: 'ACTIVE_PROTECTION',
  killSwitchEngaged: false,
  currentPath: '/overview',
  isCommandPaletteOpen: false,
  isNotificationPanelOpen: false,
  isOperatorLocked: false,
  realtimeConnected: false,
  realtimeState: 'DISCONNECTED',
  lastHeartbeatTimestamp: new Date().toISOString(),
};

const listeners = new Set<(state: AppState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...globalState }));
}

// Bind directly to Realtime Client connection state
realtimeClient.onStateChange((state) => {
  globalState.realtimeState = state;
  globalState.realtimeConnected = state === 'CONNECTED';
  globalState.lastHeartbeatTimestamp = new Date().toISOString();
  notify();
});

// Kick off realtime connection if in browser
if (typeof window !== 'undefined') {
  realtimeClient.connect();
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const setViewMode = (mode: 'SIMPLE_SOC' | 'ANALYST_SOC') => {
    globalState.viewMode = mode;
    notify();
  };

  const setOperatingMode = (mode: OperatingMode) => {
    globalState.operatingMode = mode;
    notify();
  };

  const toggleKillSwitch = () => {
    globalState.killSwitchEngaged = !globalState.killSwitchEngaged;
    notify();
  };

  const setCurrentPath = (path: string) => {
    globalState.currentPath = path;
    notify();
  };

  const setCommandPaletteOpen = (open: boolean) => {
    globalState.isCommandPaletteOpen = open;
    notify();
  };

  const setNotificationPanelOpen = (open: boolean) => {
    globalState.isNotificationPanelOpen = open;
    notify();
  };

  const setOperatorLocked = (locked: boolean) => {
    globalState.isOperatorLocked = locked;
    notify();
  };

  const setRealtimeConnected = (connected: boolean) => {
    globalState.realtimeConnected = connected;
    globalState.lastHeartbeatTimestamp = new Date().toISOString();
    notify();
  };

  return {
    ...state,
    setViewMode,
    setOperatingMode,
    toggleKillSwitch,
    setCurrentPath,
    setCommandPaletteOpen,
    setNotificationPanelOpen,
    setOperatorLocked,
    setRealtimeConnected,
  };
}
