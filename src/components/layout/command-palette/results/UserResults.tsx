import { User } from 'lucide-react';
import type React from 'react';
import type { IndexedUser } from '../command-palette.data';
import { PaletteResultRow } from '../PaletteResultRow';
import { PaletteSection } from '../PaletteSection';

interface UserResultsProps {
  items: IndexedUser[];
  onNavigate: (path: string) => void;
}

export const UserResults: React.FC<UserResultsProps> = ({ items, onNavigate }) => (
  <PaletteSection title="Enterprise Users & Identities" matchCount={items.length} accentClassName="text-amber-400">
    {items.map((u) => (
      <PaletteResultRow key={u.username} onSelect={() => onNavigate('/admin/system')}>
        <div className="flex items-center gap-2 truncate">
          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-amber-300">{u.name}</span>
          <span className="font-mono text-[11px] text-zinc-400">{u.email}</span>
          <span className="text-[10px] text-zinc-500">[{u.role}]</span>
        </div>
      </PaletteResultRow>
    ))}
  </PaletteSection>
);
