import { useState } from 'react';
import { CURRENT_OPERATOR_AUTHOR, INITIAL_ANALYST_NOTES } from '../incidents.data';
import type { AnalystNote, AnalystNotesByIncident } from '../incidents.types';

export const useAnalystNotes = (incidentId: string | undefined) => {
  const [analystNotes, setAnalystNotes] = useState<AnalystNotesByIncident>(INITIAL_ANALYST_NOTES);
  const [newNoteText, setNewNoteText] = useState('');

  const notes: AnalystNote[] | undefined = incidentId ? analystNotes[incidentId] : undefined;

  const addNote = () => {
    if (!newNoteText.trim() || !incidentId) return;
    const newNote: AnalystNote = {
      id: `note-${Date.now()}`,
      author: CURRENT_OPERATOR_AUTHOR,
      timestamp: `${new Date().toLocaleTimeString()} UTC`,
      content: newNoteText.trim(),
    };
    setAnalystNotes((prev) => ({
      ...prev,
      [incidentId]: [newNote, ...(prev[incidentId] || [])],
    }));
    setNewNoteText('');
  };

  return { notes, newNoteText, setNewNoteText, addNote };
};
