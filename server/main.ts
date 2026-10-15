import express, { type Express } from 'express';
import http from 'http';
import path from 'path';
import { createApiApp } from './api.ts';
import { API_BASE_PATH, isProduction, resolvePort } from './config.ts';
import { startHeartbeatSimulation } from './realtime/heartbeat-simulator.ts';
import { attachWebSocketServer } from './realtime/websocket-server.ts';
import { securityHeadersMiddleware } from './security/index.ts';

function serveStaticBuild(app: Express): void {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

async function mountViteDevServer(app: Express): Promise<void> {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');
  app.use(securityHeadersMiddleware);

  const server = http.createServer(app);
  app.use(API_BASE_PATH, createApiApp());
  attachWebSocketServer(server);
  startHeartbeatSimulation();

  if (isProduction()) {
    serveStaticBuild(app);
  } else {
    await mountViteDevServer(app);
  }

  const port = resolvePort();
  server.listen(port, '0.0.0.0', () => {
    console.log(`[ZeroFrame Authority] Server listening on port ${port} (${isProduction() ? 'production' : 'development'})`);
  });
}

startServer();
