import type { IncomingMessage } from 'node:http';
import { sessionStore } from '../stores/session-store.ts';

const TRUSTED_ORIGIN_FRAGMENTS = ['localhost', '127.0.0.1', '.run.app', '.google.com'];
const AUTH_PROTOCOL_PREFIX = 'zf-auth.';
const VERSION_PROTOCOL = 'zf-v1';
const BEARER_PREFIX = 'Bearer ';

export function isOriginAllowed(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  if (!origin) return true;

  const host = request.headers.host || '';
  return origin.includes(host) || TRUSTED_ORIGIN_FRAGMENTS.some((fragment) => origin.includes(fragment));
}

function tokenFromProtocols(protocolHeader: string | string[]): string | undefined {
  const raw = Array.isArray(protocolHeader) ? protocolHeader.join(',') : protocolHeader;
  const protocols = raw.split(',').map((protocol) => protocol.trim());

  for (const protocol of protocols) {
    if (protocol.startsWith(AUTH_PROTOCOL_PREFIX)) {
      return protocol.slice(AUTH_PROTOCOL_PREFIX.length);
    }
    if (protocol !== VERSION_PROTOCOL && sessionStore.hasToken(protocol)) {
      return protocol;
    }
  }
  return undefined;
}

function tokenFromAuthorizationHeader(header: string | undefined): string | undefined {
  return header?.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : undefined;
}

export function extractUpgradeToken(request: IncomingMessage, url: URL): string {
  const protocolHeader = request.headers['sec-websocket-protocol'];
  const protocolToken = protocolHeader ? tokenFromProtocols(protocolHeader) : undefined;

  return (
    protocolToken || url.searchParams.get('token') || tokenFromAuthorizationHeader(request.headers.authorization) || ''
  );
}
