import type React from 'react';
import type { AnalystNote } from '../incidents.types';
import { NoteCard } from './NoteCard';
import { NoteComposer } from './NoteComposer';

interface NotesTabProps {
  incidentId: string;
  notes: AnalystNote[] | undefined;
  newNoteText: string;
  onNewNoteTextChange: (value: string) => void;
  onAddNote: () => void;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  incidentId,
  notes,
  newNoteText,
  onNewNoteTextChange,
  onAddNote,
}) => (
  <div className="space-y-4 font-sans text-xs">
    <NoteComposer value={newNoteText} onChange={onNewNoteTextChange} onSubmit={onAddNote} />

    <div className="space-y-2.5">
      <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
        Case Activity & Notes History ({notes?.length || 0})
      </span>
      {!notes || notes.length === 0 ? (
        <div className="p-4 text-center text-slate-500 text-xs rounded border border-slate-800 bg-[#060912]">
          No analyst notes recorded yet for Case {incidentId}.
        </div>
      ) : (
        notes.map((note) => <NoteCard key={note.id} note={note} />)
      )}
    </div>
  </div>
);
