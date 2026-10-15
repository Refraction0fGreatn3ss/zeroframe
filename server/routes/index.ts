import { Router } from 'express';
import { createAuthRouter } from './auth.routes.ts';
import { createDashboardRouter } from './dashboard.routes.ts';
import { createEvidenceRouter } from './evidence.routes.ts';
import { createInvestigationRouter } from './investigation.routes.ts';
import { createNotificationRouter } from './notification.routes.ts';
import { createRealtimeRouter } from './realtime.routes.ts';
import { createResponseRouter } from './response.routes.ts';
import { createSecurityRouter } from './security.routes.ts';
import { createSystemRouter } from './system.routes.ts';
import { createTenantRouter } from './tenant.routes.ts';

export function createRoutes(): Router {
  const router = Router();
  router.use(createSecurityRouter());
  router.use(createAuthRouter());
  router.use(createTenantRouter());
  router.use(createDashboardRouter());
  router.use(createInvestigationRouter());
  router.use(createNotificationRouter());
  router.use(createResponseRouter());
  router.use(createEvidenceRouter());
  router.use(createSystemRouter());
  router.use(createRealtimeRouter());
  return router;
}
