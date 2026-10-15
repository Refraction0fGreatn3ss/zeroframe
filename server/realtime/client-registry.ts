import { WebSocket } from 'ws';

export interface ConnectedClient {
  ws: WebSocket;
  sessionId: string;
  tenantId: string;
  lastPing: number;
}

const connectedClients = new Set<ConnectedClient>();

export const clientRegistry = {
  add(client: ConnectedClient): void {
    connectedClients.add(client);
  },

  remove(client: ConnectedClient): void {
    connectedClients.delete(client);
  },

  openClientsForTenant(tenantId: string): ConnectedClient[] {
    return [...connectedClients].filter(
      (client) => client.tenantId === tenantId && client.ws.readyState === WebSocket.OPEN,
    );
  },

  disconnectSession(sessionId: string, close: { code: number; reason: string; notice?: object }): void {
    for (const client of connectedClients) {
      if (client.sessionId !== sessionId) continue;
      if (close.notice) client.ws.send(JSON.stringify(close.notice));
      client.ws.close(close.code, close.reason);
      connectedClients.delete(client);
    }
  },
};
