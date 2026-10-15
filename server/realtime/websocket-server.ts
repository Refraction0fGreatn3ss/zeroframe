import type { IncomingMessage, Server } from 'http';
import type { Duplex } from 'stream';
import { WebSocket, WebSocketServer } from 'ws';
import {
  DEFAULT_TENANT_ID,
  WEBSOCKET_AUTH_TIMEOUT_MS,
  WEBSOCKET_MAX_PAYLOAD_BYTES,
  WEBSOCKET_PATH,
} from '../config.ts';
import { sessionStore } from '../stores/session-store.ts';
import { tenantStore } from '../stores/tenant-store.ts';
import type { OperatorSession } from '../types/session.ts';
import { clientRegistry, type ConnectedClient } from './client-registry.ts';
import { extractUpgradeToken, isOriginAllowed } from './upgrade-guard.ts';

const UNAUTHORIZED_CLOSE_CODE = 4401;

function rejectUpgrade(socket: Duplex, statusLine: string): void {
  socket.write(`HTTP/1.1 ${statusLine}\r\n\r\n`);
  socket.destroy();
}

function sendJson(ws: WebSocket, message: object): void {
  ws.send(JSON.stringify(message));
}

function handleConnection(ws: WebSocket, initialSession: OperatorSession | undefined, tenantId: string): void {
  let client: ConnectedClient | null = null;
  let authTimeout: NodeJS.Timeout | null = null;

  const clearAuthTimeout = () => {
    if (authTimeout) clearTimeout(authTimeout);
    authTimeout = null;
  };

  const authenticate = (session: OperatorSession) => {
    clearAuthTimeout();
    client = { ws, sessionId: session.sessionId, tenantId, lastPing: Date.now() };
    clientRegistry.add(client);
    sendJson(ws, {
      type: 'CONNECTED',
      seq: tenantStore.find(tenantId)?.seqCounter ?? 0,
      tenantId,
      sessionId: session.sessionId,
      operator: session.operator.username,
      timestamp: new Date().toISOString(),
    });
  };

  const handleAuthFrame = (token: string) => {
    const session = sessionStore.findByToken(token);
    if (session) {
      authenticate(session);
    } else {
      ws.close(UNAUTHORIZED_CLOSE_CODE, 'Unauthorized: Invalid token in AUTH frame');
    }
  };

  const handlePing = () => {
    if (client) client.lastPing = Date.now();
    sendJson(ws, { type: 'PONG', timestamp: new Date().toISOString() });
  };

  const cleanup = () => {
    clearAuthTimeout();
    if (client) clientRegistry.remove(client);
  };

  if (initialSession) {
    authenticate(initialSession);
  } else {
    authTimeout = setTimeout(() => {
      if (!client) ws.close(UNAUTHORIZED_CLOSE_CODE, 'Unauthorized: Missing first-message AUTH handshake');
    }, WEBSOCKET_AUTH_TIMEOUT_MS);
  }

  ws.on('message', (data) => {
    let message: { type?: string; token?: string };
    try {
      message = JSON.parse(data.toString());
    } catch {
      return;
    }
    if (message.type === 'AUTH') handleAuthFrame(message.token || '');
    if (message.type === 'PING') handlePing();
  });

  ws.on('close', cleanup);
  ws.on('error', cleanup);
}

export function attachWebSocketServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true, maxPayload: WEBSOCKET_MAX_PAYLOAD_BYTES });

  httpServer.on('upgrade', (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname !== WEBSOCKET_PATH) return;

    const tenantId = url.searchParams.get('tenantId') || DEFAULT_TENANT_ID;
    if (!isOriginAllowed(request)) return rejectUpgrade(socket, '403 Forbidden');
    if (!tenantStore.exists(tenantId)) return rejectUpgrade(socket, '400 Bad Request');

    const token = extractUpgradeToken(request, url);
    const session = token ? sessionStore.findByToken(token) : undefined;

    wss.handleUpgrade(request, socket, head, (ws) => handleConnection(ws, session, tenantId));
  });

  return wss;
}
