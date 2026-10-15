import type React from 'react';
import { useState } from 'react';
import { INITIAL_SAVED_HUNTS } from '../hunt.data';
import type { SavedHunt } from '../hunt.types';

export const CUSTOM_HUNT_ID_PREFIX = 'sh-custom';

export interface SavedHuntsState {
  savedHunts: SavedHunt[];
  isSavingHunt: boolean;
  toggleSavingHunt: () => void;
  cancelSavingHunt: () => void;
  newHuntLabel: string;
  setNewHuntLabel: (label: string) => void;
  saveQuery: (query: string) => void;
  deleteSavedHunt: (id: string, e: React.MouseEvent) => void;
}

export const useSavedHunts = (): SavedHuntsState => {
  const [savedHunts, setSavedHunts] = useState<SavedHunt[]>(INITIAL_SAVED_HUNTS);
  const [isSavingHunt, setIsSavingHunt] = useState(false);
  const [newHuntLabel, setNewHuntLabel] = useState('');

  const saveQuery = (query: string) => {
    if (!newHuntLabel.trim() || !query.trim()) return;
    const newEntry: SavedHunt = {
      id: `${CUSTOM_HUNT_ID_PREFIX}-${Date.now()}`,
      label: newHuntLabel.trim(),
      query: query.trim(),
    };
    setSavedHunts([...savedHunts, newEntry]);
    setNewHuntLabel('');
    setIsSavingHunt(false);
  };

  const deleteSavedHunt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedHunts(savedHunts.filter((h) => h.id !== id));
  };

  return {
    savedHunts,
    isSavingHunt,
    toggleSavingHunt: () => setIsSavingHunt(!isSavingHunt),
    cancelSavingHunt: () => setIsSavingHunt(false),
    newHuntLabel,
    setNewHuntLabel,
    saveQuery,
    deleteSavedHunt,
  };
};
