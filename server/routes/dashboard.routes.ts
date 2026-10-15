import { Router } from 'express';
import { authenticate, currentSession } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { setKillSwitch } from '../services/operations-service.ts';

export function createDashboardRouter(): Router {
  const router = Router();
  router.use('/dashboard', authenticate, requireTenant);

  router.get('/dashboard/metrics', (req, res) => res.json(currentTenant(req).db.metrics));

  router.get('/dashboard/charts', (req, res) => res.json(currentTenant(req).db.chartData));

  router.post('/dashboard/kill-switch', (req, res) => {
    const { engaged, reason } = req.body ?? {};
    const governedResponseKillSwitch = setKillSwitch(currentTenant(req), currentSession(req), engaged, reason);
    return res.json({ success: true, governedResponseKillSwitch });
  });

  return router;
}
