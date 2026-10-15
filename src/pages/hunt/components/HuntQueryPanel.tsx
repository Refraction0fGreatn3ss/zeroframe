import type React from 'react';
import type { HuntFilters } from '../hooks/use-hunt-filters';
import type { SavedHuntsState } from '../hooks/use-saved-hunts';
import { HuntQueryBar } from './HuntQueryBar';
import { ProtocolFilterPills } from './ProtocolFilterPills';
import { SavedHuntsPanel } from './SavedHuntsPanel';
import { SaveHuntForm } from './SaveHuntForm';

interface HuntQueryPanelProps {
  filters: HuntFilters;
  savedHunts: SavedHuntsState;
}

export const HuntQueryPanel: React.FC<HuntQueryPanelProps> = ({ filters, savedHunts }) => (
  <div className="p-3 bg-[#090d16] border border-slate-800 rounded space-y-2.5">
    <HuntQueryBar query={filters.query} onQueryChange={filters.setQuery} onToggleSave={savedHunts.toggleSavingHunt} />

    {savedHunts.isSavingHunt && (
      <SaveHuntForm
        label={savedHunts.newHuntLabel}
        onLabelChange={savedHunts.setNewHuntLabel}
        onSave={() => savedHunts.saveQuery(filters.query)}
        onCancel={savedHunts.cancelSavingHunt}
      />
    )}

    <SavedHuntsPanel
      savedHunts={savedHunts.savedHunts}
      activeQuery={filters.query}
      onSelect={filters.setQuery}
      onDelete={savedHunts.deleteSavedHunt}
    />

    <ProtocolFilterPills selectedProtocol={filters.selectedProtocol} onSelect={filters.setSelectedProtocol} />
  </div>
);
