import { Router } from 'express';
import { getCveDefensesSummary } from '../security/index.ts';

export function createSecurityRouter(): Router {
  const router = Router();
  router.get('/security/cve-defense-status', (_req, res) => res.json(getCveDefensesSummary()));
  return router;
}
