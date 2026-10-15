import type { NextFunction, Request, Response } from 'express';
import { threatLedger } from './threat-ledger.ts';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);
const EXEMPT_PATHS = new Set(['/auth/login']);

function hasTrustedCustomHeader(req: Request): boolean {
  return Boolean(req.headers['x-tenant-id'] || req.headers['x-correlation-id'] || req.headers.authorization);
}

export function csrfGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING_METHODS.has(req.method.toUpperCase()) || EXEMPT_PATHS.has(req.path)) {
    return next();
  }

  if (req.headers['sec-fetch-site'] === 'cross-site') {
    threatLedger.countDeflection();
    return res.status(403).json({
      error: 'CSRF_CROSS_SITE_FETCH_BLOCKED',
      message: 'State-mutating request rejected: Cross-site fetch detected via Sec-Fetch-Site policy (CWE-352).',
    });
  }

  if (!hasTrustedCustomHeader(req)) {
    threatLedger.countDeflection();
    return res.status(403).json({
      error: 'CSRF_ORIGIN_VERIFICATION_FAILED',
      message:
        'State-mutating request rejected: Missing authoritative custom headers required for CSRF protection (CWE-352).',
    });
  }

  next();
}
