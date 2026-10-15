import type { FC, ReactNode } from 'react';

export interface KeyValueEntry {
  label: string;
  value: ReactNode;
}

interface KeyValueListProps {
  entries: KeyValueEntry[];
}

const EMPTY_VALUE = '—';

export const KeyValueList: FC<KeyValueListProps> = ({ entries }) => (
  <dl className="grid grid-cols-[minmax(110px,40%)_1fr] gap-x-3 gap-y-1.5 text-[11px]">
    {entries.map((entry) => (
      <div key={entry.label} className="contents">
        <dt className="text-[var(--zf-text-muted)]">{entry.label}</dt>
        <dd className="text-[var(--zf-text-primary)] font-mono break-all min-w-0">
          {entry.value === null || entry.value === undefined || entry.value === '' ? EMPTY_VALUE : entry.value}
        </dd>
      </div>
    ))}
  </dl>
);
