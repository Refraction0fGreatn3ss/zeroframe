import type { NextFunction, Request, Response } from 'express';

interface HttpError {
  status?: unknown;
  code?: string;
  message?: string;
}

function resolveStatus(err: HttpError): number {
  return typeof err.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
}

export function safeErrorHandlerMiddleware(err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  const correlationId = (res.getHeader('x-correlation-id') as string) || `zf-err-${Date.now()}`;
  console.error(`[ZeroFrame WAF] Internal Exception (${correlationId}):`, err.message || err);

  const statusCode = resolveStatus(err);
  return res.status(statusCode).json({
    error: err.code || 'AUTHORITY_EXCEPTION',
    message:
      statusCode === 500
        ? 'An unexpected condition was intercepted. Detailed diagnostic stack traces are suppressed for security compliance (CWE-209).'
        : err.message || 'Request could not be processed.',
    correlationId,
  });
}
