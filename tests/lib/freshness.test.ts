import { describe, expect, it } from 'vitest';
import { computeFreshness } from '../../src/lib/freshness';

const POLICY = { agingAfterMs: 60_000, staleAfterMs: 300_000 };
const NOW = Date.parse('2026-10-15T12:00:00Z');
const ago = (ms: number) => new Date(NOW - ms).toISOString();

describe('computeFreshness', () => {
  it('classifies by age', () => {
    expect(computeFreshness(ago(10_000), POLICY, 'READY', NOW)).toBe('FRESH');
    expect(computeFreshness(ago(120_000), POLICY, 'READY', NOW)).toBe('AGING');
    expect(computeFreshness(ago(600_000), POLICY, 'READY', NOW)).toBe('STALE');
  });

  it('never reports fresh without a timestamp', () => {
    expect(computeFreshness(null, POLICY, 'READY', NOW)).toBe('UNKNOWN');
  });

  it('reports UNAVAILABLE when the backend failed, even if older data exists', () => {
    expect(computeFreshness(ago(1_000), POLICY, 'UNAVAILABLE', NOW)).toBe('UNAVAILABLE');
    expect(computeFreshness(ago(1_000), POLICY, 'ERROR', NOW)).toBe('UNAVAILABLE');
  });

  it('honours an explicit STALE load state', () => {
    expect(computeFreshness(ago(1_000), POLICY, 'STALE', NOW)).toBe('STALE');
  });
});
