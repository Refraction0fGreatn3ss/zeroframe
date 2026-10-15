import { createStore, useStore } from '../lib/create-store';
import { type RealtimeConnectionState, realtimeClient } from '../services/realtime-client';
import type { OperatingMode } from '../types';

export type ViewMode = 'SIMPLE_SOC' | 'ANALYST_SOC';

export interface AppState {
  viewMode: ViewMode;
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

const appStore = createStore<AppState>({
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
});

realtimeClient.onStateChange((realtimeState) => {
  appStore.setState({
    realtimeState,
    realtimeConnected: realtimeState === 'CONNECTED',
    lastHeartbeatTimestamp: new Date().toISOString(),
  });
});

if (typeof window !== 'undefined') {
  realtimeClient.connect();
}

export const appActions = {
  setViewMode: (viewMode: ViewMode) => appStore.setState({ viewMode }),
  setOperatingMode: (operatingMode: OperatingMode) => appStore.setState({ operatingMode }),
  toggleKillSwitch: () => appStore.setState((state) => ({ killSwitchEngaged: !state.killSwitchEngaged })),
  setCurrentPath: (currentPath: string) => appStore.setState({ currentPath }),
  setCommandPaletteOpen: (isCommandPaletteOpen: boolean) => appStore.setState({ isCommandPaletteOpen }),
  setNotificationPanelOpen: (isNotificationPanelOpen: boolean) => appStore.setState({ isNotificationPanelOpen }),
  setOperatorLocked: (isOperatorLocked: boolean) => appStore.setState({ isOperatorLocked }),
  setRealtimeConnected: (realtimeConnected: boolean) =>
    appStore.setState({ realtimeConnected, lastHeartbeatTimestamp: new Date().toISOString() }),
};

export function useAppStore() {
  return { ...useStore(appStore), ...appActions };
}
