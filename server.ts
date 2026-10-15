/**
 * ZeroFrame Enterprise 1.0 - Full-Stack Server Entry Point
 * Implements React Guidelines: Express entry point with vite.middlewares in dev,
 * and static production asset serving in production.
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupBackendAuthority } from './server/backend-authority.ts';
import { cveSecurityHeadersMiddleware } from './server/security-shield.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cveSecurityHeadersMiddleware);

  const server = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Setup Backend Authority on API (/api/v1) & WebSockets (/ws/events)
  setupBackendAuthority(server, app);

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Serve static build assets in production
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // SPA fallback
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mount Vite development middlewares in dev mode ("dev": "tsx server.ts")
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZeroFrame Authority] Server listening on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
