import { ChevronRight } from 'lucide-react';
import type React from 'react';

interface PaletteResultRowProps {
  onSelect: () => void;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

export const PaletteResultRow: React.FC<PaletteResultRowProps> = ({ onSelect, trailing, children }) => (
  <div
    onClick={onSelect}
    className="px-2.5 py-1.5 rounded hover:bg-[#15181e] cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
  >
    {children}
    {trailing ?? <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
  </div>
);
