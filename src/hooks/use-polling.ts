import { useEffect, useRef } from 'react';

/** Polls a backend status endpoint. Use for real job state only; never to advance a lifecycle locally. */
export function usePolling(poll: () => void | Promise<void>, intervalMs: number, enabled: boolean): void {
  const pollRef = useRef(poll);

  useEffect(() => {
    pollRef.current = poll;
  }, [poll]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => void pollRef.current(), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, enabled]);
}
