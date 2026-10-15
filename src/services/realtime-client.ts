import { RUNTIME_CONFIG } from '../config/runtime';
import { apiClient } from './api-client';
import type {
  RealtimeConnectionState,
  RealtimeEvent,
  RealtimeEventPayloads,
  RealtimeEventType,
  RealtimeFrame,
  RealtimeResyncResponse,
} from './realtime-events';
import { RealtimeSequencer } from './realtime-sequencer';

export type {
  RealtimeConnectionState,
  RealtimeEvent,
  RealtimeEventPayloads,
  RealtimeEventType,
  RealtimeMessage,
} from './realtime-events';

type MessageHandler = (message: RealtimeEvent) => void;
type StateHandler = (state: RealtimeConnectionState) => void;
type ResyncHandler = (reason: 'GAP' | 'BACKEND_RESTART') => void;
type AuthRevokedHandler = (reason: string) => void;
type TimerHandle = ReturnType<typeof setTimeout>;

const HEARTBEAT_INTERVAL_MS = 15_000;
const STALE_AFTER_MISSED_HEARTBEATS = 2;
const RECONNECT_BASE_DELAY_MS = 1_000;
const RECONNECT_BACKOFF_FACTOR = 1.5;
const RECONNECT_JITTER_MS = 500;
const MAX_RECONNECT_DELAY_MS = 15_000;
const NORMAL_CLOSE_CODE = 1000;
const AUTH_FAILURE_CLOSE_CODES = new Set([4401, 4001]);
const PROTOCOL_VERSION = 'zf-v1';

export function computeReconnectDelay(attempt: number, jitter: number = Math.random()): number {
  const exponentialDelay = RECONNECT_BASE_DELAY_MS * RECONNECT_BACKOFF_FACTOR ** attempt;
  return Math.min(exponentialDelay + jitter * RECONNECT_JITTER_MS, MAX_RECONNECT_DELAY_MS);
}

function buildSocketUrl(tenantId: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // The token travels in the subprotocol header, never the query string, so it stays out of access logs.
  return `${protocol}//${window.location.host}${RUNTIME_CONFIG.realtimePath}?tenantId=${encodeURIComponent(tenantId)}`;
}

class RealtimeClient {
  private ws: WebSocket | null = null;
  private state: RealtimeConnectionState = 'DISCONNECTED';
  private tenantId: string | null = null;
  private readonly sequencer = new RealtimeSequencer();
  private readonly messageHandlers = new Set<MessageHandler>();
  private readonly stateHandlers = new Set<StateHandler>();
  private readonly resyncHandlers = new Set<ResyncHandler>();
  private readonly authRevokedHandlers = new Set<AuthRevokedHandler>();
  private heartbeatTimer: TimerHandle | null = null;
  private reconnectTimer: TimerHandle | null = null;
  private lastFrameAt = 0;
  private reconnectAttempts = 0;
  private isExplicitlyClosed = true;

  getState(): RealtimeConnectionState {
    return this.state;
  }

  getLastSeq(): number {
    return this.sequencer.current;
  }

