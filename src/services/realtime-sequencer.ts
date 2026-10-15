export type SequenceVerdict = 'IN_ORDER' | 'DUPLICATE' | 'GAP' | 'UNSEQUENCED';

const SEEN_WINDOW = 1000;

export class RealtimeSequencer {
  private highestSeq = 0;
  private readonly seen = new Set<number>();

  get current(): number {
    return this.highestSeq;
  }

  reset(seq = 0): void {
    this.highestSeq = seq;
    this.seen.clear();
  }

  /** A CONNECTED frame below our cursor means the backend restarted and its sequence space was reset. */
  acknowledgeConnect(serverSeq: number | undefined): 'RESUMED' | 'RESTARTED' | 'FRESH' {
    if (serverSeq === undefined) return 'FRESH';
    if (this.highestSeq === 0) {
      this.highestSeq = serverSeq;
      return 'FRESH';
    }
    if (serverSeq < this.highestSeq) {
      this.reset(serverSeq);
      return 'RESTARTED';
    }
    return 'RESUMED';
  }

  observe(seq: unknown): SequenceVerdict {
    if (typeof seq !== 'number') return 'UNSEQUENCED';
    if (this.seen.has(seq) || (this.highestSeq > 0 && seq <= this.highestSeq - SEEN_WINDOW)) return 'DUPLICATE';

    this.remember(seq);
    const isGap = this.highestSeq > 0 && seq > this.highestSeq + 1;
    this.highestSeq = Math.max(this.highestSeq, seq);
    return isGap ? 'GAP' : 'IN_ORDER';
  }

  private remember(seq: number): void {
    this.seen.add(seq);
    if (this.seen.size > SEEN_WINDOW) {
      const oldest = this.seen.values().next().value;
      if (oldest !== undefined) this.seen.delete(oldest);
    }
  }
}
