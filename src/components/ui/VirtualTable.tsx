import { useVirtualizer } from '@tanstack/react-virtual';
import { type KeyboardEvent, type ReactNode, useRef } from 'react';

export interface VirtualColumn<TRow> {
  id: string;
  header: string;
  cell: (row: TRow) => ReactNode;
  className?: string;
}

interface VirtualTableProps<TRow> {
  rows: readonly TRow[];
  columns: readonly VirtualColumn<TRow>[];
  getRowId: (row: TRow) => string;
  caption: string;
  onRowActivate?: (row: TRow) => void;
  selectedRowId?: string | null;
  rowHeight?: number;
  maxHeightClassName?: string;
}

const DEFAULT_ROW_HEIGHT = 34;
const OVERSCAN_ROWS = 12;

export function VirtualTable<TRow>({
  rows,
  columns,
  getRowId,
  caption,
  onRowActivate,
  selectedRowId,
  rowHeight = DEFAULT_ROW_HEIGHT,
  maxHeightClassName = 'max-h-[60vh]',
}: VirtualTableProps<TRow>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN_ROWS,
  });

  const items = virtualizer.getVirtualItems();
  const paddingTop = items.length > 0 ? items[0].start : 0;
  const paddingBottom = items.length > 0 ? virtualizer.getTotalSize() - items[items.length - 1].end : 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: TRow) => {
    if (onRowActivate && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onRowActivate(row);
    }
  };

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto border border-[var(--zf-border-subtle)] rounded bg-[var(--zf-surface-card)] ${maxHeightClassName}`}
    >
      <table className="w-full text-left text-xs" aria-rowcount={rows.length + 1}>
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 z-10 bg-[var(--zf-table-header-bg)] text-[var(--zf-text-muted)] text-[10px] uppercase tracking-wide">
          <tr aria-rowindex={1}>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-2.5 py-2 font-semibold whitespace-nowrap ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--zf-border-subtle)] text-[var(--zf-text-secondary)]">
          {paddingTop > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: paddingTop }} />
            </tr>
          )}
          {items.map((item) => {
            const row = rows[item.index];
            const rowId = getRowId(row);
            const selected = rowId === selectedRowId;
            return (
              <tr
                key={rowId}
                aria-rowindex={item.index + 2}
                aria-selected={onRowActivate ? selected : undefined}
                tabIndex={onRowActivate ? 0 : undefined}
                onClick={onRowActivate ? () => onRowActivate(row) : undefined}
                onKeyDown={onRowActivate ? (event) => handleKeyDown(event, row) : undefined}
                style={{ height: rowHeight }}
                className={`${onRowActivate ? 'cursor-pointer hover:bg-[var(--zf-table-row-hover)] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-[var(--zf-border-focus)]' : ''} ${selected ? 'bg-[var(--zf-brand-accent-subtle)]' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.id} className={`px-2.5 py-1.5 whitespace-nowrap ${column.className ?? ''}`}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td colSpan={columns.length} style={{ height: paddingBottom }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
