import type { NextFunction, Request, Response } from 'express';
import { EXPLOIT_RULES, type ExploitRule } from './exploit-rules.ts';
import { threatLedger } from './threat-ledger.ts';

function matchText(text: string): ExploitRule | null {
  if (!text) return null;
  return EXPLOIT_RULES.find((rule) => rule.pattern.test(text)) ?? null;
}

function matchValue(value: unknown): ExploitRule | null {
  if (!value) return null;
  if (typeof value === 'string') return matchText(value);
  if (typeof value !== 'object') return null;

  for (const [key, nested] of Object.entries(value)) {
    const match = matchText(key) ?? matchValue(nested);
    if (match) return match;
  }
  return null;
}

function findExploit(req: Request): ExploitRule | null {
  return matchText(decodeURIComponent(req.originalUrl || req.url)) ?? matchValue(req.query) ?? matchValue(req.body);
}

export function payloadInspectionWafMiddleware(req: Request, res: Response, next: NextFunction) {
  const rule = findExploit(req);
  if (!rule) return next();

  threatLedger.record({
    id: `THR-DEF-${Date.now()}`,
    timestamp: new Date().toISOString(),
    category: rule.category,
    cveRefs: rule.cveRefs,
    clientIp: req.ip || '127.0.0.1',
    method: req.method,
    path: req.path,
    signatureMatched: rule.description,
    actionTaken: 'BLOCKED',
  });

  return res.status(403).json({
    error: 'WAF_CVE_THREAT_DEFLECTED',
    message: 'Security violation: Exploit payload signature intercepted by ZeroFrame Application Firewall.',
    category: rule.category,
    description: rule.description,
    cveReferences: rule.cveRefs,
    correlationId: (res.getHeader('x-correlation-id') as string) || `zf-sec-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
}
