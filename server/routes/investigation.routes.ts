import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { changeIncidentState } from '../services/operations-service.ts';

export function createInvestigationRouter(): Router {
  const router = Router();
  router.use('/investigation', authenticate, requireTenant);

  router.get('/investigation/incidents', (req, res) => res.json({ incidents: currentTenant(req).db.incidents }));

  router.get('/investigation/alerts', (req, res) => res.json({ alerts: currentTenant(req).db.alerts }));

  router.get('/investigation/entities', (req, res) => res.json({ entities: currentTenant(req).db.entities }));

  router.post('/investigation/incidents/:id/state', (req, res) => {
    const incident = changeIncidentState(currentTenant(req), req.params.id, req.body?.state);
    if (!incident) {
      return res.status(404).json({ error: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
    }
    return res.json({ success: true, incident });
  });

  return router;
}
