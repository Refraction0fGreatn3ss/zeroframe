import { describe, expect, it } from 'vitest';
import { resolveCapabilityState } from '../../src/lib/capability-state';
import type { CapabilityManifest } from '../../src/services/capability-service';

const manifest: CapabilityManifest = {
  status: 'FRESH',
  manifestVersion: 'test',
  generatedAt: '2026-10-15T00:00:00Z',
  capabilities: [
    { id: 'supported', name: 'Supported', status: 'FRESH' },
    { id: 'degraded', name: 'Degraded', status: 'DEGRADED' },
    { id: 'odd', name: 'Odd', status: 'SOMETHING_NEW' },
  ],
};

describe('resolveCapabilityState', () => {
  it('is LOADING before the manifest arrives', () => {
    expect(resolveCapabilityState('supported', null, 'IDLE')).toBe('LOADING');
    expect(resolveCapabilityState('supported', null, 'LOADING')).toBe('LOADING');
  });

  it('treats a failed manifest as UNKNOWN, never UNSUPPORTED', () => {
    expect(resolveCapabilityState('supported', null, 'UNAVAILABLE')).toBe('UNKNOWN');
    expect(resolveCapabilityState('supported', null, 'ERROR')).toBe('UNKNOWN');
  });

  it('maps manifest entries', () => {
    expect(resolveCapabilityState('supported', manifest, 'READY')).toBe('SUPPORTED');
    expect(resolveCapabilityState('degraded', manifest, 'READY')).toBe('UNAVAILABLE');
    expect(resolveCapabilityState('missing', manifest, 'READY')).toBe('UNSUPPORTED');
    expect(resolveCapabilityState('odd', manifest, 'READY')).toBe('UNKNOWN');
  });

  it('marks supported capabilities STALE when the manifest is stale', () => {
    expect(resolveCapabilityState('supported', manifest, 'STALE')).toBe('STALE');
  });
});
