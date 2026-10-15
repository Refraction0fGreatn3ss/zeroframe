import type React from 'react';
import type { ProcessNode } from '../incidents.types';

interface ProcessNodeInspectorProps {
  node: ProcessNode;
}

export const ProcessNodeInspector: React.FC<ProcessNodeInspectorProps> = ({ node }) => (
  <div className="p-3.5 bg-[#080c14] border border-slate-800 rounded space-y-2 text-xs font-mono">
    <div className="flex items-center justify-between text-slate-300 font-semibold">
      <span>Node Inspector: {node.name}</span>
      <span className="text-cyan-400">{node.status}</span>
    </div>

    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
      <div>
        <span className="text-slate-500">Process ID:</span> {node.pid}
      </div>
      <div>
        <span className="text-slate-500">User Context:</span> {node.user}
      </div>
      {node.hash && (
        <div className="col-span-2 break-all">
          <span className="text-slate-500">SHA-256 Hash:</span> <code className="text-rose-300">{node.hash}</code>
        </div>
      )}
    </div>
  </div>
);
