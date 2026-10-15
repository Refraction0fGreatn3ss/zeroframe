import type { NextFunction, Request, Response } from 'express';
import { threatLedger } from './threat-ledger.ts';

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_DEPTH = 10;

function containsForbiddenKey(value: unknown, depth = 0): boolean {
  if (!value || typeof value !== 'object' || depth > MAX_DEPTH) return false;

  for (const key of Object.getOwnPropertyNames(value)) {
    if (FORBIDDEN_KEYS.has(key)) return true;
    try {
      if (containsForbiddenKey((value as Record<string, unknown>)[key], depth + 1)) return true;
    } catch {
      return true;
    }
  }
  return false;
}

export function prototypePollutionGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!containsForbiddenKey(req.body) && !containsForbiddenKey(req.query) && !containsForbiddenKey(req.params)) {
    return next();
  }

  threatLedger.record({
    id: `THR-PROTO-${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: 'Prototype Pollution',
    cveRefs: ['CVE-2020-8203', 'CVE-2021-25928', 'CWE-1321'],
    clientIp: req.ip || '127.0.0.1',
    method: req.method,
    path: req.path,
    signatureMatched: '__proto__ / constructor key injection',
    actionTaken: 'BLOCKED',
  });

  return res.status(400).json({
    error: 'PROTOTYPE_POLLUTION_BLOCKED',
    message: 'Malicious prototype pollution payload rejected by ZeroFrame Application Firewall (CWE-1321).',
  });
}
