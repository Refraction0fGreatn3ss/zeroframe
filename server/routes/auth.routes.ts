import { Router, type Request } from 'express';
import { authenticate, currentSession } from '../middleware/authenticate.ts';
import { login, verifyStepUp, verifyUnlockPin, type ClientInfo } from '../services/login-service.ts';
import {
  applyInactivityPolicy,
  inactivityTimeoutOf,
  listSessionSummaries,
  remainingInactivityMs,
  revokeSession,
  signOut,
} from '../services/session-service.ts';

function clientInfoOf(req: Request): ClientInfo {
  return {
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Browser',
  };
}

export function createAuthRouter(): Router {
  const router = Router();

  router.post('/auth/login', (req, res) => {
    const result = login(req.body ?? {}, clientInfoOf(req));
    if (!result.ok) {
      return res.status(401).json({ error: result.error, message: result.message });
    }
    return res.json({ session: result.session });
  });

  router.get('/auth/session', authenticate, (req, res) => {
    const session = currentSession(req);
    return res.json({ valid: true, session, operator: session.operator });
  });

  router.post('/auth/step-up', authenticate, (req, res) => {
    const session = currentSession(req);
    if (!verifyStepUp(session, req.body?.code)) {
      return res.status(403).json({
        error: 'STEP_UP_FAILED',
        message: 'Invalid TOTP / FIDO2 security token challenge response.',
      });
    }
    return res.json({
      success: true,
      message: 'Step-up MFA verified. Dual-control and destructive privileges elevated.',
      stepUpExpiresAt: session.stepUpExpiresAt,
    });
  });

  router.post('/auth/unlock', authenticate, (req, res) => {
    if (!verifyUnlockPin(req.body?.pin)) {
      return res.status(401).json({ error: 'INVALID_PIN', message: 'Incorrect operator unlock PIN.' });
    }
    return res.json({ unlocked: true, unlockedAt: new Date().toISOString() });
  });

  router.post('/auth/ping', authenticate, (req, res) => {
    const session = currentSession(req);
    return res.json({
      valid: true,
      sessionId: session.sessionId,
      serverTime: new Date().toISOString(),
      policy: session.policyKey || '15m',
      inactivityTimeoutMs: inactivityTimeoutOf(session),
      remainingInactivityMs: remainingInactivityMs(session),
    });
  });

  router.post('/auth/policy', authenticate, (req, res) => {
    const applied = applyInactivityPolicy(currentSession(req), req.body?.policy);
    return res.json({ success: true, ...applied, serverTime: new Date().toISOString() });
  });

  router.post('/auth/logout', authenticate, (req, res) => {
    const reason = req.body?.reason || 'OPERATOR_SIGN_OUT';
    signOut(currentSession(req), reason);
    return res.json({ success: true, message: `Operator session revoked (${reason}).` });
  });

  router.get('/auth/sessions', authenticate, (req, res) => {
    return res.json({ sessions: listSessionSummaries(currentSession(req).sessionId) });
  });

  router.delete('/auth/sessions/:sessionId', authenticate, (req, res) => {
    const { sessionId } = req.params;
    if (!revokeSession(sessionId)) {
      return res.status(404).json({ error: 'SESSION_NOT_FOUND', message: 'Session ID not found.' });
    }
    return res.json({ success: true, message: `Session ${sessionId} terminated.` });
  });

  return router;
}
