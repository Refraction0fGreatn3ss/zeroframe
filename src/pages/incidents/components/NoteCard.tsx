import { UserCheck } from 'lucide-react';
import type React from 'react';
import type { AnalystNote } from '../incidents.types';

interface NoteCardProps {
  note: AnalystNote;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => (
  <div className="p-3 rounded bg-[#080d19] border border-slate-800/80 space-y-1.5 font-sans">
    <div className="flex items-center justify-between text-[11px] border-b border-slate-800/50 pb-1">
      <span className="font-semibold text-cyan-300 font-mono flex items-center gap-1.5">
        <UserCheck className="w-3 h-3 text-cyan-400" />
        <span>{note.author}</span>
      </span>
      <span className="text-slate-500 font-mono text-[10px]">{note.timestamp}</span>
    </div>
    <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
  </div>
);
