/**
 * Entity Graph Page
 * Full interactive topology and relationship provenance workbench.
 */

import React from 'react';
import { useInvestigationStore } from '../stores/investigation-store';
import { EntityGraphView } from '../components/shared/EntityGraphView';
import { ExportButton } from '../components/shared/ExportButton';

export const EntityGraphPage: React.FC = () => {
  const { entities, selectedEntityId, selectEntity } = useInvestigationStore();

  return (
    <div className="p-6 space-y-6 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Authoritative Entity Graph</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Provenance tracking for Discovered, Declared, Imported, and Inferred relationships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton resourceName="Entity Graph Topology" recordCount={entities.length} data={entities} />
        </div>
      </div>

      {/* Graph Component */}
      <EntityGraphView
        entities={entities}
        selectedEntityId={selectedEntityId}
        onSelectEntity={selectEntity}
      />
    </div>
  );
};