  getLastFrameAt(): number {
    return this.lastFrameAt;
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  subscribe<TType extends RealtimeEventType>(
    eventType: TType,
    handler: (payload: RealtimeEventPayloads[TType]) => void,
  ) {
    return this.onMessage((message) => {
      if (message.type === eventType) handler(message.payload as RealtimeEventPayloads[TType]);
    });
  }

  onStateChange(handler: StateHandler) {
    this.stateHandlers.add(handler);
    handler(this.state);
    return () => {
      this.stateHandlers.delete(handler);
    };
  }

  onResyncRequired(handler: ResyncHandler) {
    this.resyncHandlers.add(handler);
    return () => {
      this.resyncHandlers.delete(handler);
    };
  }

  onAuthRevoked(handler: AuthRevokedHandler) {
    this.authRevokedHandlers.add(handler);
    return () => {
      this.authRevokedHandlers.delete(handler);
    };
  }

  connect(tenantId: string) {
    const token = apiClient.getToken();
    if (!token) {
      this.setState('DISCONNECTED');
      return;
    }

    this.teardownSocket();
    if (this.tenantId !== tenantId) this.sequencer.reset();
    this.tenantId = tenantId;
    this.isExplicitlyClosed = false;
    this.setState(this.reconnectAttempts > 0 ? 'RECONNECTING' : 'CONNECTING');

    try {
      const socket = new WebSocket(buildSocketUrl(tenantId), [PROTOCOL_VERSION, `zf-auth.${token}`]);
      socket.onopen = () => this.handleOpen();
      socket.onmessage = (event) => this.handleMessage(event);
      socket.onclose = (event) => this.handleClose(event);
      socket.onerror = () => this.setState('DEGRADED');
      this.ws = socket;
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    this.reconnectAttempts = 0;
    this.teardownSocket();
    this.sequencer.reset();
    this.tenantId = null;
    this.setState('DISCONNECTED');
  }

  private teardownSocket() {
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      try {
        this.ws.close(NORMAL_CLOSE_CODE, 'Client initiated disconnect');
      } catch {
        // Socket already closed.
      }
      this.ws = null;
    }
  }

  private setState(nextState: RealtimeConnectionState) {
    if (this.state === nextState) return;
    this.state = nextState;
    for (const handler of this.stateHandlers) handler(nextState);
  }

  private handleOpen() {
    this.reconnectAttempts = 0;
    this.lastFrameAt = Date.now();
    this.setState('CONNECTED');
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent) {
    let frame: RealtimeFrame;
    try {
      frame = JSON.parse(event.data) as RealtimeFrame;
    } catch {
      return;
    }

    this.lastFrameAt = Date.now();
    if (this.state === 'STALE') this.setState('CONNECTED');

    switch (frame.type) {
      case 'PONG':
        return;
      case 'CONNECTED':
        this.handleConnectedFrame(frame.seq);
        return;
      case 'SESSION_REVOKED':
      case 'SESSION_EXPIRED':
        this.revokeAuth(frame.reason ?? frame.type);
        return;
      default:
        this.handleEvent(frame);
    }
  }

  private handleConnectedFrame(serverSeq: number | undefined) {
    const before = this.sequencer.current;
    const outcome = this.sequencer.acknowledgeConnect(serverSeq);
    if (outcome === 'RESTARTED') {
      this.notifyResync('BACKEND_RESTART');
    } else if (outcome === 'RESUMED' && serverSeq !== undefined && serverSeq > before) {
      void this.replayFrom(before);
    }
  }

  private handleEvent(event: RealtimeEvent) {
    if (event.tenantId && event.tenantId !== this.tenantId) return;
    const before = this.sequencer.current;
    const verdict = this.sequencer.observe(event.seq);
    if (verdict === 'DUPLICATE') return;
    if (verdict === 'GAP') void this.replayFrom(before);
    this.dispatch(event);
  }

  private handleClose(event: CloseEvent) {
    this.stopHeartbeat();
    this.ws = null;
    if (this.isExplicitlyClosed) {
      this.setState('DISCONNECTED');
      return;
    }
    if (AUTH_FAILURE_CLOSE_CODES.has(event.code)) {
      this.revokeAuth('REALTIME_AUTH_REJECTED');
      return;
    }
    this.scheduleReconnect();
  }

  private revokeAuth(reason: string) {
    this.isExplicitlyClosed = true;
    this.teardownSocket();
    this.setState('AUTH_REVOKED');
    for (const handler of this.authRevokedHandlers) handler(reason);
  }

  private dispatch(message: RealtimeEvent) {
    for (const handler of this.messageHandlers) handler(message);
  }

  private notifyResync(reason: 'GAP' | 'BACKEND_RESTART') {
    for (const handler of this.resyncHandlers) handler(reason);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (Date.now() - this.lastFrameAt > HEARTBEAT_INTERVAL_MS * STALE_AFTER_MISSED_HEARTBEATS) {
        this.setState('STALE');
      }
      if (this.ws?.readyState === WebSocket.OPEN) {
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
    if (this.isExplicitlyClosed || !this.tenantId) return;
    this.setState('RECONNECTING');
    const tenantId = this.tenantId;
    const delay = computeReconnectDelay(this.reconnectAttempts);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(tenantId), delay);
  }

  private async replayFrom(lastSeq: number) {
    const tenantId = this.tenantId;
    if (!tenantId) return;
    try {
      const res = await apiClient.get<RealtimeResyncResponse>(`/realtime/resync?lastSeq=${lastSeq}`, { tenantId });
      if (this.tenantId !== tenantId) return;
      for (const missed of res.data?.missedEvents ?? []) {
        if (this.sequencer.observe(missed.seq) !== 'DUPLICATE') this.dispatch(missed);
      }
    } catch {
      this.notifyResync('GAP');
    }
  }
}

export const realtimeClient = new RealtimeClient();
