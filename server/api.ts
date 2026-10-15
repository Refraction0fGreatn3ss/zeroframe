import express, { type Express } from 'express';
import { JSON_BODY_LIMIT } from './config.ts';
import { createRoutes } from './routes/index.ts';
import {
  correlationIdMiddleware,
  csrfGuardMiddleware,
  httpMethodGuardMiddleware,
  payloadInspectionWafMiddleware,
  prototypePollutionGuardMiddleware,
  rateLimiterMiddleware,
  safeErrorHandlerMiddleware,
  securityHeadersMiddleware,
} from './security/index.ts';

export function createApiApp(): Express {
  const api = express();
  api.disable('x-powered-by');

  api.use(httpMethodGuardMiddleware);
  api.use(express.json({ limit: JSON_BODY_LIMIT }));
  api.use(correlationIdMiddleware);
  api.use(securityHeadersMiddleware);
  api.use(rateLimiterMiddleware);
  api.use(prototypePollutionGuardMiddleware);
  api.use(payloadInspectionWafMiddleware);
  api.use(csrfGuardMiddleware);

  api.use(createRoutes());

  api.use(safeErrorHandlerMiddleware);
  return api;
}
