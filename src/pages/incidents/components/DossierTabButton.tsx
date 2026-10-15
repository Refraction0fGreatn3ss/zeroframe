import type { LucideIcon } from 'lucide-react';
import type React from 'react';

interface DossierTabButtonProps {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const DossierTabButton: React.FC<DossierTabButtonProps> = ({ icon: Icon, isActive, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
      isActive ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    <span>{children}</span>
  </button>
);
