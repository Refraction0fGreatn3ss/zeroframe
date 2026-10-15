import { describe, expect, it } from 'vitest';
import { RealtimeSequencer } from '../../src/services/realtime-sequencer';

describe('RealtimeSequencer', () => {
  it('accepts in-order events and drops duplicates', () => {
    const sequencer = new RealtimeSequencer();
    sequencer.acknowledgeConnect(10);
    expect(sequencer.observe(11)).toBe('IN_ORDER');
    expect(sequencer.observe(11)).toBe('DUPLICATE');
  });

  it('detects gaps and still accepts the replayed missing events', () => {
    const sequencer = new RealtimeSequencer();
    sequencer.acknowledgeConnect(10);
    expect(sequencer.observe(13)).toBe('GAP');
    expect(sequencer.observe(11)).toBe('IN_ORDER');
    expect(sequencer.observe(12)).toBe('IN_ORDER');
    expect(sequencer.observe(12)).toBe('DUPLICATE');
  });

  it('detects a backend restart when the server sequence goes backwards', () => {
    const sequencer = new RealtimeSequencer();
    sequencer.acknowledgeConnect(50);
    sequencer.observe(51);
    expect(sequencer.acknowledgeConnect(3)).toBe('RESTARTED');
    expect(sequencer.observe(4)).toBe('IN_ORDER');
  });

  it('ignores unsequenced frames', () => {
    expect(new RealtimeSequencer().observe(undefined)).toBe('UNSEQUENCED');
  });
});
