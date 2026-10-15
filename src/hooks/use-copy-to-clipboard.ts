import { useEffect, useRef, useState } from 'react';

const COPY_FEEDBACK_DURATION_MS = 2000;

export function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = (text: string, key: string = text) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopiedKey(null), COPY_FEEDBACK_DURATION_MS);
  };

  return { copiedKey, copy };
}
