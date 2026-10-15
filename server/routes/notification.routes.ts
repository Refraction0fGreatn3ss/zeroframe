import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { buildTenantNotifications } from '../services/notification-service.ts';

export function createNotificationRouter(): Router {
  const router = Router();

  router.get('/notifications', authenticate, requireTenant, (req, res) => {
    return res.json({ notifications: buildTenantNotifications(currentTenant(req)) });
  });

  router.post('/notifications/:id/acknowledge', authenticate, (_req, res) => {
    return res.json({ success: true, acknowledged: true });
  });

  router.post('/notifications/clear-all', authenticate, (_req, res) => {
    return res.json({ success: true, cleared: true });
  });

  return router;
}
