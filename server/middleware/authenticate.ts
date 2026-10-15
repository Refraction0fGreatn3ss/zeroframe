import type { NextFunction, Request, Response } from 'express';
import { expireIdleSession, inactivityMinutesOf, isSessionIdle, touchSession } from '../services/session-service.ts';
import { sessionStore } from '../stores/session-store.ts';
import type { OperatorSession } from '../types/session.ts';

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) return null;
  return header.substring(BEARER_PREFIX.length).trim();
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization bearer token',
    });
  }

  const session = sessionStore.findByToken(token);
  if (!session) {
    return res.status(401).json({
      error: 'SESSION_EXPIRED',
      message: 'The requested session token is invalid, expired, or revoked',
    });
  }

  if (isSessionIdle(session)) {
    expireIdleSession(session);
    return res.status(401).json({
      error: 'SESSION_INACTIVITY_TIMEOUT',
      message: `Session terminated & keys destroyed: Inactivity threshold (${inactivityMinutesOf(session)} minutes) exceeded pursuant to compliance policy.`,
    });
  }

  touchSession(session);
  req.operatorSession = session;
  next();
}

export function currentSession(req: Request): OperatorSession {
  if (!req.operatorSession) {
    throw new Error('currentSession() called on a route without the authenticate middleware');
  }
  return req.operatorSession;
}
