import { isProduction } from '../config.ts';
import { createDevSeedSession } from '../data/operators.ts';
import type { OperatorSession } from '../types/session.ts';

const sessionsByToken = new Map<string, OperatorSession>();

if (!isProduction()) {
  const seed = createDevSeedSession();
  sessionsByToken.set(seed.token, seed);
}

export const sessionStore = {
  findByToken(token: string): OperatorSession | undefined {
    return sessionsByToken.get(token);
  },

  hasToken(token: string): boolean {
    return sessionsByToken.has(token);
  },

  save(session: OperatorSession): void {
    sessionsByToken.set(session.token, session);
  },

  deleteByToken(token: string): void {
    sessionsByToken.delete(token);
  },

  deleteBySessionId(sessionId: string): boolean {
    for (const [token, session] of sessionsByToken) {
      if (session.sessionId === sessionId) {
        sessionsByToken.delete(token);
        return true;
      }
    }
    return false;
  },

  list(): OperatorSession[] {
    return Array.from(sessionsByToken.values());
  },
};
