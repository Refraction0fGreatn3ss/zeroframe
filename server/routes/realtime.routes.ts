import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { resyncSince } from '../services/operations-service.ts';

export function createRealtimeRouter(): Router {
  const router = Router();

  router.get('/realtime/resync', authenticate, requireTenant, (req, res) => {
    const lastSeq = parseInt(req.query.lastSeq as string, 10) || 0;
    return res.json(resyncSince(currentTenant(req), lastSeq));
  });

  return router;
}
