import type { NextFunction, Request, Response } from 'express';

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']);
const TRACE_METHODS = new Set(['TRACE', 'TRACK']);
const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);

function hasNonJsonBody(req: Request): boolean {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  return contentLength > 0 && !contentType.includes('application/json');
}

export function httpMethodGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();

  if (TRACE_METHODS.has(method)) {
    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: 'HTTP TRACE/TRACK methods are disabled (XST / CWE-693 mitigation).',
    });
  }

  if (!ALLOWED_METHODS.has(method)) {
    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: `HTTP method ${method} is not permitted on ZeroFrame Enterprise APIs.`,
    });
  }

  if (BODY_METHODS.has(method) && hasNonJsonBody(req)) {
    return res.status(415).json({
      error: 'UNSUPPORTED_MEDIA_TYPE',
      message: 'Expected Content-Type: application/json for state-mutating requests (Section 91).',
    });
  }

  next();
}
