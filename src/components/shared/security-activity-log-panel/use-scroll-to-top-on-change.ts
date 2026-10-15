import { useEffect, useRef } from 'react';

export function useScrollToTopOnChange(itemCount: number, enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: itemCount is the trigger; scroll whenever a new item arrives
  useEffect(() => {
    if (enabled && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [itemCount, enabled]);

  return containerRef;
}
