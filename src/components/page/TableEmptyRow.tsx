import type React from 'react';
import type { ReactNode } from 'react';

interface TableEmptyRowProps {
  colSpan: number;
  children: ReactNode;
}

export const TableEmptyRow: React.FC<TableEmptyRowProps> = ({ colSpan, children }) => (
  <tr>
    <td colSpan={colSpan} className="py-8 text-center text-zinc-500 font-mono text-xs">
      {children}
    </td>
  </tr>
);
