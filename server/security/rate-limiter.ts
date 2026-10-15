import type { NextFunction, Request, Response } from 'express';
import { threatLedger } from './threat-ledger.ts';

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const WINDOW_MS = 60 * 1000;
const AUTH_LIMIT_PER_WINDOW = 25;
const API_LIMIT_PER_WINDOW = 400;
const AUTH_ROUTE_PREFIXES = ['/auth/login', '/auth/unlock', '/auth/step-up'];

const apiBuckets = new Map<string, RateLimitBucket>();
const authBuckets = new Map<string, RateLimitBucket>();

function evictExpired(store: Map<string, RateLimitBucket>, now: number): void {
  for (const [key, bucket] of store) {
    if (now > bucket.resetTime) store.delete(key);
  }
}

setInterval(() => {
  const now = Date.now();
  evictExpired(apiBuckets, now);
  evictExpired(authBuckets, now);
}, WINDOW_MS).unref();

function isAuthRoute(path: string): boolean {
  return AUTH_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function consume(store: Map<string, RateLimitBucket>, key: string, now: number): RateLimitBucket {
  const bucket = store.get(key) || { count: 0, resetTime: now + WINDOW_MS };
  if (now > bucket.resetTime) {
    bucket.count = 1;
    bucket.resetTime = now + WINDOW_MS;
  } else {
    bucket.count++;
  }
  store.set(key, bucket);
  return bucket;
}

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const authRoute = isAuthRoute(req.path);
  const bucket = consume(authRoute ? authBuckets : apiBuckets, clientIp, now);
  const limit = authRoute ? AUTH_LIMIT_PER_WINDOW : API_LIMIT_PER_WINDOW;

  if (bucket.count <= limit) return next();

  threatLedger.countDeflection();
  const retryAfterSeconds = Math.ceil((bucket.resetTime - now) / 1000);
  res.setHeader('Retry-After', String(retryAfterSeconds));
  return res.status(429).json({
    error: 'RATE_LIMIT_EXCEEDED',
    message: `Anti-Automation & DoS Rate Limiter engaged (CWE-799 / CWE-307). Max threshold exceeded. Retry in ${retryAfterSeconds} seconds.`,
    retryAfterSeconds,
  });
}
