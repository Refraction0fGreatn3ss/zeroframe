import type { NextFunction, Request, Response } from 'express';

function generateCorrelationId(): string {
  return `zf-corr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
  res.setHeader('x-correlation-id', correlationId);
  next();
}
