import { Router } from 'express';
import { ENTERPRISE_LICENSE } from '../data/licensing.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';
import { normalizeSensor } from '../services/fleet-service.ts';
import { triggerCanaryValidation } from '../services/operations-service.ts';

export function createSystemRouter(): Router {
  const router = Router();

  router.get('/system/licensing', authenticate, (_req, res) => res.json(ENTERPRISE_LICENSE));

  router.use('/system', authenticate, requireTenant);

  router.get('/system/fleet', (req, res) => {
    const tenant = currentTenant(req);
    return res.json({ sensors: tenant.db.fleetSensors.map((sensor) => normalizeSensor(sensor, tenant.id)) });
  });

  router.get('/system/inspection', (req, res) => res.json(currentTenant(req).db.inspectionPipeline));

  router.get('/system/assurance', (req, res) =>
    res.json({ capabilities: currentTenant(req).db.detectionCapabilities }),
  );

  router.post('/system/assurance/trigger-canary', (req, res) => {
    const auditedAt = triggerCanaryValidation(currentTenant(req));
    return res.json({
      success: true,
      auditedAt,
      message: 'Active canary injections completed across sensor ring buffers.',
    });
  });

  router.get('/system/compliance', (req, res) => res.json({ frameworks: currentTenant(req).db.complianceFrameworks }));

  router.get('/system/integrations', (req, res) => res.json({ integrations: currentTenant(req).db.integrations }));

  router.get('/system/audit', (req, res) => res.json({ logs: currentTenant(req).db.auditLogs }));

  return router;
}
