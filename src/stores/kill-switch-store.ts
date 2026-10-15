import { createStore, useStore } from '../lib/create-store';
import { type LoadIssue, toLoadIssue } from '../lib/load-state';
import { killSwitchService } from '../services/kill-switch-service';
import { realtimeClient } from '../services/realtime-client';
import { tenantRegistry } from './tenant-registry';

export type KillSwitchState = 'ENGAGED' | 'DISENGAGED' | 'UNKNOWN';

interface KillSwitchStoreState {
  state: KillSwitchState;
  lastConfirmedAt: string | null;
  isPending: boolean;
  issue: LoadIssue | null;
}

const initialState = (): KillSwitchStoreState => ({
  state: 'UNKNOWN',
  lastConfirmedAt: null,
  isPending: false,
  issue: null,
});

const killSwitchStore = createStore<KillSwitchStoreState>(initialState());

function applyAuthoritative(engaged: boolean): void {
  killSwitchStore.setState({
    state: engaged ? 'ENGAGED' : 'DISENGAGED',
    lastConfirmedAt: new Date().toISOString(),
    issue: null,
  });
}

async function requestChange(engaged: boolean, reason: string): Promise<boolean> {
  killSwitchStore.setState({ isPending: true, issue: null });
  try {
    const result = await killSwitchService.setEngaged(engaged, reason);
    applyAuthoritative(result.governedResponseKillSwitch);
    return true;
  } catch (error) {
    killSwitchStore.setState({ issue: toLoadIssue(error) });
    return false;
  } finally {
    killSwitchStore.setState({ isPending: false });
  }
}

realtimeClient.subscribe('KILL_SWITCH_CHANGED', (payload) => applyAuthoritative(payload.governedResponseKillSwitch));

tenantRegistry.register('kill-switch', { clear: () => killSwitchStore.setState(initialState()) });

export const killSwitchActions = {
  applyAuthoritative,
  requestChange,
};

export function useKillSwitch() {
  return { ...useStore(killSwitchStore), ...killSwitchActions };
}
