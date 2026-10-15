import type React from 'react';
import type { ReactNode } from 'react';

const BASE_HEADER_CELL_CLASS = 'py-2.5 px-3';

export interface DataTableColumn {
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: readonly DataTableColumn[];
  children: ReactNode;
  caption?: ReactNode;
}

const headerCellClassName = (column: DataTableColumn): string =>
  column.className ? `${BASE_HEADER_CELL_CLASS} ${column.className}` : BASE_HEADER_CELL_CLASS;

export const DataTable: React.FC<DataTableProps> = ({ columns, children, caption }) => (
  <div className="bg-[#101215] border border-[#20242a] rounded overflow-hidden">
    {caption}

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-[#14171c] border-b border-[#20242a] text-zinc-400 text-[11px] font-medium">
          <tr>
            {columns.map((column) => (
              <th key={column.label} className={headerCellClassName(column)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181b20] text-zinc-300">{children}</tbody>
      </table>
    </div>
  </div>
);
