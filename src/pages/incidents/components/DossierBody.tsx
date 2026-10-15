import type React from 'react';
import type { AnalystNote, DossierTab, ProcessNode } from '../incidents.types';
import { ForensicsTab } from './ForensicsTab';
import { NotesTab } from './NotesTab';
import { ProcessTreeTab } from './ProcessTreeTab';
import { TimelineTab } from './TimelineTab';

interface DossierBodyProps {
  activeTab: DossierTab;
  incidentId: string;
  processTree: ProcessNode[];
  selectedProcessNode: ProcessNode | null;
  onSelectProcessNode: (node: ProcessNode) => void;
  notes: AnalystNote[] | undefined;
  newNoteText: string;
  onNewNoteTextChange: (value: string) => void;
  onAddNote: () => void;
}

export const DossierBody: React.FC<DossierBodyProps> = ({
  activeTab,
  incidentId,
  processTree,
  selectedProcessNode,
  onSelectProcessNode,
  notes,
  newNoteText,
  onNewNoteTextChange,
  onAddNote,
}) => (
  <div className="flex-1 p-4 overflow-y-auto">
    {activeTab === 'TREE' && (
      <ProcessTreeTab processTree={processTree} selectedNode={selectedProcessNode} onSelectNode={onSelectProcessNode} />
    )}
    {activeTab === 'TIMELINE' && <TimelineTab />}
    {activeTab === 'FORENSICS' && <ForensicsTab />}
    {activeTab === 'NOTES' && (
      <NotesTab
        incidentId={incidentId}
        notes={notes}
        newNoteText={newNoteText}
        onNewNoteTextChange={onNewNoteTextChange}
        onAddNote={onAddNote}
      />
    )}
  </div>
);
