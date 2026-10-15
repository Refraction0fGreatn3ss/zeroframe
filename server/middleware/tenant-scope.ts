import type { NextFunction, Request, Response } from 'express';
import { tenantStore } from '../stores/tenant-store.ts';
import type { TenantContext } from '../types/tenant.ts';

function requestedTenantId(req: Request): string | undefined {
  return (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || undefined;
}

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  const tenantId = requestedTenantId(req);
  const db = tenantStore.find(tenantId);
  if (!tenantId || !db) {
    return res.status(400).json({
      error: 'TENANT_NOT_FOUND',
      message: `Tenant '${tenantId}' is not authorized or does not exist on this cluster.`,
    });
  }

  req.tenant = { id: tenantId, db };
  next();
}

export function currentTenant(req: Request): TenantContext {
  if (!req.tenant) {
    throw new Error('currentTenant() called on a route without the requireTenant middleware');
  }
  return req.tenant;
}
