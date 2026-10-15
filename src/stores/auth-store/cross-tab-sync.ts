import { type AuthSyncMessage, parseAuthSyncMessage, storageChangeToSyncMessage } from './auth-sync-messages';

const AUTH_SYNC_CHANNEL_NAME = 'zeroframe_auth_sync_bus';

function openSyncChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  try {
    return new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);
  } catch {
    return null;
  }
}

const syncChannel = openSyncChannel();

export function postAuthSyncMessage(message: AuthSyncMessage): void {
  if (!syncChannel) return;
  try {
    syncChannel.postMessage(message);
  } catch {
    // Other tabs fall back to the localStorage bus.
  }
}

export function listenForAuthSync(handler: (message: AuthSyncMessage) => void): void {
  if (typeof window === 'undefined') return;

  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      const message = parseAuthSyncMessage(event.data);
      if (message) handler(message);
    };
  }

  window.addEventListener('storage', (event) => {
    const message = storageChangeToSyncMessage(event.key, event.newValue);
    if (message) handler(message);
  });
}
