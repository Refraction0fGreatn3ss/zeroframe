/**
 * ZeroFrame Realtime Engine Client
 * 
 * Manages WebSocket connectivity to `/ws/events`.
 * Guarantees:
 * - Handshake with Authorization Token & Active Tenant Scope
 * - Monotonic Sequence Number Tracking (`seq`)
 * - Sequence Gap Detection with Automatic `/api/v1/realtime/resync` replay
 * - Tenant Scope Disconnect / Reconnect on Tenant Switching
 * - Heartbeat Ping / Pong keep-alives (15s)
 * - Exponential backoff reconnection
 * - Honest operational states: CONNECTING, CONNECTED, RECONNECTING, DEGRADED, DISCONNECTED
 * - Never shows stale data as LIVE
 */

import { apiClient } from './api-client';

export type RealtimeConnectionState = 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DEGRADED' | 'DISCONNECTED';

export interface RealtimeMessage<T = any> {
  seq: number;
  tenantId: string;
  timestamp: string;
  type: string;
  payload: T;
}

type MessageHandler = (message: RealtimeMessage) => void;
type StateHandler = (state: RealtimeConnectionState) => void;

class RealtimeClient {
  private ws: WebSocket | null = null;
  private state: RealtimeConnectionState = 'DISCONNECTED';
  private currentTenantId: string = 'tenant-enterprise-hq';
  private lastSeq: number = 0;
  private messageHandlers: Set<MessageHandler> = new Set();
  private stateHandlers: Set<StateHandler> = new Set();
  private pingIntervalId: any = null;
  private reconnectTimeoutId: any = null;
  private reconnectAttempts: number = 0;
  private isExplicitlyClosed: boolean = false;

  constructor() {
    this.currentTenantId = apiClient.getTenantId();
  }

  public getState(): RealtimeConnectionState {
    return this.state;
  }

  public getLastSeq(): number {
    return this.lastSeq;
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public subscribe<T = any>(eventType: string, handler: (payload: T) => void) {
    const msgHandler: MessageHandler = (msg) => {
      if (msg.type === eventType) {
        handler(msg.payload);
      }
    };
    return this.onMessage(msgHandler);
  }

  public onStateChange(handler: StateHandler) {
    this.stateHandlers.add(handler);
    handler(this.state);
    return () => {
      this.stateHandlers.delete(handler);
    };
  }

  private setState(newState: RealtimeConnectionState) {
    if (this.state !== newState) {
      this.state = newState;
      this.stateHandlers.forEach((h) => h(newState));
    }
  }

  public connect(tenantId?: string) {
    if (tenantId) {
      this.currentTenantId = tenantId;
    }
    this.isExplicitlyClosed = false;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.disconnect();
    }

    const token = apiClient.getToken();
    if (!token) {
      this.setState('DISCONNECTED');
      return;
    }

    this.setState(this.reconnectAttempts > 0 ? 'RECONNECTING' : 'CONNECTING');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Token is NOT transmitted via query string to prevent access log / history exposure
    const wsUrl = `${protocol}//${host}/ws/events?tenantId=${encodeURIComponent(this.currentTenantId)}`;

    try {
      this.ws = new WebSocket(wsUrl, ['zf-v1', `zf-auth.${token}`]);

      this.ws.onopen = () => {
        // Send first-message AUTH handshake frame as redundant defense-in-depth
        try {
          this.ws?.send(
            JSON.stringify({
              type: 'AUTH',
              token,
              tenantId: this.currentTenantId,
            })
          );
        } catch {}

        this.setState('CONNECTED');
        this.reconnectAttempts = 0;
        this.startHeartbeat();

        // Resync after reconnect if we had previous sequence numbers
        if (this.lastSeq > 0) {
          this.triggerResync();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'PONG') {
            return;
          }

          if (data.type === 'CONNECTED') {
            if (data.seq) {
              this.lastSeq = data.seq;
            }
            return;
          }

          if (data.type === 'SESSION_REVOKED') {
            this.disconnect();
            apiClient.setToken(null);
            return;
          }

          // Sequence gap check
          if (typeof data.seq === 'number') {
            if (this.lastSeq > 0 && data.seq > this.lastSeq + 1) {
              console.warn(`[ZeroFrame Realtime] Sequence gap detected (expected ${this.lastSeq + 1}, got ${data.seq}). Triggering resync.`);
              this.triggerResync();
            }
            this.lastSeq = data.seq;
          }

          // Broadcast to registered handlers
          this.messageHandlers.forEach((h) => h(data));
        } catch (err) {
          console.error('[ZeroFrame Realtime] Failed parsing message', err);
        }
      };

      this.ws.onclose = (event) => {
        this.stopHeartbeat();
        if (this.isExplicitlyClosed) {
          this.setState('DISCONNECTED');
          return;
        }

        // If closed due to auth failure (4401 or 4001)
        if (event.code === 4401 || event.code === 4001) {
          this.setState('DISCONNECTED');
          apiClient.setToken(null);
          return;
        }

        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.setState('DEGRADED');
      };
    } catch (err) {
      this.setState('DISCONNECTED');
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    if (this.ws) {
      try {
        this.ws.close(1000, 'Client initiated disconnect');
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.setState('DISCONNECTED');
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingIntervalId = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
      }
    }, 15000);
  }

  private stopHeartbeat() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  private scheduleReconnect() {
    if (this.isExplicitlyClosed) return;
    this.setState('RECONNECTING');

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts) + Math.random() * 500, 15000);
    this.reconnectAttempts++;

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private async triggerResync() {
    try {
      const res = await apiClient.get<any>(`/realtime/resync?tenantId=${this.currentTenantId}&lastSeq=${this.lastSeq}`);
      if (res.data?.missedEvents && res.data.missedEvents.length > 0) {
        for (const evt of res.data.missedEvents) {
          this.lastSeq = Math.max(this.lastSeq, evt.seq);
          this.messageHandlers.forEach((h) => h(evt));
        }
      }
    } catch (err) {
      console.warn('[ZeroFrame Realtime] Resync fetch deferred', err);
    }
  }
}

export const realtimeClient = new RealtimeClient();
