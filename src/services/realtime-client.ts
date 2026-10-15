import { apiClient } from './api-client';
import type {
  RealtimeConnectionState,
  RealtimeEvent,
  RealtimeEventPayloads,
  RealtimeEventType,
  RealtimeFrame,
  RealtimeResyncResponse,
} from './realtime-events';

export type {
  RealtimeConnectionState,
  RealtimeEvent,
  RealtimeEventPayloads,
  RealtimeEventType,
  RealtimeMessage,
} from './realtime-events';

type MessageHandler = (message: RealtimeEvent) => void;
type StateHandler = (state: RealtimeConnectionState) => void;
type TimerHandle = ReturnType<typeof setTimeout>;

const HEARTBEAT_INTERVAL_MS = 15_000;
const RECONNECT_BASE_DELAY_MS = 1_000;
const RECONNECT_BACKOFF_FACTOR = 1.5;
const RECONNECT_JITTER_MS = 500;
const MAX_RECONNECT_DELAY_MS = 15_000;
const NORMAL_CLOSE_CODE = 1000;
const AUTH_FAILURE_CLOSE_CODES = new Set([4401, 4001]);
const PROTOCOL_VERSION = 'zf-v1';

export function computeReconnectDelay(attempt: number): number {
  const exponentialDelay = RECONNECT_BASE_DELAY_MS * RECONNECT_BACKOFF_FACTOR ** attempt;
  return Math.min(exponentialDelay + Math.random() * RECONNECT_JITTER_MS, MAX_RECONNECT_DELAY_MS);
}

function buildSocketUrl(tenantId: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // The token travels in the subprotocol header, never the query string, so it stays out of access logs.
  return `${protocol}//${window.location.host}/ws/events?tenantId=${encodeURIComponent(tenantId)}`;
}

class RealtimeClient {
  private ws: WebSocket | null = null;
  private state: RealtimeConnectionState = 'DISCONNECTED';
  private currentTenantId: string = apiClient.getTenantId();
  private lastSeq = 0;
  private readonly messageHandlers = new Set<MessageHandler>();
  private readonly stateHandlers = new Set<StateHandler>();
  private heartbeatTimer: TimerHandle | null = null;
  private reconnectTimer: TimerHandle | null = null;
  private reconnectAttempts = 0;
  private isExplicitlyClosed = false;

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

  public subscribe<TType extends RealtimeEventType>(
    eventType: TType,
    handler: (payload: RealtimeEventPayloads[TType]) => void,
  ) {
    return this.onMessage((message) => {
      if (message.type === eventType) {
        handler(message.payload as RealtimeEventPayloads[TType]);
      }
    });
  }

  public onStateChange(handler: StateHandler) {
    this.stateHandlers.add(handler);
    handler(this.state);
    return () => {
      this.stateHandlers.delete(handler);
    };
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

    try {
      this.ws = new WebSocket(buildSocketUrl(this.currentTenantId), [PROTOCOL_VERSION, `zf-auth.${token}`]);
      this.ws.onopen = () => this.handleOpen(token);
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = (event) => this.handleClose(event);
      this.ws.onerror = () => this.setState('DEGRADED');
    } catch {
      this.setState('DISCONNECTED');
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close(NORMAL_CLOSE_CODE, 'Client initiated disconnect');
      } catch {
        // Socket already closed.
      }
      this.ws = null;
    }
    this.setState('DISCONNECTED');
  }

  private setState(nextState: RealtimeConnectionState) {
    if (this.state !== nextState) {
      this.state = nextState;
      for (const handler of this.stateHandlers) handler(nextState);
    }
  }

  private handleOpen(token: string) {
    // Redundant first-frame AUTH handshake as defense in depth alongside the subprotocol token.
    try {
      this.ws?.send(JSON.stringify({ type: 'AUTH', token, tenantId: this.currentTenantId }));
    } catch {
      // The server authenticates from the subprotocol even if this frame fails.
    }

    this.setState('CONNECTED');
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    if (this.lastSeq > 0) {
      this.triggerResync();
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const frame = JSON.parse(event.data) as RealtimeFrame;

      if (frame.type === 'PONG') {
        return;
      }

      if (frame.type === 'CONNECTED') {
        if (frame.seq) {
          this.lastSeq = frame.seq;
        }
        return;
      }

      if (frame.type === 'SESSION_REVOKED') {
        this.disconnect();
        apiClient.setToken(null);
        return;
      }

      this.trackSequence(frame.seq);
      this.dispatch(frame);
    } catch (err) {
      console.error('[ZeroFrame Realtime] Failed parsing message', err);
    }
  }

  private handleClose(event: CloseEvent) {
    this.stopHeartbeat();
    if (this.isExplicitlyClosed) {
      this.setState('DISCONNECTED');
      return;
    }

    if (AUTH_FAILURE_CLOSE_CODES.has(event.code)) {
      this.setState('DISCONNECTED');
      apiClient.setToken(null);
      return;
    }

    this.scheduleReconnect();
  }

  private trackSequence(seq: unknown) {
    if (typeof seq !== 'number') return;
    if (this.lastSeq > 0 && seq > this.lastSeq + 1) {
      console.warn(
        `[ZeroFrame Realtime] Sequence gap detected (expected ${this.lastSeq + 1}, got ${seq}). Triggering resync.`,
      );
      this.triggerResync();
    }
    this.lastSeq = seq;
  }

  private dispatch(message: RealtimeEvent) {
    for (const handler of this.messageHandlers) handler(message);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.isExplicitlyClosed) return;
    this.setState('RECONNECTING');

    const delay = computeReconnectDelay(this.reconnectAttempts);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private async triggerResync() {
    try {
      const res = await apiClient.get<RealtimeResyncResponse>(
        `/realtime/resync?tenantId=${this.currentTenantId}&lastSeq=${this.lastSeq}`,
      );
      for (const missedEvent of res.data?.missedEvents ?? []) {
        this.lastSeq = Math.max(this.lastSeq, missedEvent.seq);
        this.dispatch(missedEvent);
      }
    } catch (err) {
      console.warn('[ZeroFrame Realtime] Resync fetch deferred', err);
    }
  }
}

export const realtimeClient = new RealtimeClient();
