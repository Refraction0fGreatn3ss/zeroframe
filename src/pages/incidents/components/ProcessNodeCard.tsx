import type React from 'react';
import type { ProcessNode } from '../incidents.types';
import { getProcessNodeCardClass, getProcessNodeIndent, getProcessNodeStatusTextClass } from '../incidents.utils';

interface ProcessNodeCardProps {
  node: ProcessNode;
  depth: number;
  isSelected: boolean;
  onSelect: (node: ProcessNode) => void;
}

export const ProcessNodeCard: React.FC<ProcessNodeCardProps> = ({ node, depth, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(node)}
    className={`p-3 rounded border transition-all cursor-pointer relative ${getProcessNodeCardClass(node.status, isSelected)}`}
    style={{ marginLeft: getProcessNodeIndent(depth) }}
  >
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${getProcessNodeStatusTextClass(node.status, 'text-slate-300')}`}>
          {node.name}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">PID {node.pid}</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">{node.user}</span>
      </div>

      <span className={`text-[10px] font-semibold ${getProcessNodeStatusTextClass(node.status, 'text-slate-500')}`}>
        {node.type}
      </span>
    </div>

    <div className="mt-1.5 p-1.5 rounded bg-[#05070c] border border-slate-900 text-[11px] text-slate-300 break-all select-text">
      <code>{node.cmdline}</code>
    </div>

    <div className="mt-1 text-[11px] text-slate-500 font-sans">{node.meta}</div>
  </div>
);
