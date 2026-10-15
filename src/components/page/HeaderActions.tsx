import type React from 'react';
import type { ReactNode } from 'react';

interface HeaderActionsProps {
  children: ReactNode;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);
