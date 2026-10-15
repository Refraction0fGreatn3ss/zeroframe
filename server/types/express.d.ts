import type { OperatorSession } from './session.ts';
import type { TenantContext } from './tenant.ts';

declare global {
  namespace Express {
    interface Request {
      operatorSession?: OperatorSession;
      tenant?: TenantContext;
    }
  }
}

export {};
