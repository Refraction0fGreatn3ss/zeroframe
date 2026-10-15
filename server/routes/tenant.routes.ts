import { Router } from 'express';
import { buildCapabilityManifest } from '../data/capabilities.ts';
import { TENANT_DIRECTORY } from '../data/tenant-directory.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { currentTenant, requireTenant } from '../middleware/tenant-scope.ts';

export function createTenantRouter(): Router {
  const router = Router();

  router.get('/tenants', authenticate, (_req, res) => res.json(TENANT_DIRECTORY));

  router.get('/capabilities', authenticate, requireTenant, (req, res) => {
    return res.json(buildCapabilityManifest(currentTenant(req).db.metrics));
  });

  return router;
}
