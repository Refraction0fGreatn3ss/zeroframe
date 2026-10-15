import type React from 'react';
import type { ProcessNode } from '../incidents.types';
import { ProcessNodeCard } from './ProcessNodeCard';
import { ProcessNodeInspector } from './ProcessNodeInspector';

interface ProcessTreeTabProps {
  processTree: ProcessNode[];
  selectedNode: ProcessNode | null;
  onSelectNode: (node: ProcessNode) => void;
}

export const ProcessTreeTab: React.FC<ProcessTreeTabProps> = ({ processTree, selectedNode, onSelectNode }) => (
  <div className="space-y-4">
    <div className="text-xs text-slate-400 font-sans">
      Interactive endpoint process spawning and correlated network wire sockets. Select any node to inspect command
      lines and cryptographic hashes.
    </div>

    <div className="space-y-3 font-mono">
      {processTree.map((node, index) => (
        <ProcessNodeCard
          key={node.id}
          node={node}
          depth={index}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelectNode}
        />
      ))}
    </div>

    {selectedNode && <ProcessNodeInspector node={selectedNode} />}
  </div>
);
