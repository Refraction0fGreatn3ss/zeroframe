import { Router } from 'express';
import { authenticate, currentSession } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { approvePermit, executeRollback, issuePermit, liftQuarantine } from '../services/response-service.ts';

export function createResponseRouter(): Router {
  const router = Router();
  router.use('/response', authenticate, requireTenant);

  router.get('/response/permits', (req, res) => res.json({ permits: currentTenant(req).db.permits }));

  router.post('/response/permits', (req, res) => {
    const { actionType, targetResource, reason, compensatingControl } = req.body ?? {};
    const permit = issuePermit(currentTenant(req), currentSession(req), {
      actionType,
      targetResource,
      reason,
      compensatingControl,
    });
    return res.json({ success: true, permit });
  });

  router.post('/response/permits/:id/approve', (req, res) => {
    const permit = approvePermit(currentTenant(req), currentSession(req), req.params.id);
    if (!permit) {
      return res.status(404).json({ error: 'PERMIT_NOT_FOUND', message: 'Permit not found' });
    }
    return res.json({ success: true, permit });
  });

  router.get('/response/quarantine', (req, res) => res.json({ quarantine: currentTenant(req).db.quarantine }));

  router.post('/response/quarantine/:id/lift', (req, res) => {
    const rollback = liftQuarantine(currentTenant(req), currentSession(req), req.params.id);
    return res.json({ success: true, rollback });
  });

  router.get('/response/rollback', (req, res) => res.json({ rollbacks: currentTenant(req).db.rollbacks }));

  router.post('/response/rollback/:id', (req, res) => {
    const rollback = executeRollback(currentTenant(req), currentSession(req), req.params.id);
    return res.json({ success: true, rollback });
  });

  return router;
}
