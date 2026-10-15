import { navigateTo } from '../app/navigation';
import { createStore, useStore } from '../lib/create-store';
import { type RealtimeConnectionState, realtimeClient } from '../services/realtime-client';
import type { OperatingMode } from '../types';

export type ViewMode = 'SIMPLE_SOC' | 'ANALYST_SOC';

export interface AppState {
  viewMode: ViewMode;
  operatingMode: OperatingMode;
  currentPath: string;
  isCommandPaletteOpen: boolean;
  isNotificationPanelOpen: boolean;
  isOperatorLocked: boolean;
  realtimeConnected: boolean;
  realtimeState: RealtimeConnectionState;
  lastHeartbeatTimestamp: string | null;
}

export const appStore = createStore<AppState>({
  viewMode: 'ANALYST_SOC',
  operatingMode: 'ACTIVE_PROTECTION',
  currentPath: typeof window === 'undefined' ? '/' : window.location.pathname,
  isCommandPaletteOpen: false,
  isNotificationPanelOpen: false,
  isOperatorLocked: false,
  realtimeConnected: false,
  realtimeState: 'DISCONNECTED',
  lastHeartbeatTimestamp: null,
});

realtimeClient.onStateChange((realtimeState) => {
  appStore.setState({
    realtimeState,
    realtimeConnected: realtimeState === 'CONNECTED',
    lastHeartbeatTimestamp:
      realtimeState === 'CONNECTED' ? new Date().toISOString() : appStore.getState().lastHeartbeatTimestamp,
  });
});

realtimeClient.onMessage(() => {
  appStore.setState({ lastHeartbeatTimestamp: new Date().toISOString() });
});

export const appActions = {
  setViewMode: (viewMode: ViewMode) => appStore.setState({ viewMode }),
  setOperatingMode: (operatingMode: OperatingMode) => appStore.setState({ operatingMode }),
  setCurrentPath: (path: string) => navigateTo(path),
  syncCurrentPath: (currentPath: string) => appStore.setState({ currentPath }),
  setCommandPaletteOpen: (isCommandPaletteOpen: boolean) => appStore.setState({ isCommandPaletteOpen }),
  setNotificationPanelOpen: (isNotificationPanelOpen: boolean) => appStore.setState({ isNotificationPanelOpen }),
  setOperatorLocked: (isOperatorLocked: boolean) => appStore.setState({ isOperatorLocked }),
};

export function useAppStore() {
  return { ...useStore(appStore), ...appActions };
}
